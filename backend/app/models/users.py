from sqlalchemy import Column, Integer, String, Enum, Boolean, DateTime
from app.database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum("admin", "hr", "viewer"), default="viewer")
    status = Column(Enum("active", "inactive"), default="active")
    deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
