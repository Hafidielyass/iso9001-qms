from app import create_app, db
from app.models.user import Admin

app = create_app()

def init_db():
    with app.app_context():
        # Create all tables
        db.create_all()

        # Check if admin user already exists
        admin = Admin.query.filter_by(email='admin@example.com').first()
        if not admin:
            # Create admin user
            admin = Admin(
                email='admin@example.com',
                nom='Admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists!")

if __name__ == '__main__':
    init_db()
