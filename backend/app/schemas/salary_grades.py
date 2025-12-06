from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class SalaryGradeBase(BaseModel):
    grade_name: str
    base_salary: Decimal
    coefficient: Decimal


class SalaryGradeCreate(SalaryGradeBase):
    pass


class SalaryGradeUpdate(BaseModel):
    grade_name: Optional[str]
    base_salary: Optional[Decimal]
    coefficient: Optional[Decimal]


class SalaryGradeResponse(SalaryGradeBase):
    id: int

    class Config:
        orm_mode = True
