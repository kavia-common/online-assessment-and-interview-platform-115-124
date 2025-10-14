from typing import List
from fastapi import APIRouter, Query
from app.services.report_exporter import export_results_csv

router = APIRouter()

# PUBLIC_INTERFACE
@router.get(
    "/assignments",
    summary="List assignments (stub)",
    description="Returns an empty list as a placeholder.",
    operation_id="hr_list_assignments",
)
def list_assignments():
    """Stub assignments list."""
    return []

# PUBLIC_INTERFACE
@router.get(
    "/results/export",
    summary="Export results CSV",
    description="Exports filtered results to CSV and returns a path. Stub returns empty CSV.",
    operation_id="hr_results_export",
)
def export_results(
    filters: str = Query(default="", description="Filter expression (stubbed)"),
    filename: str = Query(default="results.csv"),
):
    # Stubbed rows; integrate real query later
    rows: List[dict] = []
    path = export_results_csv(rows, filename=filename)
    return {"path": path}
