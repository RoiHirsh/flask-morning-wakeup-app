import os

SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
SECRET_KEY = os.environ.get('SECRET_KEY')
SQLALCHEMY_TRACK_MODIFICATIONS = False

#change to this row below when deloying to production on Heroku:
#SQLALCHEMY_DATABASE_URL = os.environ.get('DATABASE_URL')