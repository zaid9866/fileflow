import uuid
from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from base import Base  

class Chat(Base):
    __tablename__ = "chats"
    
    chat_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String, nullable=False)
    sender = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    timing = Column(String, nullable=False)

__all__ = ["Chat"]
