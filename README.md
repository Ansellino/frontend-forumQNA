# Q&A Forum Frontend

Vue 3 web application for Q&A forum discussion platform. Users can browse threads, create discussions, reply to threads, and manage their profiles with secure authentication.

## ✨ Features

- User authentication (login/register with JWT)
- Browse and search threads
- View thread details with replies
- Create and manage threads
- User profiles with personal thread management
- Protected routes and role-based access

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 + Vite |
| Routing | Vue Router |
| State | Pinia |
| HTTP | Axios |
| Styling | Tailwind CSS |

## 📋 Requirements

- Node.js 20 or higher
- npm 10+ or yarn/pnpm

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file in the project root:
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
src/
├── api/           Axios client configuration and API interceptors
├── stores/        Pinia store (auth, user state)
├── views/         Full-page components (Home, Thread, Profile, etc)
├── components/    Reusable UI components
├── router/        Route definitions and guards
├── assets/        Static files and images
└── main.ts        Application entry point
```

## 🔗 Related Projects

- Backend API: `../Backend` - Express.js server
- See main repository README for full setup instructions
