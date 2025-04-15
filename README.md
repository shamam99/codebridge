```markdown
# 🧠 Code Bridge — Backend

> A scalable backend service that powers the Code Bridge platform — enabling real-time code translation, debugging, authentication, community interaction, and admin control.

This repository contains the **Node.js + Express backend** of the Code Bridge platform. It supports:
- Secure RESTful APIs for users, code translation, execution, projects, and community
- JWT-based authentication and admin role control
- MongoDB integration for all data models
- Clean modular folder structure with controllers, routes, services, and middleware

---

## 🚀 Tech Stack

- 🟢 **Node.js + Express** — Server runtime and API routing
- 🧰 **MongoDB + Mongoose** — Database and schema models
- 🔐 **JWT (JSON Web Token)** — Secure user session management
- 🔄 **Bcrypt** — Password hashing
- 📁 **Multer** — File uploads (e.g., project zip files)
- 🧠 **Regex + TF-IDF (planned)** — Code translation support (basic rule-based ML)
- 📦 **dotenv, cors, helmet** — Environment and security layers

---

## 📂 Folder Structure

```
codebridge/
├── config/             # DB connection, dotenv
├── controllers/        # Logic for all entities (auth, users, admin, etc.)
├── middleware/         # Auth and role-based access
├── models/             # Mongoose schemas (User, Project, Post, etc.)
├── routes/             # All API endpoints
├── utils/              # Code translation logic (regex-based or ML-based)
├── uploads/            # Uploaded zip files
├── app.js              # Main Express app
└── server.js           # Entry point
```

---

## 📌 Main Features

### 👤 User Management
- Register/Login with JWT
- Google login support (via Google ID)
- Secure password encryption
- Profile editing (bio, image, links)
- Follow/Unfollow functionality
- Project uploads (public/private + zip)

### 🧠 Code Translation + Execution
- Translate code between **Python ↔ JavaScript**
- Save and manage code snippets
- Simulate "Run" and "Debug" with backend logic
- (Planned) upgrade to ML-based translation (TF-IDF)

### 📢 Community System
- Create/edit/delete **Posts**
- Add/delete **Comments**
- Follow-based feed
- Flag posts for moderation

### 🧑‍💼 Admin Dashboard
- Login as admin (via `/api/admin/login`)
- Manage all users (view/delete/block)
- Moderate posts and comments
- Publish programming-related news

---

## 🔑 Authentication Flow

- **JWT-based** auth with access control middleware
- `protect` middleware for private routes
- `admin` middleware for admin-only routes
- Tokens stored in `localStorage` on frontend

---

## 🔐 API Structure

### Public Routes
```
POST    /api/auth/register
POST    /api/auth/login
GET     /api/translate/languages
```

### Protected User Routes
```
GET     /api/users/profile
PUT     /api/users/profile
POST    /api/users/:id/follow
POST    /api/users/:id/unfollow
```

### Projects
```
POST    /api/projects
GET     /api/projects/users/:id/projects
```

### Code Pages
```
GET     /api/code/pages
POST    /api/code/pages
DELETE  /api/code/pages/:id
```

### Translation + Execution
```
POST    /api/translate
POST    /api/translate/run
POST    /api/translate/debug
GET     /api/translate/history
```

### Community (Posts + Comments)
```
GET     /api/posts
POST    /api/posts
DELETE  /api/posts/:id
GET     /api/comments/post/:postId
POST    /api/comments
DELETE  /api/comments/:id
```

### News
```
GET     /api/news
POST    /api/news (admin only)
DELETE  /api/news/:id (admin only)
```

### Admin
```
POST    /api/admin/login
POST    /api/admin/create
GET     /api/admin/users
DELETE  /api/admin/users/:id
```

---

## 🔧 Setup & Run Locally

### Prerequisites

- Node.js (v18+)
- MongoDB (local or cloud)
- Postman (for API testing)

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/codebridge.git
cd codebridge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env` File
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/codebridge
JWT_SECRET=your_jwt_secret_key
```

### 4. Start Server
```bash
npm run dev
```

---

## 🧪 Testing Notes

- Use Postman to test routes (available collection included)
- Test authentication and authorization for users/admins
- Upload `.zip` files for project testing
- Try triggering all CRUD routes and check MongoDB collections:
  - `users`, `posts`, `projects`, `comments`, `news`, `codepages`, `translations`

---

## 🧠 Planned Enhancements

- ✅ ML upgrade for translation using TF-IDF (Phase 2)
- ✅ Admin post moderation tools
- 🌐 Add pagination and search to all lists
- 🧪 Add unit tests with Jest or Mocha
- 📊 Admin analytics dashboard

---

## 📌 Related Repositories

- [Code Bridge Frontend](https://github.com/yourusername/codebridgefront)

---

## 📄 License

Distributed under the MIT License.  
See `LICENSE` for more information.

---

> Developed by Shamam Alkafri — Apple Developer Academy 2025  
> Special thanks to the mentors and the community contributors.

```
