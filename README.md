# Event Reminder App

A full-stack MERN application designed to organize events, visualize progress, and send web push notifications for upcoming reminders. Built with a focus on clean architecture, smooth animations, and micro-interactions.


## ✨ Features
- **Authentication:** Secure JWT Login & Signup.
- **Visual Dashboard:** Gradient UI with glassmorphism widgets.
- **Animations:** Smooth page transitions and hover effects using Framer Motion.
- **Event Management:** Create, Track, and Mark events as Completed.
- **Push Notifications:** Service Workers & WebPush trigger alerts 30 mins before an event.
- **Responsive:** Fully optimized for mobile and desktop.

## 🛠 Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose).
- **Utilities:** Web-Push (Notifications), Node-Cron (Scheduling), BCrypt (Security).

## 📂 Project Structure
The project is organized into a monorepo structure:
- **/client**: React Frontend
  - `/src/context`: Auth state management.
  - `/src/components`: Reusable UI elements (Modals, Cards).
  - `/src/pages`: Main views.
- **/server**: Node Backend
  - `/models`: Database schemas.
  - `/routes`: API endpoints.
  - `cron.js`: Background job for checking reminders.

## ⚙️ Setup Instructions (Local)

### Prerequisites
- Node.js installed
- MongoDB Atlas URI

### 1. Backend Setup
```bash
cd server
npm install
# Create .env file with PORT, MONGO_URI, JWT_SECRET, PUBLIC/PRIVATE VAPID KEYS
npm run dev
