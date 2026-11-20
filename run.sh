#!/usr/bin/env bash
# ==============================================================================
# FreshFlow ERP — Unified Project Runner & Auto-Provisioner
# OS-Agnostic: Debian/Ubuntu, RHEL/Fedora/Rocky/Alma, Arch, Alpine, macOS
# Automatically detects, installs, and upgrades Python (>=3.11) and Node.js (>=20 LTS)
# ==============================================================================

set -eo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
FRONTEND_DIR="${ROOT_DIR}/frontend"
VENV_DIR="${ROOT_DIR}/venv"

MIN_PYTHON_MAJOR=3
MIN_PYTHON_MINOR=11
MIN_NODE_MAJOR=18

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}======================================================================${NC}"
echo -e "${CYAN}      FreshFlow ERP — Unified Server & Auto-Provisioning Runner       ${NC}"
echo -e "${CYAN}======================================================================${NC}"

# ─── Privileges & Sudo Detection ─────────────────────────────────────────────
SUDO=""
if [ "$EUID" -ne 0 ]; then
    if command -v sudo &>/dev/null; then
        SUDO="sudo"
    fi
fi

# ─── OS Detection ─────────────────────────────────────────────────────────────
OS="unknown"
DISTRO="unknown"
if [ "$(uname -s)" = "Darwin" ]; then
    OS="macos"
elif [ -f /etc/os-release ]; then
    OS="linux"
    # shellcheck source=/dev/null
    . /etc/os-release
    DISTRO="${ID:-unknown}"
fi

run_pkg_mgr() {
    local cmd="$1"
    echo -e "${YELLOW}Executing system package manager: ${cmd}${NC}"
    eval "$cmd"
}

# ─── Helper: Check Python Version ─────────────────────────────────────────────
is_python_supported() {
    local py_bin="$1"
    if ! command -v "$py_bin" &>/dev/null; then
        return 1
    fi
    "$py_bin" -c "import sys; sys.exit(0 if sys.version_info >= (${MIN_PYTHON_MAJOR}, ${MIN_PYTHON_MINOR}) else 1)" 2>/dev/null
}

# ─── Helper: Check Node.js Version ────────────────────────────────────────────
is_node_supported() {
    if ! command -v node &>/dev/null || ! command -v npm &>/dev/null; then
        return 1
    fi
    node -e "const [major] = process.versions.node.split('.').map(Number); process.exit(major >= ${MIN_NODE_MAJOR} ? 0 : 1)" 2>/dev/null
}

# ─── 1. Ensure / Upgrade Python & Build Essentials ───────────────────────────
echo -e "${BLUE}[1/5] Verifying Python runtime (minimum ${MIN_PYTHON_MAJOR}.${MIN_PYTHON_MINOR}+)...${NC}"

PYTHON_CMD="python3"
if ! is_python_supported "python3"; then
    # Check if specific modern binary exists (e.g. python3.12, python3.11)
    if is_python_supported "python3.13"; then
        PYTHON_CMD="python3.13"
    elif is_python_supported "python3.12"; then
        PYTHON_CMD="python3.12"
    elif is_python_supported "python3.11"; then
        PYTHON_CMD="python3.11"
    else
        echo -e "${YELLOW}Python >= ${MIN_PYTHON_MAJOR}.${MIN_PYTHON_MINOR} not detected. Attempting automatic installation/upgrade...${NC}"

        if [ "$OS" = "linux" ]; then
            case "$DISTRO" in
                ubuntu|debian|pop|mint)
                    $SUDO apt-get update -y
                    $SUDO apt-get install -y software-properties-common curl git build-essential
                    if [ "$DISTRO" = "ubuntu" ]; then
                        $SUDO add-apt-repository -y ppa:deadsnakes/ppa || true
                        $SUDO apt-get update -y
                    fi
                    $SUDO apt-get install -y python3.12 python3.12-venv python3.12-dev python3-pip || \
                    $SUDO apt-get install -y python3 python3-venv python3-pip python3-dev
                    if command -v python3.12 &>/dev/null; then
                        PYTHON_CMD="python3.12"
                    fi
                    ;;
                fedora|rhel|centos|rocky|almalinux)
                    PKG_TOOL=$(command -v dnf || command -v yum)
                    $SUDO $PKG_TOOL install -y python3.12 python3.12-pip python3.12-devel || \
                    $SUDO $PKG_TOOL install -y python3 python3-pip python3-devel gcc git curl
                    if command -v python3.12 &>/dev/null; then
                        PYTHON_CMD="python3.12"
                    fi
                    ;;
                arch|manjaro)
                    $SUDO pacman -Sy --noconfirm python python-pip base-devel git curl
                    ;;
                alpine)
                    $SUDO apk update
                    $SUDO apk add --no-cache python3 py3-pip python3-dev gcc musl-dev linux-headers git curl
                    ;;
                *)
                    echo -e "${RED}Unsupported Linux distribution: ${DISTRO}.${NC}"
                    echo -e "${RED}Please install Python >= 3.11 manually with your package manager.${NC}"
                    exit 1
                    ;;
            esac
        elif [ "$OS" = "macos" ]; then
            if ! command -v brew &>/dev/null; then
                echo -e "${RED}Homebrew is required to auto-install dependencies on macOS.${NC}"
                exit 1
            fi
            brew install python@3.12
            PYTHON_CMD="$(brew --prefix)/bin/python3.12"
        else
            echo -e "${RED}Unrecognized operating system. Please install Python >= 3.11 manually.${NC}"
            exit 1
        fi
    fi
