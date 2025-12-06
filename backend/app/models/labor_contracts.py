from sqlalchemy import Column, BigInteger, String, DECIMAL, Date, Text, DateTime, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship
from app.database import Base


class LaborContract(Base):
    __tablename__ = "labor_contracts"

    id = Column(BigInteger, primary_key=True, index=True)
    employee_id = Column(BigInteger, ForeignKey("employees.id"))
    contract_type = Column(String(50), nullable=False)
    salary = Column(DECIMAL(12, 2), default=0.00)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    file_url = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="contracts")
