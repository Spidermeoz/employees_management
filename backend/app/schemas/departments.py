from pydantic import BaseModel
from typing import Optional


class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    phone: Optional[str] = None
    manager_id: Optional[int] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(DepartmentBase):
    pass


class DepartmentResponse(DepartmentBase):
    id: int

    class Config:
        orm_mode = True
