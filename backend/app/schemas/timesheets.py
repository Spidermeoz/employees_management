from pydantic import BaseModel
from typing import Optional
from datetime import date, time
from decimal import Decimal


class TimesheetBase(BaseModel):
    employee_id: int
    date: date
    check_in: Optional[time] = None
    check_out: Optional[time] = None
    working_hours: Optional[Decimal] = None


class TimesheetCreate(TimesheetBase):
    pass


class TimesheetUpdate(BaseModel):
    check_in: Optional[time]
    check_out: Optional[time]
    working_hours: Optional[Decimal]


class TimesheetResponse(TimesheetBase):
    id: int

    class Config:
        orm_mode = True
