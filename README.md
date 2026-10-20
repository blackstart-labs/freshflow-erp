# FreshFlow: Cold Chain Inventory & Restaurant Supply CRM

Enterprise-grade B2B perishable supply platform engineered to eliminate food waste and logistics inefficiencies across cold-chain distribution networks.

---

## Core Capabilities

- **Algorithmic FEFO Stock Allocation:** First-Expired, First-Out batch picking with row-level database locking (`select_for_update`) to prevent race conditions and over-allocation.
- **Cold-Chain Compliance Tracking:** Temperature logging per batch with automated quarantine status triggers upon thermal breach.
- **B2B Dynamic Tiered Pricing:** Dynamic customer tier discounts (Bronze 0%, Silver 3%, Gold 7%, Platinum 10% on profit margin) with baseline purchase cost protection.
- **Automated Wastage & Expiry Markdown:** Near-expiry price degradation (30% markdown for items within 48h of expiration) and audited financial wastage scrap accounting.
- **Role-Based Access Control (RBAC):** Server-side zero-trust authorization enforcing four business roles with SimpleJWT token rotation and blacklisting.

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| **Backend Framework** | Django / Django REST Framework | Django 6.1.2 / DRF 3.15+ |
| **Authentication** | SimpleJWT with Token Rotation & Blacklisting | 5.3+ |
| **Database** | SQLite (WAL mode, busy timeout 5000ms) / Turso (libSQL) | 3.x |
| **Frontend Framework** | Next.js (App Router) | 16.3.8 |
| **UI & Styling** | React 19, Tailwind CSS 4, Lucide Icons | React 19.2.8 / Tailwind 4.x |
| **Data Fetching** | Axios singleton (with refresh concurrency queue), TanStack Query | Axios 1.7+ / Query 5.66+ |
| **Language & Tooling** | TypeScript 5, Biome | TS 5.x / Biome 2.4+ |

---

## Project Structure

```text
freshflow-erp/
├── backend/
│   ├── apps/
│   │   ├── authentication/   # Custom User model, JWT serializers, RBAC permissions
│   │   ├── inventory/        # PerishableItem, StockBatch, TemperatureLog
│   │   ├── crm/              # Restaurant profiles, rolling spend, tier progression
│   │   ├── orders/           # Order, OrderItem, atomic FEFO allocation service
│   │   ├── wastage/          # WastageLog, scrap write-offs, markdown commands
│   │   └── analytics/        # Spoilage metrics, sourcing matrix, KPI views
│   ├── core/                 # settings.py, urls.py, wsgi.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router (pages and layouts)
│   │   ├── components/       # UI elements and layout components
│   │   ├── lib/              # api.ts (Axios client with JWT interceptor queue)
│   │   └── types/            # TypeScript data contracts mirroring Django models
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   ├── AUTHENTICATION.md     # Technical specification for auth & RBAC
│   └── deliverables.txt      # Implementation roadmap and domain logic specifications
├── qna/
│   └── AUTHENTICATION_QNA.md # Defense presentation Q&A preparation guide
└── README.md
```

---

## Role-Based Access Control (RBAC)

The system enforces four distinct personas aligned with cold-chain operations:

| Role | Target Persona | Access Level |
|---|---|---|
| `ADMIN` | System administrator / business owner | Full system access across all modules |
| `WAREHOUSE_MANAGER` | Cold storage facility manager | Inventory intake, batch logging, temperature records, wastage logging |
| `SALES_AGENT` | B2B restaurant account manager | CRM restaurant management, order placement across clients |
| `RESTAURANT_CLIENT` | B2B restaurant buyer | Read catalog (dynamic tier price), self-service order placement, own order history |

---

## Getting Started

### Prerequisites

- **Python:** 3.12+
- **Node.js:** 18.18+ (Node 20+ recommended)
- **Package Manager:** npm or pnpm

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv ../venv
   source ../venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Ensure `.env` contains:
   ```env
   SECRET_KEY=your-secure-secret-key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   USE_TURSO=False
   ```

5. **Apply database migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Start the development server:**
   ```bash
   python manage.py runserver 8005
   ```
   The backend API will be available at `http://127.0.0.1:8005/`.

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8005/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend application will be available at `http://localhost:3000/`.

---

## Primary API Endpoints

### Health Check
- `GET /api/health/` — Service liveness probe

### Authentication (`/api/auth/`)
- `POST /api/auth/token/` — Login (returns access token, refresh token, user profile)
- `POST /api/auth/token/refresh/` — Refresh access token (with single-use token rotation)
- `POST /api/auth/token/blacklist/` — Logout (revokes refresh token)
- `POST /api/auth/register/` — Client self-registration (default role: `RESTAURANT_CLIENT`)
- `GET, PUT /api/auth/profile/` — Authenticated user profile inspection and updates

### Inventory & Batches (`/api/inventory/`)
- `GET, POST /api/inventory/items/` — Perishable item definitions and catalog
- `GET, POST /api/inventory/batches/` — Stock batch intake with initial temperature logging
- `POST /api/inventory/batches/{id}/log_temperature/` — Cold-chain compliance temperature check

### CRM & Clients (`/api/crm/`)
- `GET, POST /api/crm/restaurants/` — Restaurant client profiles and rolling spend tracking
- `GET /api/crm/restaurants/{id}/tier/` — Current discount tier status

### Orders (`/api/orders/`)
- `POST /api/orders/` — Place order (executes transactional FEFO allocation)
- `GET /api/orders/` — Order history and fulfillment status

### Wastage & Spoilage (`/api/wastage/`)
- `POST /api/wastage/scrap/` — Log physical wastage and calculate balance sheet loss
- `GET /api/wastage/logs/` — Audit trail of scrap events

### Analytics (`/api/analytics/`)
- `GET /api/analytics/kpis/` — Executive KPI aggregation (active batches, daily orders, spoilage)
- `GET /api/analytics/supplier-spoilage/` — Supplier quality and spoilage rate matrix

---

## Testing & Quality Assurance

### Run Backend Test Suite
```bash
cd backend
python manage.py test apps.authentication
```

### Run Frontend Static Typecheck & Linting
```bash
cd frontend
npm run typecheck
npm run lint
```

---

## Documentation Index

- **[docs/AUTHENTICATION.md](docs/AUTHENTICATION.md):** Complete technical architecture, sequence diagrams, security invariants, and API payload definitions.
- **[qna/AUTHENTICATION_QNA.md](qna/AUTHENTICATION_QNA.md):** Comprehensive defense preparation covering 13 sections of supervisor and panel questions.
- **[docs/deliverables.txt](docs/deliverables.txt):** Full technical roadmap and algorithmic specifications for FEFO allocation and dynamic pricing.

---

## License

This project is licensed under the MIT License.