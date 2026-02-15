from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
import models
import schemas

router = APIRouter(prefix="/attendance", tags=["Attendance"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.AttendanceResponse)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):

    employee = db.query(models.Employee).filter(
        models.Employee.id == attendance.employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Prevent duplicate attendance for same date
    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")

    new_attendance = models.Attendance(**attendance.dict())

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return new_attendance


@router.get("/{employee_id}", response_model=list[schemas.AttendanceResponse])
def get_employee_attendance(employee_id: int, db: Session = Depends(get_db)):

    employee = db.query(models.Employee).filter(
        models.Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    return db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).all()


@router.get("/", response_model=list[schemas.AttendanceResponse])
def get_all_attendance(db: Session = Depends(get_db)):
    return db.query(models.Attendance).all()
