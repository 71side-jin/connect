from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from storage_config import settings


engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db() -> None:
    import storage_models  # noqa: F401

    Base.metadata.create_all(bind=engine)
