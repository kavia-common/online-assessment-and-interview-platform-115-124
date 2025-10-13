from typing import Generator
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.user import User

# PUBLIC_INTERFACE
def get_current_user(db: Session = Depends(get_db)) -> User:
    """
    Resolve the current authenticated user from request context (stub).
    Raises 401 as not implemented yet.
    """
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication not implemented")
