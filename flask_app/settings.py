import os

SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL?sslmode=require').replace('postgres://', 'postgresql://')
SECRET_KEY = os.environ.get('SECRET_KEY')
SQLALCHEMY_TRACK_MODIFICATIONS = False

#save
#SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

#change to this row below when deloying to production on Heroku:
#SQLALCHEMY_DATABASE_URL = os.environ.get('DATABASE_URL')
#and this is for development:
#SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')