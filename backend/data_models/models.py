"""
Pydantic data models used by HTTP methods in main.py housed here. 
"""

from pydantic import BaseModel, Field
from typing import Optional

class Task(BaseModel):
    Name: Optional[str]
    Status: int | None = 0

class Update_Task(BaseModel):
   id: str = Field(alias="_id")
   Name: Optional[str] 

class Complete_Task(BaseModel):
    id: str = Field(alias="_id") 
