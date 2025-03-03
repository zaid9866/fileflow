import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from base import Base  
from datetime import datetime, UTC

class SharedContent(Base):
    __tablename__ = "shared_content"
    
    content_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String, ForeignKey("rooms.code"), nullable=False)
    url = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    shared_by = Column(String, ForeignKey("users.user_id"), nullable=False)
    timing = Column(DateTime, default=lambda: datetime.now(UTC))

    room = relationship("Room", back_populates="shared_contents")

__all__ = ["SharedContent"]
