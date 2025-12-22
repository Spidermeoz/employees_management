from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.users import User
from app.schemas.users import UserCreate, UserUpdate, UserResponse
from app.schemas.auth import LoginUserInfo
from app.auth.jwt_bearer import JWTBearer
from app.utils.password import hash_password, verify_password

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(JWTBearer())]  # bắt buộc có token
)

# -------------------------
# GET LIST USERS
# -------------------------
@router.get("/", response_model=List[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    search: Optional[str] = None
):
    query = db.query(User).filter(User.deleted == False)

    if search:
        like_val = f"%{search}%"
        query = query.filter(User.full_name.ilike(like_val))

    return query.order_by(User.id.desc()).all()


# -------------------------
# GET USER BY ID
# -------------------------
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.deleted == False).first()
    if not user:
        raise HTTPException(404, "Không tìm thấy người dùng")
    return user


# -------------------------
# CREATE USER
# -------------------------
@router.post("/", response_model=UserResponse, status_code=201)
def create_user(data: UserCreate, db: Session = Depends(get_db)):

    # Check email trùng
    existed = db.query(User).filter(User.email == data.email).first()
    if existed:
        raise HTTPException(400, "Email đã tồn tại")

    hashed = hash_password(data.password)

    new_user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hashed,
        role=data.role,
        status=data.status,
        deleted=False,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# -------------------------
# UPDATE USER INFO
# -------------------------
@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id, User.deleted == False).first()
    if not user:
        raise HTTPException(404, "Không tìm thấy người dùng")

    # Check email nếu đổi email
    if data.email and data.email != user.email:
        existed = db.query(User).filter(User.email == data.email).first()
        if existed:
            raise HTTPException(400, "Email đã tồn tại")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return user


# -------------------------
# UPDATE PASSWORD
# -------------------------
@router.put("/{user_id}/password")
def update_password(
    user_id: int,
    new_pass: str,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id, User.deleted == False).first()
    if not user:
        raise HTTPException(404, "Không tìm thấy người dùng")

    user.password_hash = hash_password(new_pass)

    db.commit()
    return {"message": "Đổi mật khẩu thành công"}


# -------------------------
# DELETE USER (SOFT DELETE)
# -------------------------
@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id, User.deleted == False).first()
    if not user:
        raise HTTPException(404, "Không tìm thấy người dùng")

    user.deleted = True

    db.commit()
    return
