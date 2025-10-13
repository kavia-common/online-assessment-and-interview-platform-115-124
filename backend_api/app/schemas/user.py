from pydantic import BaseModel

class RoleBase(BaseModel):
    name: str
    description: str | None = None

class Role(RoleBase):
    id: int
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: str
    full_name: str | None = None
    is_active: bool = True
    role_id: int | None = None

class User(UserBase):
    id: int
    class Config:
        from_attributes = True
