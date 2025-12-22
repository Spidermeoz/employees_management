from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.positions import Position
from app.schemas.positions import (
    PositionCreate,
    PositionUpdate,
    PositionResponse,
)

from app.auth.jwt_bearer import JWTBearer

router = APIRouter(
    prefix="/positions",
    tags=["Positions"],
    dependencies=[Depends(JWTBearer())]
)


@router.get("/", response_model=List[PositionResponse])
def list_positions(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
):
    query = db.query(Position).filter(Position.deleted == False)

    if search:
        like_value = f"%{search}%"
        query = query.filter(Position.name.ilike(like_value))

    if page < 1:
        page = 1
    if page_size < 1:
        page_size = 50

    skip = (page - 1) * page_size
    items = query.order_by(Position.id.desc()).offset(skip).limit(page_size).all()

    return items


@router.get("/{position_id}", response_model=PositionResponse)
def get_position(position_id: int, db: Session = Depends(get_db)):
    pos = (
        db.query(Position)
        .filter(Position.id == position_id, Position.deleted == False)
        .first()
    )

    if not pos:
        raise HTTPException(status_code=404, detail="Không tìm thấy chức vụ")

    return pos


@router.post("/", response_model=PositionResponse, status_code=201)
def create_position(data: PositionCreate, db: Session = Depends(get_db)):
    existed = (
        db.query(Position)
        .filter(Position.name == data.name, Position.deleted == False)
        .first()
    )
    if existed:
        raise HTTPException(
            status_code=400, detail="Tên chức vụ đã tồn tại"
        )

    pos = Position(
        name=data.name,
        description=data.description,
        level=data.level,
    )

    db.add(pos)
    db.commit()
    db.refresh(pos)
    return pos


@router.put("/{position_id}", response_model=PositionResponse)
def update_position(
    position_id: int, data: PositionUpdate, db: Session = Depends(get_db)
):
    pos = (
        db.query(Position)
        .filter(Position.id == position_id, Position.deleted == False)
        .first()
    )
    if not pos:
        raise HTTPException(status_code=404, detail="Không tìm thấy chức vụ")

    update_data = data.dict(exclude_unset=True)

    # Check trùng tên (nếu name đổi)
    if "name" in update_data:
        existed = (
            db.query(Position)
            .filter(
                Position.name == update_data["name"],
                Position.id != position_id,
                Position.deleted == False,
            )
            .first()
        )
        if existed:
            raise HTTPException(
                status_code=400,
                detail="Tên chức vụ đã có trong hệ thống",
            )

    for field, value in update_data.items():
        setattr(pos, field, value)

    pos.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(pos)

    return pos


@router.delete("/{position_id}", status_code=204)
def delete_position(position_id: int, db: Session = Depends(get_db)):
    pos = (
        db.query(Position)
        .filter(Position.id == position_id, Position.deleted == False)
        .first()
    )
    if not pos:
        raise HTTPException(status_code=404, detail="Không tìm thấy chức vụ")

    pos.deleted = True
    pos.deleted_at = datetime.utcnow()

    db.commit()

    return
