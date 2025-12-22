from datetime import datetime
from typing import List, Optional

from app.auth.jwt_bearer import JWTBearer
from app.database import get_db
from app.models.employees import Employee
from app.schemas.common import PaginatedResponse
from app.schemas.employees import EmployeeCreate, EmployeeResponse, EmployeeUpdate
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
    dependencies=[Depends(JWTBearer())]
)


@router.get("/", response_model=List[EmployeeResponse])
def list_employees(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    department_id: Optional[int] = None,
    status_filter: Optional[str] = None,
):
    query = (
        db.query(Employee)
        .filter(Employee.deleted == False)
        .options(
            joinedload(Employee.department),
            joinedload(Employee.position),
            joinedload(Employee.salary_grade),
        )
    )

    if search:
        like_value = f"%{search}%"
        query = query.filter(
            (Employee.full_name.ilike(like_value)) |
            (Employee.code.ilike(like_value))
        )

    if department_id:
        query = query.filter(Employee.department_id == department_id)

    if status_filter:
        query = query.filter(Employee.status == status_filter)

    return query.order_by(Employee.id.desc()).all()


# ======================================================
# ENDPOINT MỚI – CÓ PHÂN TRANG (DÙNG CHO LIST PAGE)
# ======================================================

@router.get("/paged", response_model=PaginatedResponse[EmployeeResponse])
def list_employees_paged(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    department_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    page: int = 1,
    page_size: int = 10,
):
    query = (
        db.query(Employee)
        .filter(Employee.deleted == False)
        .options(
            joinedload(Employee.department),
            joinedload(Employee.position),
            joinedload(Employee.salary_grade),
        )
    )

    if search:
        like_value = f"%{search}%"
        query = query.filter(
            (Employee.full_name.ilike(like_value)) |
            (Employee.code.ilike(like_value))
        )

    if department_id:
        query = query.filter(Employee.department_id == department_id)

    if status_filter:
        query = query.filter(Employee.status == status_filter)

    total = query.count()

    if page < 1:
        page = 1
    if page_size <= 0:
        page_size = 10

    skip = (page - 1) * page_size

    employees = (
        query
        .order_by(Employee.id.desc())
        .offset(skip)
        .limit(page_size)
        .all()
    )

    return {
        "items": employees,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


# ======================================================
# GET DETAIL
# ======================================================

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    emp = (
        db.query(Employee)
        .options(
            joinedload(Employee.department),
            joinedload(Employee.position),
            joinedload(Employee.salary_grade),
        )
        .filter(Employee.id == employee_id, Employee.deleted == False)
        .first()
    )

    if not emp:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên")

    return emp


# ======================================================
# CREATE
# ======================================================

@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(
    data: EmployeeCreate,
    db: Session = Depends(get_db),
):
    existed = db.query(Employee).filter(Employee.code == data.code).first()
    if existed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã nhân viên đã tồn tại",
        )

    emp = Employee(**data.dict())
    emp.status = data.status or "active"

    db.add(emp)
    db.commit()
    db.refresh(emp)

    return emp


# ======================================================
# UPDATE
# ======================================================

@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    data: EmployeeUpdate,
    db: Session = Depends(get_db),
):
    emp = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.deleted == False
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(emp, field, value)

    emp.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(emp)

    return emp


# ======================================================
# DELETE (SOFT DELETE)
# ======================================================

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
):
    emp = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.deleted == False
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhân viên")

    emp.deleted = True
    emp.deleted_at = datetime.utcnow()
    db.commit()
