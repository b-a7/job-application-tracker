# Job Application Tracker

A full stack web application for tracking job applications, built with a FastAPI backend and a React + Tailwind frontend.

The goal of this project is to provide a clean, SIMPLE dashboard to manage job applications while demonstrating practical full stack dev, authentication, and UI structuring.

Project Inspiration: While searching for jobs I could not find an easy to use application tracker that was FREE, so decided to make my own.

---

## Features

- User authentication (login/logout)
- Create, update, and delete job applications
- Track application status (Applied, Interview, Offer, Rejected, No Response)
- Summary metrics dashboard
- Clean, responsive dark UI
- Persistent login via token storage

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript (ES6+)

### Backend
- FastAPI
- SQLite
- SQLModel
- JWT-based authentication

## Design Decisions
- UI logic is split into reusable components (SummaryMetrics, ApplicationsTable, AddApplicationForm)
- App.jsx acts as the data and API orchestration layer
- Styling is handled with Tailwind CSS for rapid iteration
- Backend uses SQLModel for clean data modelling

## Future improvements and Next Steps
- Add filtering and sorting to applications table
- Deployment configuration (Docker / cloud hosting)
