import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash
from models import db, User, Meal, Workout, Weightlog

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
CORS(app)

db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({'access_token': access_token, "username": user.username}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/weight', methods=['GET', 'POST'])
@jwt_required()
def weight_log():
    user_id = get_jwt_identity()
    if request.method == 'POST':
        data = request.get_json()
        weight = data.get('weight')
        
        new_weightlog = Weightlog(user_id=user_id, weight=weight)
        db.session.add(new_weightlog)
        db.session.commit()
        return jsonify({
            'id': new_weightlog.id, 
            'weight': new_weightlog.weight, 
            'date': new_weightlog.log_date.isoformat()
        }), 201

    logs = Weightlog.query.filter_by(user_id=user_id).order_by(Weightlog.log_date.desc()).all()
    return jsonify([{
        'id': w.id,
        'weight': w.weight,
        'date': w.log_date.isoformat()
    } for w in logs]), 200

@app.route('/api/workouts', methods=['GET', 'POST'])
@jwt_required()
def workouts():
    user_id = get_jwt_identity()
    if request.method == 'POST':
        data = request.get_json()
        workout_type = data.get('workout_type')
        duration = data.get('duration')
        calories_burned = data.get('calories_burned')
        new_workout = Workout(
            user_id=user_id,
            workout_type=workout_type,
            duration=duration,
            calories_burned=calories_burned
        )
        db.session.add(new_workout)
        db.session.commit()
        return jsonify({
            'id': new_workout.id,
            'workout_type': new_workout.workout_type,
            'duration': new_workout.duration,
            'calories_burned': new_workout.calories_burned,
            'date': new_workout.workout_date.isoformat()
        }), 201

    workouts = Workout.query.filter_by(user_id=user_id).order_by(Workout.workout_date.desc()).all()
    return jsonify([{
        'id': w.id,
        'workout_type': w.workout_type,
        'duration': w.duration,
        'calories_burned': w.calories_burned,
        'date': w.workout_date.isoformat()
    } for w in workouts]), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)

