import uuid
from sqlalchemy import Column, String, Integer, Time, Text, Boolean
from sqlalchemy.orm import relationship
from base import Base  

class Room(Base):
    __tablename__ = "rooms"
    
    code = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    end_timing = Column(Time, nullable=True)
    current_participant = Column(Integer, nullable=False, default=1)
    max_participant = Column(Integer, nullable=False, default=10)
    encryption_key = Column(String, nullable=False)
    textField = Column(Integer, nullable=False, default=1)
    restrict = Column(Boolean, nullable=False, default=False)
    blocked = Column(Text, nullable=True, default="[]")

    users = relationship("User", back_populates="room")

__all__ = ["Room"]
