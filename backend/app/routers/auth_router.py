from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.users import User
from app.schemas.auth import LoginRequest, LoginResponse, LoginUserInfo
from app.auth.jwt_handler import create_access_token
from app.auth.jwt_bearer import JWTBearer
from app.utils.password import verify_password

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)

@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(
            User.email == data.email,
            User.deleted == False
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sai email hoặc mật khẩu",
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị khóa / không hoạt động",
        )

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sai email hoặc mật khẩu",
        )

    token = create_access_token({
        "user_id": user.id,
        "role": user.role,
        "email": user.email
    })

    return LoginResponse(
        access_token=token,
        user=LoginUserInfo(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
            role=user.role,
        )
    )


# Lấy thông tin user hiện tại từ token
@router.get("/me", response_model=LoginUserInfo, dependencies=[Depends(JWTBearer())])
def get_me(
    payload = Depends(JWTBearer()),
    db: Session = Depends(get_db),
):
    """
    Lấy thông tin người dùng hiện tại từ token
    (frontend có thể gọi /auth/me để check xem token còn valid không)
    """
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    user = db.query(User).filter(User.id == user_id, User.deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy user")

    return LoginUserInfo(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
    )
