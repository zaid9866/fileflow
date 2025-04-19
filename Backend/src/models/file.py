from sqlalchemy import Column, String, ForeignKey, Integer
from base import Base 

class File(Base):
    __tablename__ = "files"
    
    content_id = Column(String, primary_key=True)  
    code = Column(String, ForeignKey("rooms.code"), nullable=False)  
    url = Column(String, nullable=True) 
    shared_by = Column(String, ForeignKey("users.user_id"), nullable=False)  
    status = Column(String, default="PENDING")  
    file_name = Column(String, nullable=False)  
    file_size = Column(String, nullable=False) 

__all__ = ["File"]