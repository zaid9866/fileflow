from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from base import Base 

class File(Base):
    __tablename__ = "files"
    
    content_id = Column(String, primary_key=True)  
    code = Column(String, ForeignKey("rooms.code"), nullable=False)  
    url = Column(String, nullable=True) 
    shared_by = Column(String, ForeignKey("users.user_id"), nullable=False)  
    status = Column(String, default="PENDING")  

    room = relationship("Room", back_populates="files")  

__all__ = ["File"]
