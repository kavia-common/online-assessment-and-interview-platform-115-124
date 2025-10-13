from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

router = APIRouter()

class LoginRequest(BaseModel):
    email: str = Field(..., description="User email")
    password: str = Field(..., description="User password")

class TokenResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")

# PUBLIC_INTERFACE
@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login",
    description="Authenticate user and return an access token (stub).",
    operation_id="auth_login",
)
def login(payload: LoginRequest):
    """Stub login returning a placeholder token."""
    return TokenResponse(access_token="stub-token", token_type="bearer")
