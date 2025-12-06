from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class PayrollBase(BaseModel):
    employee_id: int
    month: int
    year: int
    base_salary: Decimal
    allowance: Decimal
    bonus: Decimal
    penalty: Decimal
    total_salary: Decimal


class PayrollCreate(PayrollBase):
    pass


class PayrollUpdate(BaseModel):
    base_salary: Optional[Decimal]
    allowance: Optional[Decimal]
    bonus: Optional[Decimal]
    penalty: Optional[Decimal]
    total_salary: Optional[Decimal]


class PayrollResponse(PayrollBase):
    id: int

    class Config:
        orm_mode = True