fi

# Verify venv module availability (Debian/Ubuntu packages venv separately)
if ! "$PYTHON_CMD" -m venv --help &>/dev/null; then
    echo -e "${YELLOW}python3-venv module missing. Installing package...${NC}"
    if [ "$OS" = "linux" ] && [ -n "$SUDO" ]; then
        if [ "$DISTRO" = "ubuntu" ] || [ "$DISTRO" = "debian" ]; then
            $SUDO apt-get install -y python3-venv "${PYTHON_CMD}-venv" || true
        fi
    fi
fi

echo -e "${GREEN}✓ Using Python: $("$PYTHON_CMD" --version) (${PYTHON_CMD})${NC}"

# ─── 2. Ensure / Upgrade Node.js & npm (>= 18.18, prefer 20 LTS) ──────────────
echo -e "${BLUE}[2/5] Verifying Node.js runtime (minimum v${MIN_NODE_MAJOR}+, recommended v20 LTS)...${NC}"

if ! is_node_supported; then
    echo -e "${YELLOW}Node.js >= v${MIN_NODE_MAJOR} not detected. Installing Node.js 20 LTS...${NC}"
    if [ "$OS" = "linux" ]; then
        case "$DISTRO" in
            ubuntu|debian|pop|mint)
                $SUDO apt-get update -y && $SUDO apt-get install -y curl ca-certificates gnupg
                curl -fsSL https://deb.nodesource.com/setup_20.x | $SUDO -E bash -
                $SUDO apt-get install -y nodejs
                ;;
            fedora|rhel|centos|rocky|almalinux)
                PKG_TOOL=$(command -v dnf || command -v yum)
                $SUDO $PKG_TOOL install -y curl
                curl -fsSL https://rpm.nodesource.com/setup_20.x | $SUDO bash -
                $SUDO $PKG_TOOL install -y nodejs
                ;;
            arch|manjaro)
                $SUDO pacman -Sy --noconfirm nodejs npm
                ;;
            alpine)
                $SUDO apk update && $SUDO apk add --no-cache nodejs npm
                ;;
            *)
                echo -e "${RED}Please install Node.js >= 18.18 / 20 LTS manually for ${DISTRO}.${NC}"
                exit 1
                ;;
        esac
    elif [ "$OS" = "macos" ]; then
        brew install node@20
        brew link --overwrite node@20 || true
    fi
fi

if ! is_node_supported; then
    echo -e "${RED}Error: Failed to find or install a compatible Node.js (>= 18.18.0).${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Using Node.js: $(node -v) with npm $(npm -v)${NC}"

# ─── 3. Backend Virtualenv & Dependencies ─────────────────────────────────────
echo -e "${BLUE}[3/5] Setting up backend Python virtual environment...${NC}"

# If venv is missing or was created with an incompatible python, recreate it
RECREATE_VENV=false
if [ ! -d "${VENV_DIR}" ] || [ ! -f "${VENV_DIR}/bin/python" ]; then
    RECREATE_VENV=true
else
    if ! is_python_supported "${VENV_DIR}/bin/python"; then
        echo -e "${YELLOW}Existing virtualenv uses incompatible Python. Recreating with ${PYTHON_CMD}...${NC}"
        rm -rf "${VENV_DIR}"
        RECREATE_VENV=true
    fi
fi

if [ "$RECREATE_VENV" = true ]; then
    echo -e "${YELLOW}Creating fresh virtualenv at ${VENV_DIR}...${NC}"
    "$PYTHON_CMD" -m venv "${VENV_DIR}"
fi

# Explicitly activate virtualenv & put its binaries first in PATH
VIRTUAL_ENV="${VENV_DIR}"
export VIRTUAL_ENV
PATH="${VENV_DIR}/bin:${PATH}"
export PATH
# shellcheck source=/dev/null
source "${VENV_DIR}/bin/activate"

echo -e "${GREEN}✓ Virtual environment activated: ${VENV_DIR} ($("${VENV_DIR}/bin/python" --version))${NC}"

# Ensure pip is up to date and dependencies are installed
if ! "${VENV_DIR}/bin/python" -c "import django, rest_framework, rest_framework_simplejwt, corsheaders" &>/dev/null; then
    echo -e "${YELLOW}Installing backend dependencies from requirements.txt...${NC}"
    "${VENV_DIR}/bin/pip" install --upgrade pip
    "${VENV_DIR}/bin/pip" install -r "${BACKEND_DIR}/requirements.txt"
fi

