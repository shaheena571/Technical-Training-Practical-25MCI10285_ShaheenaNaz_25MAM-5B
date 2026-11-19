# Task Manager - Full Stack App

A simple full stack project made with **React, Node.js, Express and MongoDB**.
Users can register, login, and manage their own tasks on a dashboard.

## Features
- Register and login (passwords are hashed with bcrypt)
- JWT token authentication
- Protected dashboard route (can't open it without logging in)
- Add, complete and delete tasks (saved in MongoDB)
- Every user only sees their own tasks

## Folder structure
```
fullstack-app/
├── server/                 <- backend
│   ├── models/             User.js, Task.js
│   ├── middleware/         auth.js (checks JWT)
│   ├── routes/             auth.js, tasks.js
│   ├── server.js
│   └── .env.example
└── client/                 <- frontend
    └── src/
        ├── pages/          Login, Register, Dashboard
        ├── components/     ProtectedRoute
        ├── api.js          axios setup
        └── App.jsx         routes
```

## API endpoints
| Method | URL                 | Protected | What it does          |
|--------|---------------------|-----------|-----------------------|
| POST   | /api/auth/register  | No        | create account        |
| POST   | /api/auth/login     | No        | login, returns token  |
| GET    | /api/auth/me        | Yes       | current user info     |
| GET    | /api/tasks          | Yes       | get my tasks          |
| POST   | /api/tasks          | Yes       | add a task            |
| PUT    | /api/tasks/:id      | Yes       | toggle done / pending |
| DELETE | /api/tasks/:id      | Yes       | delete a task         |

---

## Run it on your computer

You need Node.js installed, and a MongoDB database (free MongoDB Atlas works fine).

### 1. Get a MongoDB connection string
1. Go to https://www.mongodb.com/atlas and create a free account
2. Create a free cluster
3. Database Access -> add a user with a password
4. Network Access -> add IP `0.0.0.0/0` (allow from anywhere)
5. Click Connect -> Drivers -> copy the connection string

### 2. Start the backend
```bash
cd server
npm install
cp .env.example .env
```
Open the `.env` file and fill in your `MONGO_URI` and a `JWT_SECRET`. Then:
```bash
npm run dev
```
You should see `MongoDB connected`.

### 3. Start the frontend (new terminal)
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173

---

## Push to GitHub

1. Create a new empty repository on github.com (no README, no .gitignore)
2. In the main project folder run:

```bash
git init
git add .
git commit -m "first commit - task manager app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

The `.gitignore` file already stops `node_modules` and `.env` from being uploaded.
Never push your `.env` file because it has your database password.

---

## Deploy

Backend goes on **Render**, frontend goes on **Vercel** (or Netlify). Both have free plans.

### Step 1 - Deploy backend on Render
1. Go to https://render.com and login with GitHub
2. New -> **Web Service** -> select your repo
3. Fill in:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Under Environment Variables add:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = any long random text
   - `CLIENT_URL` = (leave empty for now, add it after step 2)
5. Click Deploy. You will get a link like `https://taskapp-api.onrender.com`

(On the free plan Render sleeps after some time, so the first request can take ~30 seconds.)

### Step 2 - Deploy frontend on Vercel
1. Go to https://vercel.com and login with GitHub
2. Add New -> Project -> select your repo
3. Set:
   - Root Directory: `client`
   - Framework Preset: Vite
4. Add Environment Variable:
   - `VITE_API_URL` = `https://taskapp-api.onrender.com/api` (your Render link + `/api`)
5. Deploy. You will get a link like `https://taskapp.vercel.app`

### Step 3 - Connect them
Go back to Render -> your service -> Environment, and set
`CLIENT_URL` = your Vercel link (no slash at the end, e.g. `https://taskapp.vercel.app`).
Render will redeploy. Now open your Vercel link and test register / login.

For Vercel, React Router needs a rewrite so refreshing `/dashboard` doesn't give 404.
Add a file `client/vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
(If you use Netlify instead, the `client/public/_redirects` file already does this.)

---

## Common problems
- **CORS error** -> `CLIENT_URL` on the backend must exactly match your frontend link
- **Network error on login** -> check `VITE_API_URL` is correct and ends with `/api`
- **MongoDB not connecting** -> check password has no special characters, and Network Access allows `0.0.0.0/0`
- **Changed env variable on Vercel but nothing changed** -> redeploy, Vite reads env at build time

## What I learned / ideas to add later
- Edit task title
- Due dates
- Show error messages better
- Move the token to httpOnly cookies for extra security
