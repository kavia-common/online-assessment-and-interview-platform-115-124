from functools import lru_cache
from pydantic import AnyUrl, Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = Field(default="development")
    APP_SECRET_KEY: str = Field(default="change_me")
    APP_CORS_ORIGINS: str = Field(default="http://localhost:3000")

    DATABASE_URL: str = Field(default="sqlite:///./dev.db")

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    REFRESH_TOKEN_EXPIRE_MINUTES: int = Field(default=60 * 24 * 30)

    FILE_STORAGE_BACKEND: str = Field(default="local")
    FILE_STORAGE_LOCAL_DIR: str = Field(default="./storage")

    S3_ENDPOINT: str | None = None
    S3_BUCKET: str | None = None
    S3_REGION: str | None = None
    S3_ACCESS_KEY_ID: str | None = None
    S3_SECRET_ACCESS_KEY: str | None = None

    EMAIL_BACKEND: str = Field(default="console")
    SMTP_HOST: str | None = None
    SMTP_PORT: int | None = None
    SMTP_USER: str | None = None
    SMTP_PASS: str | None = None
    SENDGRID_API_KEY: str | None = None

    REPORT_EXPORT_DIR: str = Field(default="./exports")

    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
    }

openapi_tags = [
    {"name": "Health", "description": "Service health checks"},
    {"name": "Auth", "description": "Authentication and authorization"},
    {"name": "Admin", "description": "Admin operations"},
    {"name": "HR", "description": "Human Resources operations"},
    {"name": "Candidate", "description": "Candidate-facing endpoints"},
    {"name": "Chat", "description": "Chat threads and messages"},
    {"name": "WebSocket", "description": "Real-time connections"},
]

# PUBLIC_INTERFACE
@lru_cache
def get_settings() -> Settings:
    """Return cached application settings loaded from environment."""
    return Settings()

settings = get_settings()
