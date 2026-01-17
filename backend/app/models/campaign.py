from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from .base import Base

class Campaign(Base):
    __tablename__ = "campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    recipient_count = Column(Integer, default=0)
    sent_count = Column(Integer, default=0)
    status = Column(String(50), default="draft")  # draft, sent, scheduled
    created_at = Column(DateTime, default=datetime.utcnow)
    sent_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<Campaign(id={self.id}, name={self.name}, status={self.status})>"
