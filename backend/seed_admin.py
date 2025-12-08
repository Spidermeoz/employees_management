from app.database import SessionLocal
from app.models.users import User
from app.utils.password import hash_password


def seed_admin():
    db = SessionLocal()
    try:
        # Nếu đã có admin rồi thì thôi
        existed = db.query(User).filter(User.email == "admin@example.com").first()
        if existed:
            print("Admin đã tồn tại, bỏ qua.")
            return

        admin = User(
            full_name="Administrator",
            email="admin@example.com",
            password_hash=hash_password("123456"),
            role="admin",
            status="active",
            deleted=False,
        )
        db.add(admin)
        db.commit()
        print("Tạo admin thành công: admin@example.com / 123456")
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()
