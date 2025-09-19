
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from routes import router
from dependencies import get_db
from database import create_tables

create_tables()

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)
app.include_router(router)