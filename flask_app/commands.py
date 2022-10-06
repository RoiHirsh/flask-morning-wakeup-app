import click 
from flask.cli import with_appcontext

from .extensions import db
from .models import User

@click.command(name='create_tables') # creating a new custom cli command
@with_appcontext # giving the command context - i.e., access to the app's configuration for example to access the database of the app
def create_tables():
    db.create_all()