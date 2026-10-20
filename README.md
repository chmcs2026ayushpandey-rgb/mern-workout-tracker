# 🏋️ MERN Workout Tracker

A full-stack workout and fitness tracking application built with the **MERN stack**. It helps users record workouts, monitor fitness statistics, track goals, and save body measurements through a responsive web interface.

## ✨ Features

- **Authentication** — register and log in with protected pages and token-based authentication.
- **Workout tracking** — create, view, edit, and delete workout sessions.
- **Workout details** — record workout type, duration, distance, calories, date, and notes.
- **Dashboard statistics** — review workout totals and activity metrics.
- **Progress visualization** — view fitness progress using charts.
- **Workout filtering** — find workouts by activity type and date range.
- **Fitness goals** — create and track personal goals.
- **Body measurements** — record and review measurements over time.
- **Responsive interface** — use the application on desktop and mobile-sized screens.
- **REST API** — a Node.js/Express backend connected to MongoDB.

## 🧰 Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Recharts
- Tailwind CSS / DaisyUI

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- dotenv and CORS

### Deployment
The project has previously been configured for deployment on Render. See the live links below; availability may change.

- **Frontend:** https://workout-tracker-ejqz.onrender.com
- **Backend API:** https://workout-tracker-backend-p6m7.onrender.com
- **Repository:** https://github.com/chmcs2026ayushpandey-rgb/mern-workout-tracker

## 📁 Project Structure

```text
mern-workout-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── goalController.js
│   │   ├── measurementController.js
│   │   └── workoutController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── goalModel.js
│   │   ├── measurementModel.js
│   │   ├── userModel.js
│   │   └── workoutModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── measurementRoutes.js
│   │   └── workoutRoutes.js
│   ├── .env                 # Create locally; do not commit
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                 # Create locally; do not commit
│   └── package.json
└── README.md
```

## ✅ Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) (a current LTS version is recommended)
- npm (included with Node.js)
- A MongoDB database, such as a MongoDB Atlas cluster
- Git (optional, for cloning the repository)

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/chmcs2026ayushpandey-rgb/mern-workout-tracker.git
cd mern-workout-tracker
```

### 2. Configure and start the backend

```bash
cd backend
npm install
```

Create a `backend/.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
```

Use your own MongoDB connection string and a strong, private JWT secret. Do not commit `.env` files or share their contents.

Start the backend in development mode:

```bash
npm run dev
```

Or run it with Node:

```bash
npm start
```

The API server defaults to `http://localhost:5000`.

### 3. Configure and start the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

> **Important:** Vite exposes `VITE_` variables to browser code. Never put database credentials, JWT secrets, or other private keys in frontend environment variables.

## 🧪 Useful Commands

Run these from the relevant project folder.

### Frontend

```bash
npm run dev       # Start Vite development server
npm run build     # Build the production frontend
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

### Backend

```bash
npm run dev       # Start backend with nodemon
npm start         # Start backend with Node.js
```

## 🔌 API Overview

The backend mounts these route groups:

| Route prefix | Purpose |
|---|---|
| `/auth` | Registration and login |
| `/workouts` | Workout records |
| `/goals` | Fitness goals |
| `/measurements` | Body measurement records |

The exact methods and endpoint paths are defined in the corresponding files under `backend/routes/`. Authenticated endpoints expect a valid bearer token where required.

## 🗃️ Database

MongoDB stores application data through Mongoose models. Configure the database connection using `MONGO_URI` in `backend/.env`. Ensure your database network-access rules allow the machine or hosting service running the backend to connect.

## 🛠️ Troubleshooting

- **Database connection fails:** verify `MONGO_URI`, database credentials, and MongoDB network-access rules.
- **Frontend cannot reach the API:** ensure the backend is running and `VITE_API_URL` points to the correct base URL. Restart Vite after changing `.env`.
- **Authentication repeatedly expires:** sign in again and check that the backend has a consistent `JWT_SECRET`.
- **Port already in use:** change `PORT` for the backend or use the alternate local port provided by Vite.
- **Production deployment issues:** configure environment variables in the hosting provider and ensure the frontend uses the deployed backend URL.

## 🔐 Security Notes

- Keep `.env` files out of version control.
- Never publish MongoDB connection strings, passwords, or JWT secrets.
- Use a strong, unique `JWT_SECRET` in development and production.
- Configure CORS for your intended frontend origin before production use.
- Use HTTPS for deployed applications.

## 👨‍💻 Author

**Ayush Pandey**  
GitHub: [@chmcs2026ayushpandey-rgb](https://github.com/chmcs2026ayushpandey-rgb)

## 📄 License

This project is intended for educational purposes. Add a specific open-source license file if you plan to distribute it under a formal license.
