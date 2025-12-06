from sqlalchemy import Column, BigInteger, String, Enum, Date, Text, ForeignKey, Boolean, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from app.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(BigInteger, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    gender = Column(Enum("male", "female", "other"), nullable=False)
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
    deleted_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    department = relationship("Department", back_populates="employees")
    position = relationship("Position", back_populates="employees")
    salary_grade = relationship("SalaryGrade", back_populates="employees")

    contracts = relationship("LaborContract", back_populates="employee")
    payrolls = relationship("Payroll", back_populates="employee")
    rewards = relationship("RewardDiscipline", back_populates="employee")
    timesheets = relationship("Timesheet", back_populates="employee")
