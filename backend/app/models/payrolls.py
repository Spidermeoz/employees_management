from sqlalchemy import Column, BigInteger, Integer, DECIMAL, DateTime, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship
from app.database import Base


class Payroll(Base):
    __tablename__ = "payrolls"

    id = Column(BigInteger, primary_key=True, index=True)
    employee_id = Column(BigInteger, ForeignKey("employees.id"))
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    base_salary = Column(DECIMAL(12, 2), default=0.00)
    allowance = Column(DECIMAL(12, 2), default=0.00)
    bonus = Column(DECIMAL(12, 2), default=0.00)
    penalty = Column(DECIMAL(12, 2), default=0.00)
    total_salary = Column(DECIMAL(12, 2), default=0.00)
    created_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="payrolls")
