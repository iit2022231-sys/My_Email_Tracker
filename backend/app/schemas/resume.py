from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ResumeCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)

class ResumeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)

class ResumeResponse(BaseModel):
    id: int
    name: str
    content: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ResumeListItem(BaseModel):
    id: int
    name: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
