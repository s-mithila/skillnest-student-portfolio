# SkillNest — Student Portfolio & Skill-Sharing Platform

> **A modern, responsive web application designed for university students to showcase technical skills, publish course & capstone projects, and connect with teammates.**

![SkillNest Platform](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80)

---

## 🎓 1. Project Overview & Problem Statement

### The Problem
During university degree programs (especially Computer Science and Engineering), students build valuable term projects, assignments, and hackathon prototypes. However:
1. Student projects are frequently buried across disjointed private folders or personal drives.
2. Standard professional networks (e.g., LinkedIn) are filled with corporate noise and lack university-specific context (such as current semester, department, or coursework).
3. Forming balanced teams for final-year capstone projects or hackathons often relies on guesswork or social circles rather than verified technical competencies.

### The Solution: SkillNest
**SkillNest** is an open, unified student portfolio network tailored for academic environments. It empowers students to:
- Build an academic engineering portfolio highlighting verified technical skills.
- Document projects with live repository links, architecture summaries, and technologies used.
- Publish and discover open collaboration opportunities (e.g., seeking a frontend developer for a capstone).
- Connect directly with peers across engineering departments.

---

## 🚀 2. Quick Start & Installation

SkillNest is designed for effortless evaluation: **one single root package file, zero configuration files, and zero external database setup required.**

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or newer (`node -v`)
- npm v10 or newer (`npm -v`)

### 1-Command Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/USERNAME/skillnest-student-portfolio.git
cd skillnest-student-portfolio

# 2. Install all dependencies (Frontend + Backend in one step)
npm install

# 3. Start the application
npm run dev
```

Then open your browser at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 3. Demo Credentials

SkillNest comes pre-loaded with sample university students, projects, and collaboration opportunities. For quick evaluation or university presentations, you can use the built-in demo account or click the **"Autofill"** button on the Login page:

| Field | Value |
| :--- | :--- |
| **Email** | `demo@skillnest.local` |
| **Password** | `Demo123!` |
| **Student** | Amina Rahman (7th Semester CSE) |

---

## 🛠️ 4. Technology Stack

### Frontend
- **React 18** – Modular user interface components.
- **Vite 6** – High-speed development server and optimized bundler.
- **React Router 6** – Client-side routing with route guards for authenticated sessions.
- **Lucide React** – Clean, lightweight iconography.
- **Plain Vanilla CSS** – Custom design system with CSS custom properties (no bulky frameworks).

### Backend
- **Node.js** – Asynchronous server runtime.
- **Express.js** – RESTful API endpoints and session management.
- **express-session** – Secure cookie-based HTTP authentication sessions.
- **bcryptjs** – Salted password hashing (passwords never stored or sent in plaintext).

### Database
- **SQLite 3 via `better-sqlite3`** – Fast, serverless, transactional embedded SQL database stored locally at `server/database/skillnest.db`. Automatically initializes and seeds on first startup.

---

## ✨ 5. Key Features

- **🏠 Modern Landing Page**: High-converting hero section with quick statistics, featured student projects, and a step-by-step explainer.
- **🔐 Secure Authentication**: Student registration and login with input validation, password hashing, and cookie session persistence.
- **📊 Interactive Student Dashboard**:
  - Dynamic **Profile Completion Meter** (e.g., 80% with actionable tips).
  - Quick statistics overview (skills count, projects count, open requests).
  - Centralized management for projects, skills, and collaboration posts.
- **🏷️ Technical Skills Management**: Add and remove technical skills (e.g., React, Python, C++, Machine Learning) displayed as interactive tags.
- **💼 Project Showcase**: Full CRUD operations for student projects with technology tags, GitHub links, and live preview links.
- **🔍 Student Directory & Multi-Criteria Search**:
  - Search students by name or biography keyword.
  - Filter by university name.
  - Filter by engineering department.
  - Filter by technical skill.
- **🤝 Team Finder Board**:
  - Post collaboration requests (e.g., *"Looking for React Developer for Capstone"*).
  - Filter by open status and required technical stack.
  - Direct email contact links to opportunity creators.
- **📄 Public Portfolio & Resume Mode**: Shareable public link (`/students/:id`) with built-in printable CV layout (`Ctrl + P` / `Cmd + P`).

---

## 🗄️ 6. Database Schema Overview

```
                      +-------------------+
                      |       users       |
                      +-------------------+
                      | id (PK)           |
                      | full_name         |
                      | email (UNIQUE)    |
                      | password_hash     |
                      | university        |
                      | department        |
                      | semester          |
                      | bio               |
                      | profile_image     |
                      | github_url        |
                      | linkedin_url      |
                      | created_at        |
                      +---------+---------+
                                | 1
                                |
        +-----------------------+-----------------------+
        | N                     | N                     | N
