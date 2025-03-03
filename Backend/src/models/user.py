import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from base import Base  

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String, ForeignKey("rooms.code"), nullable=False)
    username = Column(String, nullable=False)
    role = Column(String, nullable=False)

    room = relationship("Room", back_populates="users")

__all__ = ["User"]
