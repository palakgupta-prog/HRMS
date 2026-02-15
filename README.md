# HRMS Lite - Human Resource Management System

A modern, lightweight Human Resource Management System (HRMS) designed for small to medium-sized organizations. It provides a sleek, "glassmorphism" interface for managing employee records and tracking attendance.

## Project Overview

HRMS Lite is a full-stack application that allows administrators to:
- **Register Employees**: Store employee details including Internal ID, Token ID, Full Name, Email, and Department.
- **Track Attendance**: Mark employees as 'Present' or 'Absent' on specific dates.
- **Employee Registry**: View a comprehensive list of all employees with quick access to their attendance history.
- **Interactive UI**: Enjoy a premium user experience with responsive layouts and modern aesthetics.

## Tech Stack

### Frontend
- **React**: Modern component-based UI library.
- **Vite**: Ultra-fast build tool and development server.
- **Vanilla CSS**: Custom design system with variables and glassmorphism effects.
- **Axios**: For seamless API communication.
- **Google Fonts**: "Outfit" typography for a professional look.

### Backend
- **FastAPI**: High-performance Python framework for building APIs.
- **SQLite**: Lightweight, file-based SQL database for data persistence.
- **SQLAlchemy**: Powerful ORM for database interactions.
- **Uvicorn**: Lightning-fast ASGI server.

---

## Steps to Run the Project Locally

To run this project on your machine, follow these steps:

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (3.9 or higher)

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload --port 8000
```
*The backend will be available at `http://localhost:8000`.*

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The frontend will be available at the URL provided by Vite (usually `http://localhost:5173`).*

---

## Assumptions and Limitations

### Assumptions
- **Internal vs Token ID**: The system assumes an "Internal ID" (auto-incremented by the database) and a "Token ID" (assigned manually, e.g., EMP-001).
- **Single Organization**: The current version is designed for a single organization/tenant.

### Limitations
- **Auth**: This version does not include user authentication/login. It is intended for local or internal use.
- **Concurrency**: SQLite is used for simplicity, which may have limitations in high-concurrency environments.
- **Data Range**: Attendance records are displayed as a list; advanced reporting or calendar views are not yet implemented.
