from app.database import get_session
from app.models import User

# One-time script to create a test user
with next(get_session()) as session:
    user = User(username="bill", password="1234")
    session.add(user)
    session.commit()

print("Test user created")