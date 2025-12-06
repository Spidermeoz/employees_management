from sqlalchemy import Column, BigInteger, String, DECIMAL, Boolean, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from app.database import Base


class SalaryGrade(Base):
    __tablename__ = "salary_grades"

    id = Column(BigInteger, primary_key=True, index=True)
    grade_name = Column(String(50), nullable=False)
    base_salary = Column(DECIMAL(12, 2), default=0.00)
    coefficient = Column(DECIMAL(5, 2), default=1.00)
    deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    employees = relationship("Employee", back_populates="salary_grade")
