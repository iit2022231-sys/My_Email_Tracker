from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from .base import Base

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, unique=True)
    name = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    position = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<Contact(id={self.id}, email={self.email}, name={self.name})>"
