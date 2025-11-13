# Task Master

A modern, full-stack task management application built with React, TypeScript, Node.js, and Prisma.

## Features

- **User Authentication**: Secure JWT-based authentication system
- **Task Management**: Create, read, update, and delete tasks
- **Task Organization**: Filter tasks by status (To Do, In Progress, Done)
- **Priority Levels**: Set task priorities (Low, Medium, High)
- **Due Dates**: Track task deadlines
- **Dark Mode**: Beautiful dark mode support with theme persistence
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Stats**: Dashboard with task statistics

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting utilities

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe development
- **Prisma** - Modern ORM
- **SQLite** - Database (easily swappable)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework

## Project Structure

```
task-master/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── lib/           # Utility functions
│   │   └── main.tsx       # Application entry point
│   └── package.json
├── backend/               # Express backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── index.ts       # Server entry point
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
└── package.json           # Root package.json
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-master
```

2. Install dependencies:
```bash
npm install
```

3. Set up the backend environment:
```bash
cd backend
cp .env.example .env
```

Edit `.env` and update the `JWT_SECRET` with a secure random string.

4. Initialize the database:
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### Running the Application

#### Development Mode

Run both frontend and backend simultaneously:
```bash
npm run dev
```

Or run them separately:

**Backend** (runs on http://localhost:3001):
```bash
npm run dev:backend
```

**Frontend** (runs on http://localhost:3000):
```bash
npm run dev:frontend
```

#### Production Build

```bash
npm run build
```

### Testing

Run tests for all workspaces:
```bash
npm test
```

### Linting

Run linting for all workspaces:
```bash
npm run lint
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks (Requires Authentication)
- `GET /api/tasks` - Get all tasks for authenticated user
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Health
- `GET /api/health` - Health check endpoint

## Database Schema

### User
- id: UUID (Primary Key)
- email: String (Unique)
- name: String
- password: String (Hashed)
- createdAt: DateTime
- updatedAt: DateTime

### Task
- id: UUID (Primary Key)
- title: String
- description: String (Optional)
- status: Enum (todo, in-progress, done)
- priority: Enum (low, medium, high)
- dueDate: DateTime (Optional)
- userId: UUID (Foreign Key)
- createdAt: DateTime
- updatedAt: DateTime

## Environment Variables

### Backend (.env)
```env
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes with authentication middleware
- Input validation with Zod schemas
- CORS enabled for cross-origin requests

## Future Enhancements

- [ ] Task categories/tags
- [ ] Task sharing and collaboration
- [ ] Email notifications
- [ ] File attachments
- [ ] Task comments
- [ ] Advanced filtering and search
- [ ] Data export (CSV, PDF)
- [ ] Calendar view
- [ ] Task templates
- [ ] PostgreSQL support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions, please open an issue on the repository.
