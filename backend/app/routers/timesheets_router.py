from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.timesheets import Timesheet
from app.schemas.timesheets import TimesheetCreate, TimesheetUpdate, TimesheetResponse

from app.auth.jwt_bearer import JWTBearer

router = APIRouter(prefix="/timesheets", tags=["Timesheets"], dependencies=[Depends(JWTBearer())])


@router.get("/", response_model=List[TimesheetResponse])
def list_timesheets(
    db: Session = Depends(get_db),
    employee_id: Optional[int] = None,
    date: Optional[str] = None,  # YYYY-MM-DD
):
    query = db.query(Timesheet)

    if employee_id:
        query = query.filter(Timesheet.employee_id == employee_id)

    if date:
        query = query.filter(Timesheet.date == date)

    return query.order_by(Timesheet.date.desc()).all()


@router.get("/{timesheet_id}", response_model=TimesheetResponse)
def get_timesheet(timesheet_id: int, db: Session = Depends(get_db)):
    item = db.query(Timesheet).filter(Timesheet.id == timesheet_id).first()

    if not item:
        raise HTTPException(404, "Không tìm thấy dữ liệu chấm công")

    return item


@router.post("/", response_model=TimesheetResponse, status_code=201)
def create_timesheet(data: TimesheetCreate, db: Session = Depends(get_db)):
    item = Timesheet(**data.dict())

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


@router.put("/{timesheet_id}", response_model=TimesheetResponse)
def update_timesheet(timesheet_id: int, data: TimesheetUpdate, db: Session = Depends(get_db)):
    item = db.query(Timesheet).filter(Timesheet.id == timesheet_id).first()

    if not item:
        raise HTTPException(404, "Không tìm thấy dữ liệu chấm công")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    return item


@router.delete("/{timesheet_id}", status_code=204)
def delete_timesheet(timesheet_id: int, db: Session = Depends(get_db)):
    item = db.query(Timesheet).filter(Timesheet.id == timesheet_id).first()

    if not item:
        raise HTTPException(404, "Không tìm thấy dữ liệu chấm công")

    db.delete(item)
    db.commit()

    return
