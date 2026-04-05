@echo off
echo Starting Backend API...
cd backend
start cmd /k ".\venv\bin\python -m uvicorn main:app --reload --port 8000"
cd ..

echo Starting Frontend...
cd frontend
start cmd /k "npx vite"
cd ..

echo Both servers are starting in new windows.
