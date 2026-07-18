# El Boutique

A catalogue e-commerce and WhatsApp commerce platform for clothing stores.

## Project Structure
- `backend/`: Node.js, Express, MongoDB API
- `frontend/`: React, Vite, Tailwind CSS application

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env variables (MongoDB URI, Cloudinary)
npm run seed  # Seed the initial admin user
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Usually defaults to VITE_API_URL=http://localhost:5000/api
npm run dev
```
