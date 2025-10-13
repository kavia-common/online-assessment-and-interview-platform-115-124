from fastapi import APIRouter

router = APIRouter()

# PUBLIC_INTERFACE
@router.get(
    "/threads",
    summary="List chat threads (stub)",
    description="Returns an empty list as a placeholder.",
    operation_id="chat_list_threads",
)
def list_threads():
    """Stub threads list."""
    return []
