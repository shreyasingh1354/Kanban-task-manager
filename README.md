# Kanban Task Manager

A Kanban-style task management platform that enables teams to efficiently create, assign, track, and manage tasks using React.js, Node.js/Express.js, and PostgreSQL.

![Kanban Board](https://github.com/pharth/Kanban-task-manager/blob/main/Diagrams/ActivityDiagram.png)

## 🚀 Features

- **Kanban Board Interface**: Visual management of tasks across different stages (To Do, In Progress, Done)
- **Role-Based Access Control**: Different privileges for Administrators, Team Leaders, and Team Members
- **Task Management**: Create, assign, update, and track tasks with deadlines and priorities
- **Team Collaboration**: Comment on tasks and share updates in real-time
- **Reporting**: Generate performance and progress reports for teams and individuals
- **Responsive Design**: Access the system from various devices through a responsive interface

## 🛠️ Tech Stack

### Frontend
- **React.js** - JavaScript library for building user interfaces
- **Material-UI** - React component library implementing Google's Material Design
- **Axios** - Promise-based HTTP client for making API calls

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web application framework for Node.js
- **JWT** - JSON Web Token for secure authentication

### Database
- **PostgreSQL** - Open-source relational database system

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- PostgreSQL (v13.x or higher)

## ⚙️ Installation & Setup

### Clone the Repository
```bash
git clone https://github.com/pharth/Kanban-task-manager.git
cd Kanban-task-manager
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Create a .env file with the following variables:
# PORT=8000
# DATABASE_URL=postgresql://username:password@localhost:5432/taskmanager
# JWT_SECRET=your_jwt_secret_key

# Start the server
node server.js
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Create a .env file with the following variables:
# REACT_APP_API_URL=http://localhost:3000/api

# Start the development server
npm start
```

## 📊 System Architecture

### Component Diagram
![Component Diagram](https://github.com/pharth/Kanban-task-manager/blob/main/Diagrams/ComponentDiagram.png)

### Deployment Diagram
![Deployment Diagram](https://github.com/pharth/Kanban-task-manager/blob/main/Diagrams/DeploymentDiagram.png)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Team Members

- [Parth Hanchate](https://github.com/pharth)
- [Shreya Singh](https://github.com/shreyasingh1354)
