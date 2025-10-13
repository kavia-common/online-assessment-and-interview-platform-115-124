from fastapi import APIRouter

router = APIRouter()

# PUBLIC_INTERFACE
@router.get(
    "/users",
    summary="List users (stub)",
    description="Returns an empty list as a placeholder.",
    operation_id="admin_list_users",
)
def list_users():
    """Stub users list."""
    return []
