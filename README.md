# Internship Application Tracker

A full-stack web application for tracking internship applications throughout the recruiting process.

The application allows users to add, search, filter, update, and delete internship applications while keeping track of application status, dates, locations, job links, and notes.

## Features

- Add new internship applications
- Edit existing applications
- Delete applications
- Update application status directly from the table
- Track application stages:
  - Saved
  - Applied
  - OA
  - Interview
  - Offer
  - Rejected
- Search applications by company or position
- Filter applications by status
- Dashboard showing application statistics
- Track:
  - Company
  - Position
  - Location
  - Date applied
  - Job posting link
  - Status
  - Notes
- Responsive React interface
- Persistent storage using MongoDB Atlas

## Tech Stack

### Frontend

- React
- JavaScript
- HTML
- CSS
- Vite

### Backend

- Node.js
- Express.js
- REST API
- Mongoose

### Database

- MongoDB
- MongoDB Atlas

## Architecture

```text
React Frontend
      |
      | HTTP / JSON
      v
Express REST API
      |
      v
Mongoose
      |
      v
MongoDB Atlas
```

The React frontend communicates with the Express backend through REST API requests. Express uses Mongoose to interact with MongoDB Atlas.

## REST API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications` | Get all applications |
| POST | `/api/applications` | Create a new application |
| PUT | `/api/applications/:id` | Update an application |
| DELETE | `/api/applications/:id` | Delete an application |

## Application Data

Each internship application can contain:

```text
Company
Position
Location
Job Link
Date Applied
Status
Notes
```

Example:

```json
{
  "company": "Microsoft",
  "position": "Software Engineer Intern",
  "location": "Redmond, WA",
  "jobLink": "https://example.com/job",
  "dateApplied": "2026-09-16",
  "status": "Applied",
  "notes": "Applied through company careers page"
}
```

## Project Structure

```text
internship-application-tracker/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── models/
│   └── Application.js
│
├── app.js
├── server.js
├── package.json
├── .env
└── README.md
```

## Running the Project Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd internship-application-tracker
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

Do not commit the `.env` file to GitHub.

### 4. Start the backend

```bash
node server.js
```

The backend will run at:

```text
http://localhost:3000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Start the React frontend

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

## CRUD Operations

The project implements full CRUD functionality:

```text
Create  → Add a new internship application
Read    → View stored applications
Update  → Edit application information or status
Delete  → Remove an application
```

## React Functionality

The frontend uses React state to manage:

- Application data
- Form inputs
- Editing
- Search
- Status filtering
- Dashboard statistics

Changes made through the interface are sent to the Express API and persisted in MongoDB.

## Future Improvements

- User authentication
- Sort applications by date or company
- Application deadlines
- Interview dates
- Follow-up reminders
- Improved mobile layout
- Deployment of the React frontend and API
- Additional analytics and recruiting statistics

## Purpose

This project was built to practice full-stack software development and create a practical tool for managing internship applications.

It demonstrates experience with React frontend development, REST API design, Node.js and Express backend development, MongoDB persistence, CRUD operations, and integration between frontend and backend services.