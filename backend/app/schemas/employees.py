from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr


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


class DepartmentInfo(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class PositionInfo(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class SalaryGradeInfo(BaseModel):
    id: int
    grade_name: str
    
    class Config:
        orm_mode = True


class EmployeeResponse(BaseModel):
    id: int
    code: str
    full_name: str
    gender: str
    dob: Optional[date] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

    # JOIN INFO
    department: Optional[DepartmentInfo]
    position: Optional[PositionInfo]
    salary_grade: Optional[SalaryGradeInfo]

    hire_date: Optional[date]
    status: str

    class Config:
        orm_mode = True
