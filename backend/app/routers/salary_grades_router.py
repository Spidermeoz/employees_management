from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

from app.database import get_db
from app.models.salary_grades import SalaryGrade
from app.schemas.salary_grades import (
    SalaryGradeCreate,
    SalaryGradeUpdate,
    SalaryGradeResponse,
)

from app.auth.jwt_bearer import JWTBearer

router = APIRouter(
    prefix="/salary-grades",
    tags=["Salary Grades"],
    dependencies=[Depends(JWTBearer())]
)


@router.get("/", response_model=List[SalaryGradeResponse])
def list_grades(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
):
    query = db.query(SalaryGrade).filter(SalaryGrade.deleted == False)

    if search:
        like_value = f"%{search}%"
        query = query.filter(SalaryGrade.grade_name.ilike(like_value))

    return query.order_by(SalaryGrade.id.desc()).all()


@router.get("/{grade_id}", response_model=SalaryGradeResponse)
def get_grade(grade_id: int, db: Session = Depends(get_db)):
    grade = (
        db.query(SalaryGrade)
        .filter(SalaryGrade.id == grade_id, SalaryGrade.deleted == False)
        .first()
    )

    if not grade:
        raise HTTPException(status_code=404, detail="Không tìm thấy bậc lương")

    return grade


@router.post("/", response_model=SalaryGradeResponse, status_code=201)
def create_grade(data: SalaryGradeCreate, db: Session = Depends(get_db)):
    existed = (
        db.query(SalaryGrade)
        .filter(SalaryGrade.grade_name == data.grade_name, SalaryGrade.deleted == False)
        .first()
    )

    if existed:
        raise HTTPException(
            status_code=400,
            detail="Tên bậc lương đã tồn tại",
        )

    grade = SalaryGrade(
        grade_name=data.grade_name,
        base_salary=Decimal(data.base_salary),
        coefficient=Decimal(data.coefficient),
    )

    db.add(grade)
    db.commit()
    db.refresh(grade)

    return grade


@router.put("/{grade_id}", response_model=SalaryGradeResponse)
def update_grade(
    grade_id: int,
    data: SalaryGradeUpdate,
    db: Session = Depends(get_db),
):
    grade = (
        db.query(SalaryGrade)
        .filter(SalaryGrade.id == grade_id, SalaryGrade.deleted == False)
        .first()
    )

    if not grade:
        raise HTTPException(status_code=404, detail="Không tìm thấy bậc lương")

    update_data = data.dict(exclude_unset=True)

    # Check name duplicate
    if "grade_name" in update_data:
        existed = (
            db.query(SalaryGrade)
            .filter(
                SalaryGrade.grade_name == update_data["grade_name"],
                SalaryGrade.id != grade_id,
                SalaryGrade.deleted == False,
            )
            .first()
        )
        if existed:
            raise HTTPException(
                status_code=400, detail="Tên bậc lương đã có"
            )

    for field, value in update_data.items():
        setattr(grade, field, value)

    grade.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(grade)

    return grade


@router.delete("/{grade_id}", status_code=204)
def delete_grade(grade_id: int, db: Session = Depends(get_db)):
    grade = (
        db.query(SalaryGrade)
        .filter(SalaryGrade.id == grade_id, SalaryGrade.deleted == False)
        .first()
    )

    if not grade:
        raise HTTPException(status_code=404, detail="Không tìm thấy bậc lương")

    grade.deleted = True
    grade.deleted_at = datetime.utcnow()

    db.commit()
    return
