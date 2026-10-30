# UGHE Test Web App — Frontend

Responsive Next.js homepage for UGHE. It loads site settings, navigation,
carousel slides, and statistics from the sibling Django REST API. The content
is managed in Django Admin rather than hardcoded in the page.

## Repositories

- **Frontend:** [NyLaurent/ughe-frontend](https://github.com/NyLaurent/ughe-frontend)
- **Backend:** [NyLaurent/ughe-backend](https://github.com/NyLaurent/ughe-backend)

## Run the full app with Docker (recommended)

### Requirements

Git, Docker Desktop/Engine with Compose, internet access for the first build,
and ports `3000` and `8000` available. Clone both repositories into sibling
folders named `frontend` and `backend`.

### 1. Clone both repositories

Run the matching block from the parent directory where you want the project:

<details>
<summary><strong>Windows PowerShell</strong></summary>

```powershell
New-Item -ItemType Directory -Force ughe-test-web-app
Set-Location ughe-test-web-app
git clone https://github.com/NyLaurent/ughe-frontend.git frontend
git clone https://github.com/NyLaurent/ughe-backend.git backend
Set-Location frontend
```

</details>

<details>
<summary><strong>Windows Command Prompt (CMD)</strong></summary>

```bat
mkdir ughe-test-web-app
cd /d ughe-test-web-app
git clone https://github.com/NyLaurent/ughe-frontend.git frontend
git clone https://github.com/NyLaurent/ughe-backend.git backend
cd frontend
```

</details>

<details>
<summary><strong>macOS / Linux (Bash or Zsh)</strong></summary>

```bash
mkdir -p ughe-test-web-app
cd ughe-test-web-app
git clone https://github.com/NyLaurent/ughe-frontend.git frontend
git clone https://github.com/NyLaurent/ughe-backend.git backend
cd frontend
```

</details>

### 2. Create the shared `.env` and start Docker

Run from the `frontend` folder. If the parent `.env` already exists, do not
overwrite it; check that its database credentials match the PostgreSQL volume.

<details>
<summary><strong>Windows PowerShell</strong></summary>

```powershell
Copy-Item .env.example ..\.env
docker compose -p ughe -f docker-compose.yml --env-file ..\.env up --build -d
```

</details>

<details>
<summary><strong>Windows Command Prompt (CMD)</strong></summary>

```bat
copy .env.example ..\.env
docker compose -p ughe -f docker-compose.yml --env-file ..\.env up --build -d
```

</details>

<details>
<summary><strong>macOS / Linux (Bash or Zsh)</strong></summary>

```bash
cp .env.example ../.env
docker compose -p ughe -f docker-compose.yml --env-file ../.env up --build -d
```

</details>

Skip the copy command if `.env` already exists. Docker starts PostgreSQL,
migrates/seeds Django, and starts the frontend after the API health check.

| What | URL |
| --- | --- |
| Homepage | [http://localhost:3000](http://localhost:3000) |
| Django Admin | [http://localhost:8000/admin/](http://localhost:8000/admin/) |
| Homepage API | [http://localhost:8000/api/home/](http://localhost:8000/api/home/) |

### Local sample credentials

Check the shared parent `.env` for the values actually configured.

- **Django Admin:** `ughe-admin` / `UGHE-Local-Only-2026!`
- **PostgreSQL:** database `ughe`, user `postgres`, sample password
  `ughe-local-only-password`

These are different accounts and are for local testing only. An existing
PostgreSQL volume retains its original credentials; changing `.env` does not
change its database role. Changing the admin password in `.env` does not reset
an existing Django user.

### Useful Docker commands

Run from this repository's `frontend` folder:

<details>
<summary><strong>PowerShell / Command Prompt</strong></summary>

```powershell
docker compose -p ughe -f docker-compose.yml --env-file ..\.env ps
docker compose -p ughe -f docker-compose.yml --env-file ..\.env logs -f
docker compose -p ughe -f docker-compose.yml --env-file ..\.env up --build -d
docker compose -p ughe -f docker-compose.yml --env-file ..\.env down
```

</details>

<details>
<summary><strong>macOS / Linux (Bash or Zsh)</strong></summary>

```bash
docker compose -p ughe -f docker-compose.yml --env-file ../.env ps
docker compose -p ughe -f docker-compose.yml --env-file ../.env logs -f
docker compose -p ughe -f docker-compose.yml --env-file ../.env up --build -d
docker compose -p ughe -f docker-compose.yml --env-file ../.env down
```

</details>

`down` preserves data. `down -v` deletes the database and uploaded-media
volumes.

## Frontend-only development (without Docker)

First start a Django backend exposing `/api/home/`. Install Node.js, then run
these commands from this repository.

<details>
<summary><strong>PowerShell</strong></summary>

```powershell
npm ci
$env:NEXT_PUBLIC_API_URL = "http://localhost:8000"
npm run dev
```

</details>

<details>
<summary><strong>Command Prompt (CMD)</strong></summary>

```bat
npm ci
set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

</details>

<details>
<summary><strong>macOS / Linux (Bash or Zsh)</strong></summary>

```bash
npm ci
export NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

</details>

Open [http://localhost:3000](http://localhost:3000). Run `npm run lint` and
`npm run build` to check frontend changes. The API URL must be reachable from
the browser.

## Assets and typography

The UGHE logo, supplied carousel images, and Museo Slab font files are in
`public/assets`. Museo Slab is self-hosted with Next.js `next/font/local`, so
no external font service is required. Edit carousel content in Django Admin
under **Slides**.

For Django API, admin, and backend-specific details, see the
[backend repository guide](https://github.com/NyLaurent/ughe-backend#readme).

## Security

Never commit `.env` or use sample credentials in production. Public deployment
requires a production API URL, HTTPS, and production-ready backend settings.
