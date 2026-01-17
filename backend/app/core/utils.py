"""Utility functions and helpers for the application."""

from typing import TypeVar, Generic, Type, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

T = TypeVar('T')

class BaseRepository(Generic[T]):
    """Generic repository pattern for CRUD operations."""
    
    def __init__(self, model: Type[T], db: Session):
        self.model = model
        self.db = db
    
    def get_by_id(self, id: int) -> Optional[T]:
        """Get item by ID."""
        return self.db.query(self.model).filter(self.model.id == id).first()
    
    def get_or_404(self, id: int) -> T:
        """Get item by ID or raise 404."""
        item = self.get_by_id(id)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{self.model.__name__} not found"
            )
        return item
    
    def get_all(self):
        """Get all items."""
        return self.db.query(self.model).all()
    
    def create(self, obj: T) -> T:
        """Create new item."""
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj
    
    def update(self, obj: T) -> T:
        """Update item."""
        self.db.commit()
        self.db.refresh(obj)
        return obj
    
    def delete(self, obj: T) -> None:
        """Delete item."""
        self.db.delete(obj)
        self.db.commit()


class EmailValidator:
    """Centralized email validation."""
    
    @staticmethod
    def is_valid(email: str) -> bool:
        """Validate email format."""
        import re
        pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_list(emails: list[str]) -> bool:
        """Validate list of emails."""
        return all(EmailValidator.is_valid(email) for email in emails)
