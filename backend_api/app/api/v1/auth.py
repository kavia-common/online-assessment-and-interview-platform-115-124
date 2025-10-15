from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from app.core.security import create_access_token

router = APIRouter()

class LoginRequest(BaseModel):
    email: str = Field(..., description="User email")
    password: str = Field(..., description="User password")

class TokenResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")

class UserOut(BaseModel):
    id: int = Field(..., description="User id (stub)")
    email: str = Field(..., description="Email")
    role: str = Field(..., description="Role name")
    name: str = Field(..., description="Full name")

# PUBLIC_INTERFACE
@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login",
    description="Authenticate user and return an access token (stub).",
    operation_id="auth_login",
)
def login(payload: LoginRequest):
    """Stub login returning a signed token with email and role claims."""
    # In dev stub, accept any email/password and return a token embedding email and role
    claims = {"sub": payload.email, "role": "candidate", "name": payload.email.split("@")[0].title()}
    token = create_access_token(claims)
    return TokenResponse(access_token=token, token_type="bearer")

# PUBLIC_INTERFACE
@router.get(
    "/me",
    response_model=UserOut,
    summary="Get current user (stub)",
    description="Returns current user info decoded from JWT in a real impl; here returns a stubbed user.",
    operation_id="auth_me",
)
def me():
    """Return a minimal stubbed user profile for frontend integration."""
    # This stub returns a fixed user; production should decode token and fetch user record
    return UserOut(id=1, email="candidate@example.com", role="candidate", name="Candidate One")
