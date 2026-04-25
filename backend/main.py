from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routes import game, patch, build

app = FastAPI(title="LoL Build Advisor", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(game.router, prefix="/api/game", tags=["game"])
app.include_router(patch.router, prefix="/api/patch", tags=["patch"])
app.include_router(build.router, prefix="/api/build", tags=["build"])


@app.get("/")
def root():
    return {"message": "LoL Build Advisor API rodando", "status": "ok"}
