from sqlalchemy import Column, BigInteger, Date, Time, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Timesheet(Base):
    __tablename__ = "timesheets"

    id = Column(BigInteger, primary_key=True, index=True)
    employee_id = Column(BigInteger, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    check_in = Column(Time)
    check_out = Column(Time)
    working_hours = Column(DECIMAL(5, 2))

    employee = relationship("Employee", back_populates="timesheets")
