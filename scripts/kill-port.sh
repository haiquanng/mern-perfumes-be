#!/bin/bash
# Kill process on port (default: 4000)
PORT=${1:-4000}

PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
  echo "No process found on port $PORT"
else
  echo "Killing process $PID on port $PORT"
  kill -9 $PID
  echo "Port $PORT is now free"
fi
