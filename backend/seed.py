from dotenv import load_dotenv
load_dotenv()

from werkzeug.security import generate_password_hash
from app import app
from models import db, User

with app.app_context():
    # clear existing data
    db.drop_all()
    db.create_all()

    # create a new user
    new_user = User(
        username='testuser',
        email='testuser@example.com',
        password_hash=generate_password_hash('testpassword')
    )
    db.session.add(new_user)
    db.session.commit()
    print(f'Created user: {new_user.username} with email: {new_user.email}')