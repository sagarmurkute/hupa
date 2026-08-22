# Getting Started with HUPA

This guide walks you through setting up HUPA locally for development or personal usage.

---

## System Requirements

- **Operating System**: Windows 10/11, macOS 12+, or modern Linux distribution
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **Database**: PostgreSQL 15+ (local instance or free cloud database on [Supabase](https://supabase.com))

---

## 1. Clone the Repository

```bash
git clone https://github.com/sagarmurkute/hupa.git
cd hupa
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create your local `.env` file from the provided `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and fill in the required variables:

```env
# Server Port & Client URL
NODE_ENV=development
PORT=3001
APP_URL=http://localhost:5173

# Better Auth Secret (Generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secure-32-char-random-secret
BETTER_AUTH_URL=http://localhost:5173

# PostgreSQL Database URL
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres
```

---

## 4. Run Database Migrations

Apply the initial schema migration to your PostgreSQL database:

```bash
# If using psql
psql $DATABASE_URL -f supabase/migrations/20260821000000_initial_schema.sql
```

Alternatively, open your **Supabase Dashboard** -> **SQL Editor**, paste the contents of `supabase/migrations/20260821000000_initial_schema.sql`, and click **Run**.

---

## 5. Start HUPA

### Running the Web Application
```bash
npm run dev
```
This launches:
- **Client (Vite)** on `http://localhost:5173`
- **API Server (Express 5)** on `http://localhost:3001`

### Running the Windows Desktop Application
```bash
npm run dev:desktop
```
This boots the local Vite server, API server, and native Electron window with hot module reloading.

---

## 6. Verifying the Setup

1. Open `http://localhost:5173` in your browser.
2. Click **Create Project** in the modal.
3. Drag nodes from the left palette onto the canvas.
4. Create relationships between nodes by dragging from connection ports.
5. Notice the **Status Bar** shows `Local IndexedDB` or `Cloud Synced` in real time.
