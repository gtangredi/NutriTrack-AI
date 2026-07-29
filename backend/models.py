from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=date.today)

    def __repr__(self):
        return f'<User {self.username}>'

class Meal(db.Model):
    __tablename__ = 'meals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    food_name = db.Column(db.String(200), nullable=False)
    calories = db.Column(db.Float)
    protein = db.Column(db.Float)
    carbs = db.Column(db.Float)
    fats = db.Column(db.Float)
    meal_date = db.Column(db.Date, default=date.today)

    user = db.relationship('User', backref=db.backref('meals', lazy=True))

    def __repr__(self):
        return f'<Meal {self.food_name} for User ID {self.user_id}>'

class Workout(db.Model):
    __tablename__ = 'workouts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    workout_type = db.Column(db.String(100), )
    duration = db.Column(db.Integer)
    calories_burned = db.Column(db.Float)
    workout_date = db.Column(db.Date, default=date.today)

    user = db.relationship('User', backref=db.backref('workouts', lazy=True))

    def __repr__(self):
        return f'<Workout {self.workout_type} for User ID {self.user_id}>'

class Weightlog(db.Model):
    __tablename__ = 'weightlogs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    log_date = db.Column(db.Date, default=date.today)

    user = db.relationship('User', backref=db.backref('weightlogs', lazy=True))

    def __repr__(self):
        return f'<Weightlog {self.weight} for User ID {self.user_id}>'