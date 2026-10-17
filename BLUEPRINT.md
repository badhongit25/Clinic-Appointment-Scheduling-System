# 🏥 Clinic Appointment Scheduling System — Architectural Blueprint

> **System Version:** 2.0.0  
> **Architecture Pattern:** Modular Fullstack (React SPA + Node.js REST API + PostgreSQL / Resilient JSON Store)  
> **Author & Developer:** [Badhon](https://github.com/badhongit25)  

---

## 1. 🏗️ High-Level System Architecture

```mermaid
graph TB
    subgraph ClientLayer ["Client Layer (React 19 + Vite + Tailwind CSS v4)"]
        Landing["Landing & Medical Services"]
        AuthModal["Auth Modal (Patient / Admin)"]
        PatientPortal["Patient Dashboard (Appointments & Booking)"]
        AdminPortal["Admin Command Center (Moderation & Doctors)"]
        ApiClient["Centralized API Client (Fetch + JWT Interceptor)"]
    end

    subgraph ServerLayer ["Backend Layer (Node.js & Express.js)"]
        ExpressApp["Express Router & Middleware"]
        AuthMid["JWT Auth Middleware & Role Guard"]
        AuthCtrl["Auth Controller (Bcrypt + JWT)"]
        ApptCtrl["Appointment Controller"]
        DocCtrl["Doctor Controller"]
        EmailSvc["Nodemailer Notification Service"]
    end

    subgraph DataLayer ["Data & Storage Layer"]
        PostgresDB[("PostgreSQL Database (Render / Supabase / Neon)")]
        LocalFallback[("Resilient Local JSON Fallback (Zero Downtime)")]
    end

    subgraph CloudLayer ["External Cloud Services"]
        SMTP["Gmail SMTP Server"]
        RenderCloud["Render Web Service / Vercel"]
    end

    %% Connections
    Landing --> ApiClient
    AuthModal --> ApiClient
    PatientPortal --> ApiClient
    AdminPortal --> ApiClient

    ApiClient -->|REST API Requests / Authorization: Bearer JWT| ExpressApp
    ExpressApp --> AuthMid
    AuthMid --> AuthCtrl
    AuthMid --> ApptCtrl
    AuthMid --> DocCtrl

    AuthCtrl --> PostgresDB
    ApptCtrl --> PostgresDB
    DocCtrl --> PostgresDB

    AuthCtrl -.->|Offline / Fallback| LocalFallback
    ApptCtrl -.->|Offline / Fallback| LocalFallback
    DocCtrl -.->|Offline / Fallback| LocalFallback

    ApptCtrl --> EmailSvc
    EmailSvc -->|TLS / Port 465/587| SMTP
    RenderCloud --> ExpressApp
```

---

## 2. 🗄️ Database Schema & Entity Relationships

```mermaid
erDiagram
    USERS ||--o{ APPOINTMENTS : "books"
    DOCTORS ||--o{ APPOINTMENTS : "attends"

    USERS {
        int id PK
        string name
        string email UK
        string password
        string role "patient | admin"
        timestamp created_at
    }

    DOCTORS {
        int id PK
        string name
        string specialty
        string department
        string experience
        string available_days
        string available_time
        timestamp created_at
    }

    APPOINTMENTS {
        int id PK
        string patient_name
        string patient_email
        int doctor_id FK
        string doctor_name
        string doctor_dept
        string appointment_date
        string appointment_time
        string problem
        string status "Pending | Confirmed | Cancelled"
        timestamp created_at
    }
```

---

## 3. 🔄 Appointment Booking & Status Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending: Patient schedules appointment
    Pending --> Confirmed: Admin clicks Accept (Trigger confirmation email)
    Pending --> Cancelled: Admin clicks Reject / Patient cancels
    Confirmed --> Cancelled: Patient cancels / Admin revokes
    Cancelled --> [*]: Final state
    Confirmed --> [*]: Patient visit completed
```

---

## 4. 🔐 Authentication & Role-Based Access Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Patient / Admin
    participant Client as React Client (AuthContext)
    participant Server as Express Server (/api/auth)
    participant DB as PostgreSQL Database

    User->>Client: Enters Email & Password
    Client->>Server: POST /api/auth/login { email, password }
    Server->>DB: SELECT * FROM users WHERE email = $1
    DB-->>Server: Return User Record & Hashed Password
    Server->>Server: Verify password with bcrypt.compare()
    alt Credentials Valid
        Server->>Server: Sign JWT token { id, email, name, role }
        Server-->>Client: 200 OK { token, user: { id, name, email, role } }
        Client->>Client: Store token in localStorage & update AuthState
        alt User is Admin
            Client->>User: Redirect to Admin Command Center
        else User is Patient
            Client->>User: Redirect to Patient Portal
        end
    else Credentials Invalid
        Server-->>Client: 401 Unauthorized { message: "Invalid email or password" }
        Client->>User: Display error toast notification
    end
```

---

## 5. 📡 RESTful API Contract Specification

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new patient account | `{ name, email, password }` |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT | `{ email, password }` |
| `GET` | `/api/auth/me` | Protected | Fetch current user profile | Header: `Authorization: Bearer <token>` |

### 📅 Appointments (`/api/appointments`)
| Method | Endpoint | Access | Description | Request Body / Query |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/appointments` | Public / Patient | Book a new medical appointment | `{ patientName, patientEmail, doctorName, doctorDept, date, time, problem }` |
| `GET` | `/api/appointments` | Public / Admin | Fetch appointments (supports `?email=...`) | Query params: `email` (optional) |
| `PATCH`| `/api/appointments/:id/status` | Admin | Update status (`Confirmed`, `Cancelled`) | `{ status: "Confirmed" \| "Cancelled" }` |
| `DELETE`| `/api/appointments/:id` | Admin / Patient | Permanently delete appointment | URL param: `id` |

### 🩺 Doctors (`/api/doctors`)
| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/doctors` | Public | List all active specialists | — |
| `POST` | `/api/doctors` | Admin | Add new specialist to directory | `{ name, specialty, department, experience, available_days, available_time }` |
| `DELETE`| `/api/doctors/:id` | Admin | Remove doctor from system | URL param: `id` |

---

## 6. 📁 Directory Tree Architecture

```
Clinic Appointment Scheduling System/
├── .gitignore                    # Root gitignore (ignores node_modules, dist, .env)
├── package.json                  # Root runner & build orchestration
├── render.yaml                   # Infrastructure-as-code for Render deployment
├── README.md                     # Project documentation & setup instructions
├── BLUEPRINT.md                  # Comprehensive architectural blueprint
│
├── backend/                      # Node.js Express REST API
│   ├── config/
│   │   └── db.js                 # PostgreSQL connection pool & resilient local JSON fallback
│   ├── controllers/
│   │   ├── appointmentController.js # Appointment booking, listing, moderation
│   │   ├── authController.js     # Register, login, JWT issuance
│   │   └── doctorController.js   # Doctor listing, creation, removal
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification & requireAdmin guard
│   ├── routes/
│   │   ├── appointmentRoutes.js  # /api/appointments
│   │   ├── authRoutes.js         # /api/auth
│   │   └── doctorRoutes.js       # /api/doctors
│   ├── services/
│   │   └── emailService.js       # Nodemailer HTML email notifications
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server & static React SPA handler
│
├── frontend/                     # Modern React SPA (Vite + Tailwind CSS v4)
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── api/
│   │   │   └── apiClient.js      # Centralized HTTP client
│   │   ├── components/
│   │   │   ├── AuthModal.jsx     # Patient & Admin login/register modal
│   │   │   ├── BookingModal.jsx  # Doctor selection & slot picker modal
│   │   │   ├── Footer.jsx        # Footer with developer credit
│   │   │   └── Navbar.jsx        # Responsive navigation & role indicators
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global user state & session management
│   │   ├── views/
│   │   │   ├── AdminDashboard.jsx # Admin KPI cards, moderation table, doctor manager
│   │   │   ├── HomeView.jsx      # Medical hero, departments, doctor cards
│   │   │   └── PatientDashboard.jsx # Patient appointment tracking & cancellations
│   │   ├── App.jsx               # Root React component
│   │   ├── index.css             # Tailwind CSS & theme styling
│   │   └── main.jsx              # React DOM root entry
│   ├── index.html                # HTML5 template with Plus Jakarta Sans
│   ├── package.json              # Frontend dependencies
│   ├── vercel.json               # Vercel SPA routing fallback
│   └── vite.config.js            # Vite configuration with Tailwind CSS plugin & proxy
│
└── legacy_backup/                # Secure archive of initial vanilla HTML/CSS/JS files
```
