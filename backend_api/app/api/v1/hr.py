from typing import List
from fastapi import APIRouter, Query
from app.services.report_exporter import export_results_csv

router = APIRouter()

# PUBLIC_INTERFACE
@router.get(
    "/assignments",
    summary="List assignments (stub)",
    description="Returns a minimal assignments list.",
    operation_id="hr_list_assignments",
)
def list_assignments():
    """Stub assignments list."""
    return [
        {"id": 1, "candidate": "Candidate One", "template": "General Aptitude", "status": "assigned", "due_at": None},
        {"id": 2, "candidate": "Candidate Two", "template": "Technical Round", "status": "started", "due_at": None},
    ]

# PUBLIC_INTERFACE
@router.get(
    "/results",
    summary="List results (stub)",
    description="Returns a minimal results list with scores.",
    operation_id="hr_list_results",
)
def list_results(
    q: str = Query(default="", description="Search term (stubbed)"),
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=200),
):
    items = [
        {"attempt_id": 101, "candidate": "Candidate One", "template": "General Aptitude", "score": 72, "status": "graded"},
        {"attempt_id": 102, "candidate": "Candidate Two", "template": "Technical Round", "score": 65, "status": "graded"},
    ]
    return {"items": items[:size], "total": len(items), "page": page, "size": size}

# PUBLIC_INTERFACE
@router.get(
    "/results/export",
    summary="Export results CSV",
    description="Exports filtered results to CSV and returns a path. Stub returns minimal CSV.",
    operation_id="hr_results_export",
)
def export_results(
    filters: str = Query(default="", description="Filter expression (stubbed)"),
    filename: str = Query(default="results.csv"),
):
    # Stubbed rows; integrate real query later
    rows: List[dict] = [
        {"attempt_id": 101, "candidate": "Candidate One", "template": "General Aptitude", "score": 72, "status": "graded"},
        {"attempt_id": 102, "candidate": "Candidate Two", "template": "Technical Round", "score": 65, "status": "graded"},
    ]
    path = export_results_csv(rows, filename=filename)
    return {"path": path}
