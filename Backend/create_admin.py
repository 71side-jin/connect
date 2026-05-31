from storage_db import SessionLocal, init_db
from storage_models import AdminUser
from storage_security import hash_password


def main() -> None:
    init_db()
    db = SessionLocal()

    try:
        username = input("Admin username: ").strip()
        password = input("Admin password: ").strip()

        if not username or not password:
            print("Username and password are required.")
            return

        existing_admin = db.query(AdminUser).filter(AdminUser.username == username).first()
        if existing_admin:
            print("Admin already exists.")
            return

        admin = AdminUser(
            username=username,
            password_hash=hash_password(password),
            is_active=True,
        )
        db.add(admin)
        db.commit()
        print("Admin created successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
