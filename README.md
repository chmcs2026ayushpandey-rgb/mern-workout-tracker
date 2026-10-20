# 🏋️ MERN Workout Tracker

A full-stack workout tracking application built with the MERN stack (MongoDB, Express, React, Node.js). Users can log, view, edit, and delete their workout sessions with a modern responsive UI.

---

## 🌐 Live Demo

- **Frontend:** https://workout-tracker-ejqz.onrender.com
- **Backend API:** https://workout-tracker-backend-p6m7.onrender.com/workouts
- **GitHub:** https://github.com/chmcs2026ayushpandey-rgb/mern-workout-tracker

---

## ✨ Features

- ✅ Log workouts with type, duration, distance, calories, date and notes
- ✅ View all workouts on a live dashboard with stats
- ✅ Edit existing workout entries via a modal
- ✅ Delete workout entries
- ✅ Filter workouts by type (Running, Cycling, Weightlifting, etc.)
- ✅ Dashboard stats — total workouts, total minutes, calories burned, km covered
- ✅ Fully responsive UI built with React
- ✅ REST API with full CRUD operations
- ✅ MongoDB Atlas for cloud database storage

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Tailwind CSS
- DaisyUI
- Inline styles with dynamic theming

### Backend
- Node.js
- Express.js
- Mongoose (MongoDB ODM)
- dotenv
- CORS

### Database
- MongoDB Atlas (Cloud)

### Deployment
- Render.com (Frontend + Backend)
- GitHub (Version Control)

---

## 📁 Project Structure

```
mern-workout-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── workoutController.js
│   ├── models/
│   │   └── workoutModel.js
│   ├── routes/
│   │   └── workoutRoutes.js
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── WorkoutCard.jsx
│   │   │   └── EditWorkoutModal.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CreatePage.jsx
│   │   │   └── WorkoutNotFound.jsx
│   │   ├── lib/
│   │   │   └── axios.js
│   │   ├── context/
│   │   │   └── ToastContext.jsx
│   │   └── App.jsx
│   ├── .env
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Git installed

### 1. Clone the repository
```bash
git clone https://github.com/chmcs2026ayushpandey-rgb/mern-workout-tracker.git
cd mern-workout-tracker
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start the backend:
```bash
node server.js
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open the app
Visit `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workouts` | Get all workouts |
| GET | `/workouts/:id` | Get a single workout |
| POST | `/workouts` | Create a new workout |
| PUT | `/workouts/:id` | Update a workout |
| DELETE | `/workouts/:id` | Delete a workout |

---

## 📊 Workout Model

```json
{
  "userId": "String (required)",
  "type": "String (required)",
  "duration": "Number in minutes (required)",
  "distance": "Number in km (optional)",
  "calories": "Number (optional)",
  "date": "Date (required)",
  "notes": "String (optional)"
}
```

---

## 👨‍💻 Developer

**Ayush Pandey**
- GitHub: [@chmcs2026ayushpandey-rgb](https://github.com/chmcs2026ayushpandey-rgb)

---

## 📄 License

This project is built for educational purposes as part of the MERN stack lab evaluation.