+-------v-------+       +-------v-------+       +-------v--------+
|    skills     |       |   projects    |       | opportunities  |
+---------------+       +---------------+       +----------------+
| id (PK)       |       | id (PK)       |       | id (PK)        |
| user_id (FK)  |       | user_id (FK)  |       | user_id (FK)   |
| skill_name    |       | title         |       | title          |
+---------------+       | description   |       | description    |
                        | technologies  |       | required_skills|
                        | github_url    |       | status         |
                        | demo_url      |       | created_at     |
                        | image_url     |       +----------------+
                        | created_at    |
                        +---------------+
```

---

## 📂 7. Folder Structure

```
skillnest-student-portfolio/
├── client/                      # React Frontend Application
│   ├── index.html               # HTML Entry template
│   └── src/
│       ├── components/          # Reusable UI components
│       │   ├── Navbar.jsx       # Header & main navigation
│       │   ├── Footer.jsx       # Footer with student project credits
│       │   ├── Sidebar.jsx      # Dashboard sidebar navigation
│       │   ├── StudentCard.jsx  # Student directory card
│       │   ├── ProjectCard.jsx  # Project card with tech tags
│       │   ├── OpportunityCard.jsx # Team opportunity card
│       │   ├── SkillTag.jsx     # Interactive skill tag chip
│       │   ├── LoadingIndicator.jsx # Animated spinner
│       │   ├── EmptyState.jsx   # Friendly empty state
│       │   └── ErrorMessage.jsx # Alert banner
│       ├── context/
│       │   └── AuthContext.jsx  # Session state & authentication
│       ├── pages/
│       │   ├── HomePage.jsx     # Landing page
│       │   ├── LoginPage.jsx    # Login with quick-demo autofill
│       │   ├── RegisterPage.jsx # Student registration
│       │   ├── DashboardPage.jsx# Personal portfolio manager
│       │   ├── StudentDirectoryPage.jsx # Search & filters
│       │   ├── StudentProfilePage.jsx   # Public portfolio & CV
│       │   ├── ProjectListPage.jsx      # All projects browse
│       │   ├── ProjectDetailPage.jsx    # Single project details
│       │   ├── TeamFinderPage.jsx       # Collaboration board
│       │   └── OpportunityDetailPage.jsx# Opportunity view
│       ├── services/
│       │   └── api.js           # Reusable fetch client with credentials
│       ├── styles/
│       │   └── main.css         # Clean, responsive CSS design system
│       ├── App.jsx              # Routes & ProtectedRoute guard
│       └── main.jsx             # React entry point
│
├── server/                      # Express Backend & SQLite Database
│   ├── database/
│   │   ├── db.js                # SQLite connection & auto-table init
│   │   ├── schema.sql           # DDL table creation & indexes
│   │   ├── seed.js              # Auto-seeder with 5 demo students
│   │   └── reset.js             # npm run db:reset utility script
│   ├── middleware/
│   │   └── auth.js              # Session verification guard
│   ├── routes/
│   │   ├── auth.js              # Register, Login, Logout, /me
│   │   ├── students.js          # Directory, Public Profile, Profile PUT
│   │   ├── skills.js            # Add / Delete skills
│   │   ├── projects.js          # Project CRUD
│   │   └── opportunities.js     # Collaboration CRUD
│   └── server.js                # Express app entry & proxy target
│
├── vite.config.js               # Vite config with API proxy
├── package.json                 # Unified root dependencies & scripts
├── .gitignore                   # Excludes node_modules, .db files, etc.
└── README.md                    # Project documentation
```

---

## ⚡ 8. Available NPM Scripts

- `npm run dev` — Starts both the Express backend (`http://localhost:5001`) and Vite development server (`http://localhost:5173`) concurrently.
- `npm run build` — Compiles the React frontend into production-ready assets in `dist/`.
- `npm start` — Runs the Express server, which also serves the compiled production frontend.
- `npm run db:reset` — Deletes the SQLite database file (`skillnest.db`). The next time you start the server, fresh sample data will be re-seeded automatically.

---

## 🔮 9. Future Enhancements

- In-app messaging and notification center between students.
- Course / Faculty verification badges for capstone projects.
- PDF export generator for student academic resumes.
- GitHub API integration to auto-fetch public repositories and star counts.

---

## 📜 10. License
This project is open source and available under the **MIT License**. Created as a 7th-Semester Computer Science and Engineering university project.
