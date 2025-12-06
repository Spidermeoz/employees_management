from fastapi import FastAPI
from app.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

from app.routers.employees_router import router as EmployeesRouter
from app.routers.auth_router import router as AuthRouter  # sau này dùng

from app import models  # <-- quan trọng: import tất cả models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HR Management API")

# CORS để frontend React call API được
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # sau này có thể giới hạn domain frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTERS
app.include_router(AuthRouter)        # khi làm xong auth
app.include_router(EmployeesRouter)   # Employees CRUD


@app.get("/")
def root():
  return {"message": "HR Management API running"}
