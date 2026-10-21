#!/usr/bin/env bash
# ==============================================================================
# FreshFlow ERP — Unified Project Runner
# Runs Django Backend (Port 8005) & Next.js Frontend (Port 3000) concurrently.
# ==============================================================================

set -eo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
FRONTEND_DIR="${ROOT_DIR}/frontend"
VENV_DIR="${ROOT_DIR}/venv"

# Text Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}======================================================================${NC}"
echo -e "${CYAN}             FreshFlow ERP — Unified Development Server              ${NC}"
echo -e "${CYAN}======================================================================${NC}"

# ─── 1. Check Prerequisites ───────────────────────────────────────────────────
echo -e "${BLUE}[1/4] Checking environment prerequisites...${NC}"

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 is required but not installed.${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: node is required but not installed.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is required but not installed.${NC}"
    exit 1
fi

# ─── 2. Setup & Activate Python Virtual Environment ───────────────────────────
echo -e "${BLUE}[2/4] Initializing backend virtual environment...${NC}"

if [ ! -d "${VENV_DIR}" ]; then
    echo -e "${YELLOW}Virtual environment not found at ${VENV_DIR}. Creating...${NC}"
    python3 -m venv "${VENV_DIR}"
fi

# shellcheck source=/dev/null
source "${VENV_DIR}/bin/activate"

# Check & create backend .env if missing
if [ ! -f "${BACKEND_DIR}/.env" ]; then
    if [ -f "${BACKEND_DIR}/.env.example" ]; then
        echo -e "${YELLOW}Creating backend/.env from .env.example...${NC}"
        cp "${BACKEND_DIR}/.env.example" "${BACKEND_DIR}/.env"
    fi
fi

# Apply migrations
echo -e "${BLUE}Applying database migrations...${NC}"
python "${BACKEND_DIR}/manage.py" migrate --noinput

# ─── 3. Setup Frontend Environment ───────────────────────────────────────────
echo -e "${BLUE}[3/4] Preparing frontend environment...${NC}"

# Check & create frontend .env if missing
if [ ! -f "${FRONTEND_DIR}/.env" ] && [ ! -f "${FRONTEND_DIR}/.env.local" ]; then
    echo -e "${YELLOW}Configuring default frontend environment...${NC}"
    echo "NEXT_PUBLIC_API_URL=http://localhost:8005/api" > "${FRONTEND_DIR}/.env.local"
fi

# Install dependencies if node_modules does not exist
if [ ! -d "${FRONTEND_DIR}/node_modules" ]; then
    echo -e "${YELLOW}frontend/node_modules not found. Installing dependencies...${NC}"
    npm --prefix "${FRONTEND_DIR}" install
fi

# ─── 4. Launch Services Concurrently ─────────────────────────────────────────
echo -e "${BLUE}[4/4] Starting backend and frontend servers...${NC}"
echo -e "${GREEN}✓ Backend API:    ${CYAN}http://localhost:8005/api${NC}"
echo -e "${GREEN}✓ Backend Admin:  ${CYAN}http://localhost:8005/admin${NC}"
echo -e "${GREEN}✓ Frontend App:   ${CYAN}http://localhost:3000${NC}"
echo -e "${YELLOW}Press [CTRL+C] at any time to gracefully stop all services.${NC}"
echo -e "${CYAN}----------------------------------------------------------------------${NC}"

# Cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down FreshFlow services...${NC}"
    if [ -n "${BACKEND_PID:-}" ] && kill -0 "${BACKEND_PID}" 2>/dev/null; then
        kill -SIGTERM "${BACKEND_PID}" 2>/dev/null || true
    fi
    if [ -n "${FRONTEND_PID:-}" ] && kill -0 "${FRONTEND_PID}" 2>/dev/null; then
        kill -SIGTERM "${FRONTEND_PID}" 2>/dev/null || true
    fi
    wait "${BACKEND_PID:-}" 2>/dev/null || true
    wait "${FRONTEND_PID:-}" 2>/dev/null || true
    echo -e "${GREEN}All services stopped cleanly.${NC}"
}
trap cleanup SIGINT SIGTERM EXIT

# Start Django Backend on port 8005
python "${BACKEND_DIR}/manage.py" runserver 0.0.0.0:8005 2>&1 | sed -e "s/^/[BACKEND] /" &
BACKEND_PID=$!

# Start Next.js Frontend on port 3000
npm --prefix "${FRONTEND_DIR}" run dev 2>&1 | sed -e "s/^/[FRONTEND] /" &
FRONTEND_PID=$!

# Wait for background processes
wait "${BACKEND_PID}" "${FRONTEND_PID}"
