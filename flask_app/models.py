from flask_login import UserMixin
from .extensions import db
from werkzeug.security import generate_password_hash

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    admin = db.Column(db.Boolean)

    @property
    def unhashed_password(self):
        raise AttributeError('Cannot view unhashed password')
    
    @unhashed_password.setter
    def unhashed_password(self, unhashed_password):
        self.password = generate_password_hash(unhashed_password)

class Inputs(db.Model):
    dt = db.Column(db.DateTime, primary_key=True)
    defaultContent = db.Column(db.Boolean)
    introMessage = db.Column(db.String(100))
    awake_message = db.Column(db.String(100))
    dadMessage = db.Column(db.String(100))
    momMessage = db.Column(db.String(100))
    youtubeId = db.Column(db.String(20))

class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dt = db.Column(db.DateTime, nullable=True)
    weekday = db.Column(db.String(10), nullable=True)
    time = db.Column(db.String(6), nullable=False)
    task = db.Column(db.String(20), nullable=False)
