from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


class EmployeeBase(BaseModel):
    full_name: str
    gender: str
    dob: Optional[date] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    department_id: Optional[int] = None
    position_id: Optional[int] = None
    salary_grade_id: Optional[int] = None
    hire_date: Optional[date] = None
    status: Optional[str] = "active"


class EmployeeCreate(EmployeeBase):
    code: str


class EmployeeUpdate(EmployeeBase):
    full_name: Optional[str]
    gender: Optional[str]


class EmployeeResponse(EmployeeBase):
    id: int
    code: str

    class Config:
        orm_mode = True
