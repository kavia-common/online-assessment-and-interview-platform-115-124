from fastapi import APIRouter

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
