from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.departments import Department
from app.schemas.departments import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse,
)

# Sau này muốn bảo vệ bằng JWT thì thêm:
# from app.auth.jwt_bearer import JWTBearer

router = APIRouter(
    prefix="/departments",
    tags=["Departments"],
    # dependencies=[Depends(JWTBearer())]  # bật sau khi làm xong login
)


@router.get("/", response_model=List[DepartmentResponse])
def list_departments(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
):
    """
    Lấy danh sách phòng ban
    - Có thể search theo tên
    - Có phân trang đơn giản
    """
    query = db.query(Department).filter(Department.deleted == False)

    if search:
        like_value = f"%{search}%"
        # dùng ilike nếu MySQL/MariaDB hỗ trợ collation, không thì .like là đủ
        query = query.filter(Department.name.ilike(like_value))

    if page < 1:
        page = 1
    if page_size <= 0:
        page_size = 50

    skip = (page - 1) * page_size
    departments = (
        query.order_by(Department.id.desc()).offset(skip).limit(page_size).all()
    )

    return departments


@router.get("/{department_id}", response_model=DepartmentResponse)
def get_department(
    department_id: int,
    db: Session = Depends(get_db),
):
    """
    Lấy chi tiết 1 phòng ban
    """
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

    return dept


@router.post(
    "/", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED
)
def create_department(
    data: DepartmentCreate,
    db: Session = Depends(get_db),
):
    """
    Tạo phòng ban mới
    - Có check tên trùng (optional)
    """
    # Check trùng theo name (nếu bạn muốn đảm bảo unique theo business)
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

    return dept


@router.put("/{department_id}", response_model=DepartmentResponse)
def update_department(
    department_id: int,
    data: DepartmentUpdate,
    db: Session = Depends(get_db),
):
    """
    Cập nhật phòng ban
    """
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

    # Nếu có update name, check trùng tên với phòng ban khác
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

    return dept


@router.delete("/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
):
    """
    Xoá mềm (soft delete) phòng ban:
    - set deleted = True
    - set deleted_at = now
    Lưu ý: tuỳ nghiệp vụ, bạn có thể không cho xoá nếu phòng ban còn nhân viên.
    """
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
