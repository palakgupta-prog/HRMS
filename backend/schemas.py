from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    employee_id: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None


class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


from datetime import date
from models import AttendanceStatus


class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    status: AttendanceStatus


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceResponse(AttendanceBase):
    id: int

    class Config:
        from_attributes = True
