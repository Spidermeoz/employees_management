from sqlalchemy import Column, BigInteger, String, Enum, Date, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Employee(Base):
    __tablename__ = "employees"

    id = Column(BigInteger, primary_key=True, index=True)
    code = Column(String(50), unique=True)
    full_name = Column(String(255))
    gender = Column(Enum("male", "female", "other"))
    dob = Column(Date)
    email = Column(String(255))
    phone = Column(String(20))
    address = Column(Text)
    avatar = Column(Text)
    department_id = Column(BigInteger, ForeignKey("departments.id"))
    position_id = Column(BigInteger, ForeignKey("positions.id"))
    salary_grade_id = Column(BigInteger, ForeignKey("salary_grades.id"))
    hire_date = Column(Date)
    status = Column(Enum("active", "inactive", "leave"), default="active")
    deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
