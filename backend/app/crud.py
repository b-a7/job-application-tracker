# File for database logic including inserting and fetching applications from database

from sqlmodel import Session
from sqlmodel import select

from .models import Application
from .schemas import ApplicationCreate

# Function to create a new application record in the database
def create_application(session: Session, application: ApplicationCreate) -> Application:

    # Convert API input schema into DB model
    db_application = Application.model_validate(application, from_attributes=True)

    # Add new application to the session
    session.add(db_application)

    # Commit transaction to save data to DB
    session.commit()

    # Pull data from database into object instance with latest values 
    session.refresh(db_application)

    return db_application

# Function to retrieve all application records from database
def get_applications(session: Session) -> list[Application]:

    # Builds query object that selects all Application rows
    statement = select(Application)

    # Execute query and return results as list 
    # session knows which DB to query
    # exec() runs query
    # .all converts to list
    return session.exec(statement).all()

# Function to get summary statistics of applications by status
def get_application_summary(session: Session) -> dict:

    applications = get_applications(session)

    # Initialise summary dictionary
    summary = {
        "total": len(applications),
        "applied": 0,
        "interview": 0,
        "offer": 0,
        "rejected": 0,
        "no response": 0,
    }

    # Count applications by status
    for app in applications:
        status = app.status.lower()
        if status in summary:
            summary[status] += 1
    
    return summary 