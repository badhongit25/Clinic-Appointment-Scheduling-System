# 🏥 ClinicCare — Modern Clinic Appointment Scheduling System

A modern, production-ready Fullstack Healthcare Appointment Scheduling System built with **React (Vite) + Tailwind CSS + Node.js (Express) + PostgreSQL**.

---

## ✨ Features

- 🎨 **Modern Medical UI/UX:** Responsive design, glassmorphic dark theme, intuitive booking flows.
- 🩺 **Specialist Directory:** Browse certified doctors by specialty, visiting hours, and department.
- 📅 **Interactive Appointment Scheduling:** Pick preferred doctors, dates, and time slots with instant confirmation.
- 🔐 **Secure Role-Based Authentication:** JWT token authentication with bcrypt password hashing for Patients & Admins.
- 📊 **Administrative Command Center:** Live appointment moderation table, search & filter, status updates (*Confirmed*, *Cancelled*), doctor schedule management.
- 📧 **Automated Email Notifications:** Nodemailer integration with responsive HTML templates for appointment booking and status updates.
- 🗄️ **Database Resiliency:** Connects directly to PostgreSQL (Render / Supabase / Neon) with automated schema initialization and a local embedded JSON fallback.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express.js, JWT, Bcrypt.js, Nodemailer, PG (PostgreSQL)
- **Deployment:** Render (Unified Fullstack Service), Vercel, Railway

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/badhongit25/Clinic-Appointment-Scheduling-System.git
cd Clinic-Appointment-Scheduling-System
```

### 2. Install dependencies & build
```bash
# Install frontend & backend dependencies and build React app
npm run build
```

### 3. Start the unified production server
```bash
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser!

### 4. For Local Development with Hot-Reloading
In two separate terminals:
```bash
# Terminal 1: Backend Server (Port 5000)
npm run dev:backend

# Terminal 2: Vite React Frontend (Port 5173)
npm run dev:frontend
```

---

## 🌐 Online Cloud Deployment

### Option A: Render (Unified Fullstack — Recommended)
1. Go to [Render.com](https://dashboard.render.com).
2. Connect your GitHub repository: `badhongit25/Clinic-Appointment-Scheduling-System`.
3. Render will automatically detect `render.yaml` or you can select:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Set Environment Variables (optional):
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `JWT_SECRET`: Any random 32+ character string.
   - `ADMIN_EMAIL`: Your admin email.
   - `ADMIN_PASSWORD`: Your admin password.
5. Click **Deploy Web Service**!

### Default Admin Credentials:
- **Email:** `admin@clinic.com`
- **Password:** `admin123`

---

## 👨‍💻 Developer
Developed with ❤️ by **[Badhon](https://github.com/badhongit25)**.
