from fastapi import APIRouter

router = APIRouter()

# PUBLIC_INTERFACE
@router.get(
    "/profile",
    summary="Get candidate profile (stub)",
    description="Returns a placeholder profile.",
    operation_id="candidate_get_profile",
)
def get_profile():
    """Stub candidate profile."""
    return {"name": "Candidate", "status": "stub"}
