from typing import Optional
from datetime import date       # To store application dates
from sqlmodel import SQLModel   # Base class for SQLModel models
from sqlmodel import Field    # column configuration meaning we can set primary key, default values, etc
import uuid

# Application model representing a job application
class Application(SQLModel, table=True):
    # table=True tells SQLModel to create a DB table from this class
    # Primary key: None before DB insert, auto-generated after
    id: Optional[int] = Field(
        default=None,
        primary_key=True
    )

    # Company name (required)
    company: str

    # Job role/title (required)
    role: str

    # When the application was submitted
    date_applied: date 

    # Application state; default keeps logic simple early on
    status: str = Field(default="Applied")

    # Foreign key to link application to a user (data to user link)
    user_id: int = Field(foreign_key="user.id")  

# User model representing a user account
class User(SQLModel, table=True):
    id: Optional[int] = Field(
        default=None, 
        primary_key=True
    )

    username: str = Field(
        index=True,     # creates index for fast lookup
        unique=True     # usernames must be unique
    )

    # Initially string for dev but conversion to HASH needed for safety in reality
    password: str 

    # Auto gen a random token string when new user is created
    token: str = Field(
        default_factory=lambda: str(uuid.uuid4())
    )
