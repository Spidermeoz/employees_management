from typing import List, Optional

from app.auth.jwt_bearer import JWTBearer
from app.database import get_db
from app.models.payrolls import Payroll
from app.schemas.payrolls import PayrollCreate, PayrollResponse, PayrollUpdate
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

router = APIRouter(prefix="/payrolls", tags=["Payrolls"], dependencies=[Depends(JWTBearer())])


@router.get("/", response_model=List[PayrollResponse])
def list_payrolls(
    db: Session = Depends(get_db),
    employee_id: Optional[int] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
):
    query = db.query(Payroll)

    if employee_id:
        query = query.filter(Payroll.employee_id == employee_id)

    if month:
        query = query.filter(Payroll.month == month)

    if year:
        query = query.filter(Payroll.year == year)

    return query.order_by(Payroll.year.desc(), Payroll.month.desc()).all()


@router.get("/{payroll_id}", response_model=PayrollResponse)
def get_payroll(payroll_id: int, db: Session = Depends(get_db)):
    payroll = (
        db.query(Payroll)
        .options(joinedload(Payroll.employee))
        .filter(Payroll.id == payroll_id)
        .first()
    )

    if not payroll:
        raise HTTPException(404, "Không tìm thấy bảng lương")

    return payroll


@router.post("/", response_model=PayrollResponse, status_code=201)
def create_payroll(data: PayrollCreate, db: Session = Depends(get_db)):
    payroll = Payroll(**data.dict())

    db.add(payroll)
    db.commit()
    db.refresh(payroll)

    return payroll


@router.put("/{payroll_id}", response_model=PayrollResponse)
def update_payroll(payroll_id: int, data: PayrollUpdate, db: Session = Depends(get_db)):
    item = db.query(Payroll).filter(Payroll.id == payroll_id).first()

    if not item:
        raise HTTPException(404, "Không tìm thấy bảng lương")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    return item


@router.delete("/{payroll_id}", status_code=204)
def delete_payroll(payroll_id: int, db: Session = Depends(get_db)):
    item = db.query(Payroll).filter(Payroll.id == payroll_id).first()

    if not item:
        raise HTTPException(404, "Không tìm thấy bảng lương")

    db.delete(item)
    db.commit()

    return
