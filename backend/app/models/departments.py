from sqlalchemy import Column, BigInteger, String, Text, DateTime, Boolean
from datetime import datetime
from sqlalchemy.orm import relationship
from app.database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    phone = Column(String(20))
    manager_id = Column(BigInteger)
    deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    employees = relationship("Employee", back_populates="department")
