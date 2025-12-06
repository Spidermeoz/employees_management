from pydantic import BaseModel
from typing import Optional
from datetime import date
from decimal import Decimal


class RewardBase(BaseModel):
    employee_id: int
    type: str   # reward | discipline
    title: str
    amount: Decimal
    date: date
    note: Optional[str] = None


class RewardCreate(RewardBase):
    pass


class RewardUpdate(BaseModel):
    type: Optional[str]
    title: Optional[str]
    amount: Optional[Decimal]
    date: Optional[date]
    note: Optional[str]


class RewardResponse(RewardBase):
    id: int

    class Config:
        orm_mode = True
