# Contact Manager

A simple Node.js + Express app for collecting and managing contact form submissions. Built using EJS, MongoDB, and a minimal frontend.

## 🚀 Features

- Contact form with name and email submission
- MongoDB storage via Mongoose
- RESTful route structure
- Dockerized local development environment
- Mongo Express for quick database viewing
- EJS templating engine
- Backend validation using `express-validator`
- Global error handling middleware
- Early-stage testing with `jest` and `supertest`

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
node app.js
```

## 🙌 Credits
Built by @m-godyn as a learning and portfolio project with backend-first principles.
