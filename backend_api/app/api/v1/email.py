from enum import Enum
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()

class EmailStatus(str, Enum):
    queued = "queued"
    sending = "sending"
    sent = "sent"
    failed = "failed"

class EmailCreate(BaseModel):
    to: str = Field(..., description="Recipient")
    subject: str = Field(..., description="Subject")
    template: Optional[str] = Field(default=None, description="Template name")
    payload: Optional[dict] = Field(default=None, description="Template payload")

# public memory store for stub status
_email_jobs: dict[int, dict] = {}
_next_id = 1

# PUBLIC_INTERFACE
@router.post(
    "/queue",
    summary="Queue an email",
    description="Queues an email to be sent (stub). Returns job id.",
    operation_id="email_queue",
)
def queue_email(body: EmailCreate):
    global _next_id
    job = {
        "id": _next_id,
        "to": body.to,
        "subject": body.subject,
        "template": body.template,
        "payload": body.payload,
        "status": EmailStatus.queued,
    }
    _email_jobs[_next_id] = job
    _next_id += 1
    return job

# PUBLIC_INTERFACE
@router.get(
    "/queue/{job_id}",
    summary="Get email job status",
    description="Returns the current status of a queued email (stub).",
    operation_id="email_queue_status",
)
def get_email_status(job_id: int):
    return _email_jobs.get(job_id, {"id": job_id, "status": EmailStatus.failed})
