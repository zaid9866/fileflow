import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from base import Base  
from datetime import datetime, UTC

class Chat(Base):
    __tablename__ = "chats"
    
    chat_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String, ForeignKey("rooms.code"), nullable=False)
    sender = Column(String, ForeignKey("users.user_id"), nullable=False)
    message = Column(Text, nullable=False)
    timing = Column(DateTime, default=lambda: datetime.now(UTC))

    room = relationship("Room", back_populates="chats")
    sender_user = relationship("User", back_populates="chats")

__all__ = ["Chat"]
