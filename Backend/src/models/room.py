import uuid
import json
from datetime import datetime, UTC
from sqlalchemy import Column, String, Integer, Time, Text, Boolean
from sqlalchemy.orm import relationship
from base import Base  

def dict_to_json(value):
    return json.dumps(value) if isinstance(value, dict) else value

def json_to_dict(value):
    return json.loads(value) if value else {}

class Room(Base):
    __tablename__ = "rooms"
    
    code = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    start_timing = Column(Time, default=lambda: datetime.now().time()) 
    end_timing = Column(Time, nullable=True)
    current_participant = Column(Integer, nullable=False,default=1)
    max_participant = Column(Integer, nullable=False, default=10)
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
