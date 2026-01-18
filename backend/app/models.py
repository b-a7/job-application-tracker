from typing import Optional
from datetime import date       # To store application dates
from sqlmodel import SQLModel   # Base class for SQLModel models
from sqlmodel import Field    # column configuration meaning we can set primary key, default values, etc

# Application model representing a job application
class Application(SQLModel, table=True):
    # table=True tells SQLModel to create a DB table from this class

    id: Optional[int] = Field(
        default=None,
        primary_key=True
    )
    # Primary key: None before DB insert, auto-generated after

    company: str
    # Company name (required)

    role: str
    # Job role/title (required)

    date_applied: date 
    # When the application was submitted

    status: str = Field(default="Applied")
    # Application state; default keeps logic simple early on



