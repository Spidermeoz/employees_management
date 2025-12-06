from fastapi import FastAPI
from app.database import Base, engine
from app.routers.auth_router import router as AuthRouter

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HR Management API")

# REGISTER ROUTERS
app.include_router(AuthRouter)


@app.get("/")
def root():
    return {"message": "HR Management API running"}
