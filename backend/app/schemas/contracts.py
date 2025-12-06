from pydantic import BaseModel
from typing import Optional
from datetime import date
from decimal import Decimal


class ContractBase(BaseModel):
    employee_id: int
    contract_type: str
    salary: Decimal
    start_date: date
    end_date: Optional[date] = None
    file_url: Optional[str] = None


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    contract_type: Optional[str]
    salary: Optional[Decimal]
    start_date: Optional[date]
    end_date: Optional[date]
    file_url: Optional[str]


class ContractResponse(ContractBase):
    id: int

    class Config:
        orm_mode = True
