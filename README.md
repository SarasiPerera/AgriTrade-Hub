# AgriTrade Hub

A digital agricultural marketplace connecting Sri Lankan farmers with wholesale buyers and export centers.

## Stack

- **Frontend:** React 19 + Vite + Tailwind CSS + React Router + Axios
- **Backend:** FastAPI + SQLAlchemy + JWT auth
- **Database:** PostgreSQL

## What's included (MVP)

- Four roles: Farmer, Wholesale Center, Export Center, Administrator
- JWT auth (register/login) with role-based access
- Farmer: create/manage listings, view & respond to incoming orders
- Wholesale/Export: search & filter listings, smart-match by quantity/crop/district, place orders
- Admin: verify users, approve/reject listings, marketplace stats dashboard
- A distinct "exchange board" visual identity (see `frontend/src/index.css` and `tailwind.config.js`)

## Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env: set DATABASE_URL to your Postgres instance and a real SECRET_KEY
# For quick local testing without Postgres, you can use:
#   DATABASE_URL=sqlite:///./dev.db

uvicorn app.main:app --reload --port 8000
```

API docs will be available at `http://localhost:8000/docs`.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

By default the frontend calls `http://localhost:8000`. To point elsewhere, create
`frontend/.env` with:

```
VITE_API_BASE_URL=https://your-backend-url
```

## Deploying

- **Frontend:** Vercel (or Netlify) — `npm run build` outputs to `frontend/dist`
- **Backend:** Render or Railway — start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Database:** Neon or Supabase (managed Postgres)

## Suggested next steps (Phase 2)

- Price prediction, demand prediction, and image quality detection (see original plan)
- Notifications (new order / accepted / rejected / delivered)
- Multilingual chatbot for onboarding & FAQs
- Alembic migrations instead of `create_all` on startup
- Image upload via Cloudinary (field already exists on `Product.images`)
