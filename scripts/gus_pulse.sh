#!/bin/bash
# Gus Pulse — Remote Turso DB health check
set -euo pipefail

cd "$(dirname "$0")/.."

export DATABASE_URL=libsql://mintagree-slayerjoelk.aws-us-east-2.turso.io
export TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzc4MTYwNjYsImlkIjoiMDE5ZGVlMTgtMDEwMS03Y2IyLWJmMzYtNmZjNTIzZWMzMmU1IiwicmlkIjoiNmJhMDY0YzUtMjQ2ZS00OWJkLWFkOTYtMDk0NmU5Yzk4ZGEwIn0.Mcx8OlNew7VwzzbS5t8QAbojMSEgfA1iEQCzRzN6dxZ3meh03CPSAubG9TYxCkqgZ3Ys7RTFrjXw-k74FdVuAA

echo "=== GUS PULSE ==="
echo "Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

# Check dev server
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo "DEV_SERVER: UP (200)"
else
  echo "DEV_SERVER: DOWN (HTTP $HTTP_CODE)"
fi

# Run DB pulse
echo ""
npx tsx scripts/gus_pulse.ts
