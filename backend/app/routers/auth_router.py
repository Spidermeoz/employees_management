from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.jwt_handler import create_access_token
from app.models.users import User
from app.utils.password import verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email, User.deleted == False).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Sai email hoặc mật khẩu")

    token = create_access_token({"user_id": user.id, "role": user.role})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.full_name,
            "role": user.role,
        }
    }
