# Q&A Forum Web (Vue 3)

Frontend web app for the Q&A Forum. Provides authentication, thread browsing,
thread detail with replies, and user profile pages.

## Features

- Auth flow (login/register)
- Threads list and detail view
- Create replies and view discussion
- User profile and "My Threads" page
- Route guards for protected pages

## Tech stack

- Vue 3 + Vite
- Vue Router
- Pinia state management
- Axios API client
- Tailwind CSS

## Requirements

- Node.js 20+

## Environment variables

Create a `.env` file in this folder:

```bash
VITE_API_URL=http://localhost:3000/api
```

## Setup

```bash
npm install
```

## Run the app

```bash
npm run dev
```

## Build and preview

```bash
npm run build
npm run preview
```

## Project structure

- `src/api` Axios client and interceptors
- `src/stores` Auth store (Pinia)
- `src/views` Page-level views
- `src/components` Reusable UI components
