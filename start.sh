#!/bin/bash

# Start backend server
cd backend
echo "Starting backend server..."
python3 -m uvicorn main:app --reload &
BACKEND_PID=$!

# Start frontend server
cd ../frontend
echo "Starting frontend server..."
pnpm dev &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Set up trap for script termination
trap cleanup SIGINT SIGTERM

echo "Both servers started. Press Ctrl+C to stop."

# Wait for both processes
wait 