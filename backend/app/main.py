from fastapi import FastAPI
from fastapi import Depends
from sqlmodel import SQLModel
from sqlmodel import Session

from .database import engine, get_session
from .schemas import ApplicationCreate, ApplicationRead
from .crud import create_application, get_applications

# Creating instance of FastAPI application as 'app'
app = FastAPI()

@app.on_event("startup")
def on_startup():

    # Creates database tables for all SQLModel classes (e.g. Application)
    # all factors ALL models inheriting from SQLModel
    SQLModel.metadata.create_all(engine)

# @app.get("/")
# def health_check():
#     return {"status": "ok"}

# When post req made, create new application
@app.post("/applications", response_model=ApplicationRead)
def create_application_endpoint(
    application: ApplicationCreate,
    session: Session = Depends(get_session),    # before running, give DB session
):
    # Create a new job application record in DB
    return create_application(session, application)

# Get all applications from DB
@app.get("/applications", response_model=list[ApplicationRead])
def list_applications_endpoint(
    session: Session = Depends(get_session),
):
    # Return all stored job applications
    return get_applications(session)


