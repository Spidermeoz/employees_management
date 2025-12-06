from pydantic import BaseModel
from typing import Optional


class PositionBase(BaseModel):
    name: str
    description: Optional[str] = None
    level: int


class PositionCreate(PositionBase):
    pass


class PositionUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    level: Optional[int]


class PositionResponse(PositionBase):
    id: int

    class Config:
        orm_mode = True
