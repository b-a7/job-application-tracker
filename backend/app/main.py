from fastapi import FastAPI
from sqlmodel import SQLModel

from .database import engine

# Creating instance of FastAPI application as 'app'
app = FastAPI()

@app.on_event("startup")
def on_startup():

    # Creates database tables for all SQLModel classes (e.g. Application)
    # all factors ALL models inheriting from SQLModel
    SQLModel.metadata.create_all(engine)

@app.get("/")
def health_check():
    return {"status": "ok"}

