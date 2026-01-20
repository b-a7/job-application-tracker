from fastapi import FastAPI, Depends, HTTPException, Header, Request
from sqlmodel import SQLModel, Session, select
from typing import Optional


from .database import engine, get_session
from .schemas import (
    ApplicationCreate,
    ApplicationRead,
    ApplicationUpdate,
    LoginRequest,
    LoginResponse,
    UserCreate,
)
from .crud import (
    create_application,
    get_applications,
    get_application_summary,
    update_application,
    authenticate_user,
    delete_application,
)
from .models import Application, User

from fastapi.middleware.cors import CORSMiddleware

# Creating instance of FastAPI application as 'app'
app = FastAPI()

# --- Authentication dependency ---
def get_current_user(
        # request: Request,
        authorization: Optional[str] = Header(None, alias="Authorization"),
        session: Session = Depends(get_session),
):
    # if request.method == "OPTIONS":
    #     return None
    
    if authorization is None:
        raise HTTPException(status_code=401, detail="Authorisation header missing")
    
    # Expect "Bearer <token>"
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError
    except ValueError:
        raise HTTPException(
            status_code=401, detail="Invalid Authorisation header format"
        )
    statement = select(User).where(User.token == token)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return user

# Configure CORS middleware to allow requests from frontend during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    current_user: User = Depends(get_current_user),   # before running, check user auth
    session: Session = Depends(get_session),    # before running, give DB session
):
    # Create a new job application record in DB
    return create_application(session, application, current_user)

# Get all applications from DB
@app.get("/applications", response_model=list[ApplicationRead])
def list_applications_endpoint(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # Return all stored job applications
    return get_applications(session, current_user)

@app.get("/analytics/summary")
def application_summary(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # Return high-level application statistics
    return get_application_summary(session, current_user)

# Patch endpoint to update existing application
@app.patch("/applications/{application_id}", response_model=ApplicationRead)
def update_application_endpoint(
    application_id: int,    
    update: ApplicationUpdate, 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # Fetch existing application from DB by ID
    application = session.get(Application, application_id)

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Ownership check to prevent patches through devtools
    if application.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised to update this application")

    # Apply updates and save changes using CRUD logic, keeping DB logic out of route handler
    return update_application(session, application, update)

@app.delete("/applications/{application_id}")
def delete_applicaton_endpoint(
    application_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    application = session.get(Application, application_id)

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorised to delete this application")
    
    delete_application(session, application)

    return {"detail": "Application deleted."}

@app.post("/login", response_model=LoginResponse)
def login(
    credentials: LoginRequest,
    session: Session = Depends(get_session),
):
    # Authenticate user and return user info if successful
    # Accepts username and password, returns user id, username, token if valid

    user = authenticate_user(session, credentials)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Return user object on success
    return user

@app.post("/signup")
def signup(
    user_data: UserCreate,
    session: Session = Depends(get_session),
):
    # Check if username already exists
    existing = session.exec(
        select(User).where(User.username == user_data.username)
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    user = User(
        username = user_data.username,
        password = user_data.password,
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return user