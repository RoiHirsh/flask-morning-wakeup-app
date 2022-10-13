from flask import Blueprint, render_template, request, redirect, url_for
from flask_app.extensions import db
from flask_app.models import User
from flask_login import login_required, login_user, logout_user
from werkzeug.security import check_password_hash

auth = Blueprint('auth', __name__)

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@auth.route('/login', methods=['POST','GET'])
def login():
    error=''
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(name=username).first()
        if not user or not check_password_hash(user.password, password):
            error = 'אחד הפרטים שהזנתם שגוי'
        if not error:
            login_user(user)
            return redirect(url_for('main.home'))

    return render_template('/login.html', error=error)

@auth.route('/register', methods=['POST','GET'])
def register():
    error = ''
    if request.method == 'POST':
        username = request.form.get('username')
        unhashed_password = request.form.get('password')
        check_name = User.query.filter_by(name=username).first()
        if check_name == None:
            logout_user()
            user = User(name=username, unhashed_password=unhashed_password, admin=False)
            db.session.add(user)
            db.session.commit()
            return redirect(url_for('auth.login'))
        else:
            error = 'שם המשתמש שבחרתם תפוס'

    return render_template('/register.html', error=error)