from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from base import Base 

class TextModel(Base):
    __tablename__ = "texts"
    
    textId = Column(String, primary_key=True)  
    code = Column(String, ForeignKey("rooms.code"), nullable=False)  
    content = Column(Text, nullable=True) 
    shared_by = Column(String, nullable=False)  

__all__ = ["TextModel"]
