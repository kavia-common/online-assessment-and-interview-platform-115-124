from datetime import datetime
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select, desc, asc, and_
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.proctor_event import ProctorEvent

router = APIRouter()

class EventIn(BaseModel):
    session_id: str = Field(..., description="Client session identifier")
    attempt_id: int = Field(..., description="Attempt ID this event belongs to")
    event_type: str = Field(..., description="Event type string")
    payload: Optional[dict] = Field(default=None, description="Arbitrary metadata")

class EventOut(BaseModel):
    id: int
    session_id: str
    attempt_id: int
    event_type: str
    payload: Optional[dict] = None
    occurred_at: datetime

    class Config:
        from_attributes = True

class BulkEventsIn(BaseModel):
    events: List[EventIn] = Field(..., description="List of events to ingest in bulk")

class PaginatedEvents(BaseModel):
    items: List[EventOut]
    total: int
    page: int
    size: int

# PUBLIC_INTERFACE
@router.post(
    "/",
    response_model=EventOut,
    summary="Ingest a single proctor event",
    description="Stores a single proctor event for a given attempt/session.",
    operation_id="events_ingest_one",
)
def ingest_event(payload: EventIn, db: Session = Depends(get_db)):
    """Create a single event record."""
    obj = ProctorEvent(
        session_id=payload.session_id,
        attempt_id=payload.attempt_id,
        event_type=payload.event_type,
        payload=payload.payload,
        occurred_at=datetime.utcnow(),
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

# PUBLIC_INTERFACE
@router.post(
    "/bulk",
    response_model=dict,
    summary="Bulk ingest proctor events",
    description="Stores a list of proctor events. Returns count ingested.",
    operation_id="events_ingest_bulk",
)
def ingest_events_bulk(body: BulkEventsIn, db: Session = Depends(get_db)):
    """Bulk insert events for efficiency used by the frontend logger."""
    to_create = []
    now = datetime.utcnow()
    for ev in body.events:
        to_create.append(
            ProctorEvent(
                session_id=ev.session_id,
                attempt_id=ev.attempt_id,
                event_type=ev.event_type,
                payload=ev.payload,
                occurred_at=now,
            )
        )
    if to_create:
        db.add_all(to_create)
        db.commit()
    return {"ingested": len(to_create)}

# PUBLIC_INTERFACE
@router.get(
    "/",
    response_model=PaginatedEvents,
    summary="Query proctor events",
    description="Paginated list of events with filters for attempt, session, and event_type.",
    operation_id="events_query",
)
def list_events(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=200, description="Page size"),
    attempt_id: Optional[int] = Query(None, description="Filter by attempt id"),
    session_id: Optional[str] = Query(None, description="Filter by session id"),
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    sort: str = Query("desc", description="Sort by occurred_at: asc|desc"),
):
    """Return filtered, paginated events."""
    filters = []
    if attempt_id is not None:
        filters.append(ProctorEvent.attempt_id == attempt_id)
    if session_id is not None:
        filters.append(ProctorEvent.session_id == session_id)
    if event_type is not None:
        filters.append(ProctorEvent.event_type == event_type)

    stmt = select(ProctorEvent)
    if filters:
        stmt = stmt.where(and_(*filters))
    total = db.execute(
        (select(ProctorEvent.id).where(and_(*filters)) if filters else select(ProctorEvent.id))
    ).all()
    total_count = len(total)

    order_by = asc(ProctorEvent.occurred_at) if sort == "asc" else desc(ProctorEvent.occurred_at)
    stmt = stmt.order_by(order_by).limit(size).offset((page - 1) * size)
    items = db.execute(stmt).scalars().all()

    return PaginatedEvents(items=items, total=total_count, page=page, size=size)
