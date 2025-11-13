# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

**IMPORTANT**: Edit `backend/.env` and change the `JWT_SECRET` to a secure random string!

## 3. Setup Database

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

## 4. Start Development Server

From the root directory:

```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 5. Create Your First Account

1. Navigate to http://localhost:3000
2. Click "Sign up"
3. Create an account with your email and password
4. Start managing your tasks!

## Troubleshooting

### Port Already in Use

If port 3000 or 3001 is already in use, you can change them:
- Frontend: Edit `frontend/vite.config.ts`
- Backend: Edit `backend/.env` PORT variable

### Database Issues

If you encounter database errors, try:
```bash
cd backend
rm -f prisma/dev.db
npm run prisma:migrate
```

### Module Not Found

Make sure all dependencies are installed:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```
