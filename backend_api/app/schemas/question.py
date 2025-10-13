from pydantic import BaseModel

class OptionBase(BaseModel):
    text: str
    is_correct: bool = False

class Option(OptionBase):
    id: int
    class Config:
        from_attributes = True

class QuestionBase(BaseModel):
    type: str
    text: str
    difficulty: int = 1
    tags: str | None = None
    is_active: bool = True

class Question(QuestionBase):
    id: int
    class Config:
        from_attributes = True
