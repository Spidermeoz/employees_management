from datetime import datetime
from typing import List, Optional

from app.auth.jwt_bearer import JWTBearer
from app.database import get_db
from app.models.departments import Department
from app.models.employees import Employee
from app.schemas.departments import (
    DepartmentCreate,
    DepartmentResponse,
    DepartmentUpdate,
)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/departments",
    tags=["Departments"],
    dependencies=[Depends(JWTBearer())]
)


def map_department_with_manager(dept: Department, db: Session):
    manager_name = None
    if dept.manager_id:
        emp = db.query(Employee).filter(Employee.id == dept.manager_id).first()
        manager_name = emp.full_name if emp else None

    return {
        "id": dept.id,
        "name": dept.name,
        "description": dept.description,
        "phone": dept.phone,
        "manager_id": dept.manager_id,
        "manager_name": manager_name,
        "deleted": dept.deleted,
        "created_at": dept.created_at,
        "updated_at": dept.updated_at,
    }


@router.get("/", response_model=List[DepartmentResponse])
def list_departments(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
):
    query = db.query(Department).filter(Department.deleted == False)

    if search:
        like_value = f"%{search}%"
        query = query.filter(Department.name.like(like_value))

    if page < 1:
        page = 1
    if page_size <= 0:
        page_size = 50

    skip = (page - 1) * page_size

    departments = (
        query.order_by(Department.id.desc()).offset(skip).limit(page_size).all()
    )

    return [map_department_with_manager(dept, db) for dept in departments]


@router.get("/{department_id}", response_model=DepartmentResponse)
def get_department(
    department_id: int,
    db: Session = Depends(get_db),
):
    dept = (
        db.query(Department)
        .filter(Department.id == department_id, Department.deleted == False)
        .first()
    )

    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy phòng ban",
        )

    return map_department_with_manager(dept, db)


@router.post("/", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
def create_department(
    data: DepartmentCreate,
    db: Session = Depends(get_db),
):
    existed = (
        db.query(Department)
        .filter(Department.name == data.name, Department.deleted == False)
        .first()
    )
    if existed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên phòng ban đã tồn tại",
        )

    dept = Department(
        name=data.name,
        description=data.description,
        phone=data.phone,
        manager_id=data.manager_id,
    )

    db.add(dept)
    db.commit()
    db.refresh(dept)

    return map_department_with_manager(dept, db)


@router.put("/{department_id}", response_model=DepartmentResponse)
def update_department(
    department_id: int,
    data: DepartmentUpdate,
    db: Session = Depends(get_db),
):
    dept = (
        db.query(Department)
        .filter(Department.id == department_id, Department.deleted == False)
        .first()
    )

    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy phòng ban",
        )

    update_data = data.dict(exclude_unset=True)

    if "name" in update_data:
        existed = (
            db.query(Department)
            .filter(
                Department.name == update_data["name"],
                Department.id != department_id,
                Department.deleted == False,
            )
            .first()
        )
        if existed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tên phòng ban đã được sử dụng",
            )

    for field, value in update_data.items():
        setattr(dept, field, value)

    dept.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(dept)

    return map_department_with_manager(dept, db)


@router.delete("/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
):
    dept = (
        db.query(Department)
        .filter(Department.id == department_id, Department.deleted == False)
        .first()
    )

    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy phòng ban",
        )

    dept.deleted = True
    dept.deleted_at = datetime.utcnow()

    db.commit()
    return
