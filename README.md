# learlify-app

Monorepo for the Learlify application.

## Structure

```
├── backend/    — Node.js/Express API server
└── frontend/   — React (Vite) client application
```

Each package is self-contained with its own dependencies, configuration, and scripts. See the respective `package.json` and `README.md` for details.

## Development

Refer to each package's documentation:

- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)

### Quick start

```bash
# Backend
cd backend
cp .env.example .env   # then fill in values
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
cp env_example .env    # then fill in values
npm install
npm run dev
```

## Deployment

Each package is deployed independently. Refer to their respective Dockerfiles and documentation.
