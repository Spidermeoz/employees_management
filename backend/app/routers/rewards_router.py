from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.reward_discipline import RewardDiscipline
from app.schemas.rewards import RewardCreate, RewardUpdate, RewardResponse

router = APIRouter(prefix="/rewards", tags=["Rewards & Discipline"])


@router.get("/", response_model=List[RewardResponse])
def list_rewards(
    db: Session = Depends(get_db),
    employee_id: Optional[int] = None,
    type: Optional[str] = None,
):
    query = db.query(RewardDiscipline)

    if employee_id:
        query = query.filter(RewardDiscipline.employee_id == employee_id)

    if type:
        query = query.filter(RewardDiscipline.type == type)

    return query.order_by(RewardDiscipline.date.desc()).all()


@router.get("/{item_id}", response_model=RewardResponse)
def get_reward(item_id: int, db: Session = Depends(get_db)):
    item = db.query(RewardDiscipline).filter(RewardDiscipline.id == item_id).first()

    if not item:
        raise HTTPException(404, "Không tìm thấy dữ liệu thưởng/phạt")

    return item


@router.post("/", response_model=RewardResponse, status_code=201)
def create_reward(data: RewardCreate, db: Session = Depends(get_db)):
    reward = RewardDiscipline(**data.dict())

    db.add(reward)
    db.commit()
    db.refresh(reward)

    return reward


@router.put("/{item_id}", response_model=RewardResponse)
def update_reward(item_id: int, data: RewardUpdate, db: Session = Depends(get_db)):
    item = db.query(RewardDiscipline).filter(RewardDiscipline.id == item_id).first()

    if not item:
        raise HTTPException(404, "Không tìm thấy mục thưởng/phạt")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)

    return item


@router.delete("/{item_id}", status_code=204)
def delete_reward(item_id: int, db: Session = Depends(get_db)):
    item = db.query(RewardDiscipline).filter(RewardDiscipline.id == item_id).first()

    if not item:
        raise HTTPException(404, "Không tìm thấy mục thưởng/phạt")

    db.delete(item)
    db.commit()

    return
