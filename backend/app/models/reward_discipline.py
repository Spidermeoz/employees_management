from sqlalchemy import Column, BigInteger, String, Enum, DECIMAL, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class RewardDiscipline(Base):
    __tablename__ = "reward_discipline"

    id = Column(BigInteger, primary_key=True, index=True)
    employee_id = Column(BigInteger, ForeignKey("employees.id"), nullable=False)
    type = Column(Enum("reward", "discipline"), nullable=False)
    title = Column(String(255), nullable=False)
    amount = Column(DECIMAL(12, 2), default=0.00)
    date = Column(Date, nullable=False)
    note = Column(Text)

    employee = relationship("Employee", back_populates="rewards")
