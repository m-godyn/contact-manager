# Contact Manager

A simple Node.js + Express app for collecting and managing contact form submissions. Built using EJS, MongoDB, and a minimal frontend with Bootstrap.

Built a learning project with backend-first principles.


## 🚀 Features

- 📬 Contact Form – with backend validation and error handling
- 🧰 Admin Panel – for managing contacts and secured access for admins
- 🔐 Authentication – secure login with password hashing (bcrypt) and session management
- ✅ Validation – robust user input checks with express-validator
- 🧪 Test-Ready – foundation for unit and integration tests using Jest
- 🧹 Error Handling – custom middleware for catching and formatting server-side errors
- 🚫 Route Protection – middleware to guard admin routes
- 🌓 Theme Toggle – light/dark theme support with persistent user preferences
- 🌍 Internationalization (i18n) – planned support for English, Polish, Danish, and German

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) for MongoDB
- Git

### Clone and Install

```bash
git clone https://github.com/m-godyn/contact-manager.git
cd contact-manager
npm install
```

### Environment Variables

Create a .env file in the project root with the following content:

```env
MONGO_URI=mongodb://localhost:27017/contact-manager
PORT=3000
SESSION_SECRET={secret you want}
INITIAL_ADMIN_USERNAME={username you want}
INITIAL_ADMIN_PASSWORD={password you want}
```
> You can change the database name (`contact-manager`) if desired.

### Start MongoDB Locally

Make sure Docker Desktop is running, then use:

```bash
docker-compose up -d
```
> MongoDB and Mongo Express will be accessible. Mongo Express runs on http://localhost:8081

To stop the containers manually:

```bash
docker-compose down
```

### Start the App

```bash
npm run dev
```
> App should be running at http://localhost:3000

## 🧪 Running Tests

```bash
npm test
```