# Ensure backend .env exists
if [ ! -f "${BACKEND_DIR}/.env" ]; then
    if [ -f "${BACKEND_DIR}/.env.example" ]; then
        echo -e "${YELLOW}Creating backend/.env from .env.example...${NC}"
        cp "${BACKEND_DIR}/.env.example" "${BACKEND_DIR}/.env"
    else
        cat <<EOF > "${BACKEND_DIR}/.env"
SECRET_KEY=django-insecure-freshflow-$(openssl rand -hex 16 2>/dev/null || echo "fallback-key-2026")
DEBUG=True
ALLOWED_HOSTS=*
CORS_ALLOWED_ORIGINS=http://localhost:3000
USE_TURSO=False
EOF
    fi
fi

# Apply database migrations
echo -e "${BLUE}Applying backend database migrations...${NC}"
"${VENV_DIR}/bin/python" "${BACKEND_DIR}/manage.py" migrate --noinput

# Seed demo workforce accounts and perishable catalog
echo -e "${BLUE}Ensuring demo accounts and inventory are seeded...${NC}"
"${VENV_DIR}/bin/python" "${BACKEND_DIR}/manage.py" seed_employees

# Ensure media directory exists
mkdir -p "${BACKEND_DIR}/media/profile_pictures"

# ─── 4. Frontend Setup & Dependencies ─────────────────────────────────────────
echo -e "${BLUE}[4/5] Preparing frontend dependencies and environment...${NC}"

# Check & create frontend .env / .env.local if missing
if [ ! -f "${FRONTEND_DIR}/.env" ] && [ ! -f "${FRONTEND_DIR}/.env.local" ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:8005/api" > "${FRONTEND_DIR}/.env.local"
fi

# Install dependencies if node_modules does not exist
if [ ! -d "${FRONTEND_DIR}/node_modules" ]; then
    echo -e "${YELLOW}frontend/node_modules not found. Running npm install...${NC}"
    npm --prefix "${FRONTEND_DIR}" install
fi

# ─── 5. Launch Services Concurrently ─────────────────────────────────────────
echo -e "${BLUE}[5/5] Launching FreshFlow ERP services...${NC}"

# Detect host/IP for VPS or local display
HOST_IP="localhost"
if command -v hostname &>/dev/null; then
    DETECTED_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || true)
    if [ -n "$DETECTED_IP" ]; then
        HOST_IP="$DETECTED_IP"
    fi
fi

echo -e "${GREEN}✓ Local Access:${NC}"
echo -e "  - Frontend:     ${CYAN}http://localhost:3000${NC}"
echo -e "  - Backend API:  ${CYAN}http://localhost:8005/api${NC}"
echo -e "  - Admin Panel:  ${CYAN}http://localhost:8005/admin${NC}"

if [ "$HOST_IP" != "localhost" ] && [ "$HOST_IP" != "127.0.0.1" ]; then
    echo -e "${GREEN}✓ Network / VPS Access:${NC}"
    echo -e "  - Frontend:     ${CYAN}http://${HOST_IP}:3000${NC}"
    echo -e "  - Backend API:  ${CYAN}http://${HOST_IP}:8005/api${NC}"
    echo -e "  - Admin Panel:  ${CYAN}http://${HOST_IP}:8005/admin${NC}"
fi

echo -e "${YELLOW}Press [CTRL+C] at any time to gracefully stop all services.${NC}"
echo -e "${CYAN}----------------------------------------------------------------------${NC}"

# Graceful cleanup handler
cleanup() {
    echo -e "\n${YELLOW}Stopping FreshFlow services...${NC}"
    if [ -n "${BACKEND_PID:-}" ] && kill -0 "${BACKEND_PID}" 2>/dev/null; then
        kill -SIGTERM "${BACKEND_PID}" 2>/dev/null || true
    fi
    if [ -n "${FRONTEND_PID:-}" ] && kill -0 "${FRONTEND_PID}" 2>/dev/null; then
        kill -SIGTERM "${FRONTEND_PID}" 2>/dev/null || true
    fi
    wait "${BACKEND_PID:-}" 2>/dev/null || true
    wait "${FRONTEND_PID:-}" 2>/dev/null || true
    echo -e "${GREEN}All FreshFlow services stopped cleanly.${NC}"
}
trap cleanup SIGINT SIGTERM EXIT

# Start Django Backend on 0.0.0.0:8005 (allow VPS IP access)
export ALLOWED_HOSTS="${ALLOWED_HOSTS:-*},localhost,127.0.0.1,${HOST_IP}"
"${VENV_DIR}/bin/python" "${BACKEND_DIR}/manage.py" runserver 0.0.0.0:8005 2>&1 | sed -e "s/^/[BACKEND] /" &
BACKEND_PID=$!

# Start Next.js Frontend bound to 0.0.0.0:3000
HOSTNAME=0.0.0.0 npm --prefix "${FRONTEND_DIR}" run dev -- -H 0.0.0.0 2>&1 | sed -e "s/^/[FRONTEND] /" &
FRONTEND_PID=$!

# Wait for processes
wait "${BACKEND_PID}" "${FRONTEND_PID}"
