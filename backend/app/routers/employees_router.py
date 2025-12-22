from datetime import datetime
from typing import List, Optional

# Nếu sau này dùng JWT:
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
    dependencies=[Depends(JWTBearer())]  # Bật cái này sau khi làm xong login JWT
)


@router.get("/", response_model=PaginatedResponse[EmployeeResponse])
def list_employees(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    department_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    page: int = 1,
    page_size: int = 10,
):
    query = db.query(Employee).filter(Employee.deleted == False)

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

    total = query.count()   # 🔥 tổng số nhân viên

    if page < 1:
        page = 1
    if page_size <= 0:
        page_size = 10

    skip = (page - 1) * page_size

    employees = (
        query
        .options(
            joinedload(Employee.department),
            joinedload(Employee.position),
        )
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


@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(
    data: EmployeeCreate,
    db: Session = Depends(get_db),
):
    """
    Tạo mới nhân viên
    """
    # Kiểm tra trùng mã nhân viên
    existed = db.query(Employee).filter(Employee.code == data.code).first()
    if existed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã nhân viên đã tồn tại",
        )

    emp = Employee(
        code=data.code,
        full_name=data.full_name,
        gender=data.gender,
        dob=data.dob,
        email=data.email,
        phone=data.phone,
        address=data.address,
        department_id=data.department_id,
        position_id=data.position_id,
        salary_grade_id=data.salary_grade_id,
        hire_date=data.hire_date,
        status=data.status or "active",
        avatar=data.avatar,
    )

    db.add(emp)
    db.commit()
    db.refresh(emp)

    return emp


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    data: EmployeeUpdate,
    db: Session = Depends(get_db),
):
    """
    Cập nhật thông tin nhân viên
    """
    emp = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.deleted == False
    ).first()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy nhân viên",
        )

    update_data = data.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(emp, field, value)

    emp.updated_at = datetime.utcnow()
    emp.avatar = data.avatar

    db.commit()
    db.refresh(emp)

    return emp


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
):
    """
    Xóa mềm (soft delete) nhân viên:
    - set deleted = True
    - set deleted_at = now
    """
    emp = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.deleted == False
    ).first()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy nhân viên",
        )

    emp.deleted = True
    emp.deleted_at = datetime.utcnow()

    db.commit()

    return
