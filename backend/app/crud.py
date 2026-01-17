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

