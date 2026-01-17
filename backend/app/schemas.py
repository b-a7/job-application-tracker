from datetime import date
from typing import Optional
from pydantic import ConfigDict
from sqlmodel import SQLModel
from pydantic import ConfigDict

# Defines common fields
class ApplicationBase(SQLModel):
    
    # Shared fields across multiple schemas
    company: str
    role: str
    date_applied: date
    status: str = "Applied"

# Used when client sends data for new application (no id)
class ApplicationCreate(ApplicationBase):
    
    # Schema for incoming POST requests to create new applications
    # Inherits fields from ApplicationBase
    pass

# Used when API returns application data (with id, safe to expose, matches frontend expectations)
class ApplicationRead(ApplicationBase):
    # Schema for outgoing responses
    id: int

    # Includes DB-generated ID so clients can reference records
    model_config = ConfigDict(from_attributes=True)