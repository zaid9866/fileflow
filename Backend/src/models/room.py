import uuid
import json
from datetime import datetime, UTC
from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from base import Base  

def dict_to_json(value):
    return json.dumps(value) if isinstance(value, dict) else value

def json_to_dict(value):
    return json.loads(value) if value else {}

class Room(Base):
    __tablename__ = "rooms"
    
    code = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    start_timing = Column(DateTime, default=lambda: datetime.now(UTC))
    end_timing = Column(DateTime, nullable=True)
    no_of_participant = Column(Integer, nullable=False)
    encryption_key = Column(String, nullable=False)
    restrict = Column(Boolean, nullable=False, default=False)
    blocked_user = Column(Text, nullable=True)

    users = relationship("User", back_populates="room")
    shared_contents = relationship("SharedContent", back_populates="room")
    chats = relationship("Chat", back_populates="room")

    def set_blocked_user(self, data: dict):
        """ Convert dictionary to JSON string before storing """
        self.blocked_user = json.dumps(data)

    def get_blocked_user(self) -> dict:
        """ Convert JSON string back to dictionary """
        return json.loads(self.blocked_user) if self.blocked_user else {}

__all__ = ["Room"]
