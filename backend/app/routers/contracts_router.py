from datetime import datetime
from typing import List, Optional

from app.database import get_db
from app.models.labor_contracts import LaborContract
from app.schemas.contracts import ContractCreate, ContractResponse, ContractUpdate
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.jwt_bearer import JWTBearer

router = APIRouter(
    prefix="/contracts",
    tags=["Contracts"],
    dependencies=[Depends(JWTBearer())],  # 🔒 yêu cầu token cho toàn bộ routes trong module
)


@router.get("/", response_model=List[ContractResponse])
def list_contracts(
    db: Session = Depends(get_db),
    employee_id: Optional[int] = None,
):
    query = db.query(LaborContract)

    if employee_id:
        query = query.filter(LaborContract.employee_id == employee_id)

    return query.order_by(LaborContract.id.desc()).all()


@router.get("/{contract_id}", response_model=ContractResponse)
def get_contract(contract_id: int, db: Session = Depends(get_db)):
    contract = db.query(LaborContract).filter(LaborContract.id == contract_id).first()

    if not contract:
        raise HTTPException(404, "Không tìm thấy hợp đồng")

    return contract


@router.post("/", response_model=ContractResponse, status_code=201)
def create_contract(data: ContractCreate, db: Session = Depends(get_db)):
    contract = LaborContract(**data.dict())

    db.add(contract)
    db.commit()
    db.refresh(contract)

    return contract


@router.put("/{contract_id}", response_model=ContractResponse)
def update_contract(contract_id: int, data: ContractUpdate, db: Session = Depends(get_db)):
    contract = db.query(LaborContract).filter(LaborContract.id == contract_id).first()

    if not contract:
        raise HTTPException(404, "Không tìm thấy hợp đồng")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(contract, field, value)

    contract.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(contract)

    return contract


@router.delete("/{contract_id}", status_code=204)
def delete_contract(contract_id: int, db: Session = Depends(get_db)):
    contract = db.query(LaborContract).filter(LaborContract.id == contract_id).first()

    if not contract:
        raise HTTPException(404, "Không tìm thấy hợp đồng")

    db.delete(contract)
    db.commit()

    return
