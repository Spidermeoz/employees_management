from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # <-- quan trọng: import tất cả models
from app.database import Base, engine
from app.routers.auth_router import router as AuthRouter  # sau này dùng
from app.routers.contracts_router import router as ContractsRouter
from app.routers.departments_router import router as DepartmentsRouter
from app.routers.employees_router import router as EmployeesRouter
from app.routers.payrolls_router import router as PayrollsRouter
from app.routers.positions_router import router as PositionsRouter
from app.routers.rewards_router import router as RewardsRouter
from app.routers.salary_grades_router import router as SalaryGradesRouter
from app.routers.timesheets_router import router as TimesheetsRouter
from app.routers.users_router import router as UsersRouter

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HR Management API")

# CORS để frontend React call API được
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://frontend-hr-management-qfs9.vercel.app"
    ],   # sau này có thể giới hạn domain frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTERS
app.include_router(AuthRouter)        # khi làm xong auth
app.include_router(EmployeesRouter)   # Employees CRUD
app.include_router(DepartmentsRouter)
app.include_router(PositionsRouter)
app.include_router(SalaryGradesRouter)
app.include_router(ContractsRouter)
app.include_router(RewardsRouter)
app.include_router(PayrollsRouter)
app.include_router(TimesheetsRouter)
app.include_router(UsersRouter)


@app.get("/")
def root():
  return {"message": "HR Management API running"}
