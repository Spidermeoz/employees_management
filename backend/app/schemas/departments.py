from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    phone: Optional[str] = None
    manager_id: Optional[int] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    manager_id: Optional[int] = None


class DepartmentResponse(DepartmentBase):
    id: int
    manager_name: Optional[str] = None
    deleted: Optional[bool] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
