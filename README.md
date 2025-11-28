# Honors IT Inventory Management System

### Preview


## Tech Stack

- **Backend**: ASP.NET with Entity Framework Core
- **Frontend**: React + TypeScript with Vite
- **Database**: SQLite

## Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18 or higher)

## Getting Started

### Backend Setup

```bash
cd backend
dotnet restore
dotnet run
```

The API will start on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Database Setup

SQLite database with Entity Framework Core. Initialize the schema and sample data using one of these options:

### Option 1: Using Python (Recommended)
Python comes with sqlite3 built-in. Run from the project root:

**Windows (PowerShell/CMD):**
```powershell
python -c "import sqlite3; db=sqlite3.connect('backend/inventory.db'); db.executescript(open('schema.sql', encoding='utf-8').read()); db.close()"
```

**Linux/Mac:**
```bash
python3 -c "import sqlite3; db=sqlite3.connect('backend/inventory.db'); db.executescript(open('schema.sql').read()); db.close()"
```

### Option 2: Using DB Browser for SQLite (GUI)
1. Download and install [DB Browser for SQLite](https://sqlitebrowser.org/)
2. Open `backend/inventory.db` (create if it doesn't exist)
3. Go to "Execute SQL" tab
4. Open `schema.sql` file
5. Click "Execute SQL" (F5)

### Option 3: Using SQLite CLI
If SQLite CLI is installed, run from the project root:
```bash
sqlite3 backend/inventory.db < schema.sql # cmd
```