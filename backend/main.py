from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import engine, Base
from routers.employees import router as employee_router
from routers.attendance import router as attendance_router

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(employee_router)
app.include_router(attendance_router)

# Serve Frontend
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")


@app.get("/")
def read_root():
    return {"message": "HRMS Lite API is running"}

@app.get("/")
def root():
    return {"message": "HRMS Lite Backend Running"}
