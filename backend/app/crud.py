# File for database logic including inserting and fetching applications from database + authentication

from sqlmodel import Session
from sqlmodel import select

from .models import Application, User
from .schemas import ApplicationCreate, ApplicationUpdate, LoginRequest

# Function to create a new application record in the database
def create_application(session: Session, application: ApplicationCreate, user: User) -> Application:

    # Convert API input schema into DB model
    # db_application = Application.model_validate(application, from_attributes=True)
    # db_application = Application(**application.model_dump())

    data = application.model_dump()
    data["user_id"] = user.id   # ← THIS LINE IS THE FIX

    db_application = Application(**data)

    # Add new application to the session
    session.add(db_application)

    # Commit transaction to save data to DB
    session.commit()

    # Pull data from database into object instance with latest values 
    session.refresh(db_application)

    return db_application

# Function to retrieve all application records from database
def get_applications(session: Session, user: User) -> list[Application]:

    # Builds query object that selects all Application rows
    # statement = select(Application)

    # Modified to filter applications by user_id
    statement = select(Application).where(Application.user_id == user.id)

    # Execute query and return results as list 
    # session knows which DB to query
    # exec() runs query
    # .all converts to list
    return session.exec(statement).all()

# Function to get summary statistics of applications by status
def get_application_summary(session: Session, user: User) -> dict:

    applications = get_applications(session, user)

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

# Update application fields based on provided data
def update_application(session: Session, application: Application, update_data: ApplicationUpdate): 
    if update_data.status is not None:
        application.status = update_data.status

    session.add(application)
    session.commit()
    session.refresh(application)

    return application

# Verifying user credentials against DB records, return User object if authentication success
def authenticate_user(session: Session, login: LoginRequest):
    
    # Query to find user with given username
    statement = select(User).where(User.username == login.username)

    # Execute query and THEN return first matching result (or none)
    user = session.exec(statement).first()

    if not user:
        return None
    
    if user.password != login.password:
        return None
    
    return user

def delete_application(session: Session, application: Application):
    session.delete(application)
    session.commit()
    