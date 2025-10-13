from pydantic import BaseModel

class TemplateBase(BaseModel):
    name: str
    description: str | None = None
    duration_minutes: int = 60

class Template(TemplateBase):
    id: int
    class Config:
        from_attributes = True

class TemplateSectionBase(BaseModel):
    title: str
    question_type: str
    num_questions: int
    marks_per_question: int

class TemplateSection(TemplateSectionBase):
    id: int
    class Config:
        from_attributes = True
