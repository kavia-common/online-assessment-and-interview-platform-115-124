from fastapi import APIRouter

router = APIRouter()

# PUBLIC_INTERFACE
@router.get(
    "/",
    summary="Health check",
    description="Basic health endpoint to verify the service is running.",
    operation_id="health_check",
    responses={200: {"description": "Service healthy"}},
)
def health():
    """Return a basic health status."""
    return {"status": "ok"}
