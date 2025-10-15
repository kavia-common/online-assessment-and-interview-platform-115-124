from fastapi import APIRouter

router = APIRouter()

# PUBLIC_INTERFACE
@router.get(
    "/profile",
    summary="Get candidate profile (stub)",
    description="Returns a placeholder profile with minimal fields.",
    operation_id="candidate_get_profile",
)
def get_profile():
    """Stub candidate profile."""
    return {
        "id": 1,
        "name": "Candidate One",
        "email": "candidate@example.com",
        "phone": "",
        "resume_uploaded": False,
        "skills": ["JavaScript", "Python"],
        "status": "active",
    }
