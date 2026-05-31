import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


@dataclass(frozen=True)
class Settings:
    database_url: str
    secret_key: str
    access_token_expire_minutes: int
    storage_root: Path
    gateway_host: str
    gateway_port: int
    inference_origin: str


def _required(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"{name} is required. Copy .env.example to .env and fill it in.")
    return value


settings = Settings(
    database_url=_required("DATABASE_URL"),
    secret_key=os.environ.get("SECRET_KEY", "change-this-secret-key"),
    access_token_expire_minutes=int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "60")),
    storage_root=(BASE_DIR / os.environ.get("STORAGE_ROOT", "storage")).resolve(),
    gateway_host=os.environ.get("GATEWAY_HOST", "127.0.0.1"),
    gateway_port=int(os.environ.get("GATEWAY_PORT", "8787")),
    inference_origin=os.environ.get("INFERENCE_ORIGIN", "http://127.0.0.1:8001").rstrip("/"),
)
