# School Management System - Admin App

Full-stack application for school administrators and teachers.

## Structure

```
school-admin-app/
├── frontend/          # React.js (Vite) - Port 3001
├── backend/           # Node.js/Express - Port 5001
├── .env.example
└── README.md
```

## Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Access

- Frontend: http://localhost:3001
- Backend API: http://localhost:5001
- API Docs: http://localhost:5001/api/docs

## Features

### For Administrators
- User management (students, teachers, parents)
- Device verification approval
- Fee transaction management
- Class and timetable management
- System statistics dashboard
- Broadcast notifications

### For Teachers
- Mark attendance
- Record grades
- View assigned classes
- Manage class schedules

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Recharts, React Router
- **Backend**: Node.js, Express.js, Prisma, PostgreSQL
- **Auth**: JWT with RBAC
- **Security**: SHA-512 hashing, rate limiting, helmet

## Default Credentials

After seeding (if implemented):
- Admin: admin@school.com / Password123!
- Teacher: teacher@school.com / Password123!

## Key Workflows

1. **Device Approval**: Admin reviews pending devices and approves/rejects
2. **Fee Management**: Admin approves withdrawal requests
3. **Grade Entry**: Teachers record grades for assigned classes
4. **Attendance**: Teachers mark daily attendance

## Development Notes

- Admins cannot delete their own accounts
- Teachers can only modify records for assigned classes
- All fee withdrawals require admin approval
- Grade scores cannot exceed maxScore

## Testing

```bash
cd backend
npm test
```

## Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```
