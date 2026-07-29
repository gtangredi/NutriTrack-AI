import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Meal, Workout, Weightlog

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
CORS(app)

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200




if __name__ == '__main__':
    app.run(debug=True, port=5000)