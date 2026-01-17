
# create_engine creates connection to database
# Session manages conversation with database (queries, commits, rollbacks)
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./applications.db"

# Create database engine
engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False}   # Needed for SQLite to allow multiple threads as FastAPI uses multithreading

)

# Dependency function to provide a database session
def get_session():
    
    # Create new session (database conversation)
    with Session(engine) as session:

        # Yield instead of return so Fast API can 1) use session during request 2) automatically close it after
        yield session