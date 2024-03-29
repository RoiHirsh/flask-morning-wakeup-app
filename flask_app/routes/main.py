from flask import Blueprint, render_template, request, redirect, url_for
from flask_login import current_user, login_required
from flask_app.extensions import db
from flask_app.models import Inputs, Schedule
import json
from datetime import datetime

main = Blueprint('main',__name__)

# these are the steps the app walk the user through. each step should be included in this dictionary
today = datetime.today().replace(hour=0, minute=0, second=0, microsecond=0)

@main.route('/')
@login_required
def home():
    def locate_input(template):
        response = 'אין נתונים'
        the_daily_inputs = Inputs.query.filter_by(dt=today).first()
        the_default_inputs = Inputs.query.filter_by(defaultContent=True).first()
        if the_daily_inputs == None:
            if the_default_inputs != None:
                response = getattr(the_default_inputs, template)
        else:
            if getattr(the_daily_inputs, template) == '':
                response = getattr(the_default_inputs, template)
            else: 
                response = getattr(the_daily_inputs, template) 
        if template == 'youtubeId':
            response = 'https://www.youtube.com/embed/'+response+'?'
        return response
              
    template_requested = request.args.get('name') # fetching the name of the template requested

    if template_requested == 'awake':
        template_requested = template_requested + '_message'
    if template_requested == 'morningSong':
        template_requested = 'youtubeId'

    if template_requested in ['awake_message','dadMessage','momMessage','youtubeId']:
        return locate_input(template_requested)

    if template_requested == 'whatToDo':
        whatToDo = [['00:00','לא הוזנו נתונים'],['00:00','לא הוזנו נתונים']]
        the_schedule = Schedule.query.filter_by(dt=today).all()
        if the_schedule != []:
            whatToDo = []
            for i in range(len(the_schedule)):
                task_list = [the_schedule[i].time,the_schedule[i].task]
                whatToDo.append(task_list)
        json_str = json.dumps(whatToDo, ensure_ascii=False)
        return json_str

    if template_requested != None:
        return ('', 204)

    introMessage = locate_input('introMessage')
    return render_template('home.html', introMessage=introMessage)

@main.route('/dashboard', methods=['POST','GET'])
@login_required
def dashboard():
    if current_user.admin == False:
        return redirect(url_for('auth.login'))
    if request.method == 'POST':
        if 'tasks_to_update' in request.form.to_dict(): # checking if the POST concerns the daily schedule form and not the general app inputs form
            date_input = request.form.get('dts')
            format = '%Y-%m-%d'
            dt = datetime.strptime(date_input, format)
            schedule_hours = request.form.getlist('hour') # fetching all task hour instances inside a list (e.g. '08:00','12:30')
            schedule_tasks = request.form.getlist('task_for_hour') # fetching all tasks instances inside a list ('school starts','school ends')
            # checking if there is already content stored on the database for this selected date
            check_date = Schedule.query.filter_by(dt=dt).first()
            if check_date != None:
                Schedule.query.filter_by(dt=dt).delete()
            for i in range(len(schedule_hours)):
                schedule = Schedule(dt=dt,time=schedule_hours[i],task=schedule_tasks[i])
                db.session.add(schedule)
            db.session.commit()
            thanks_schedule = 'מקווים שהנתונים הועלו לדאטהבייס'
            return render_template('dashboard.html', thanks_schedule=thanks_schedule)
        else:
            date_input = request.form.get('dt')
            format = '%Y-%m-%d'
            dt = datetime.strptime(date_input, format)
            defaultContent = False
            introMessage = request.form.get('introMessage')
            awake_message = request.form.get('awake_message')
            dadMessage = request.form.get('dadMessage')
            momMessage = request.form.get('momMessage')
            youtubeId = request.form.get('youtubeId')
            # checking if there is already content stored on the database for this selected date
            check_date = Inputs.query.filter_by(dt=dt).first()
            if check_date == None:
                inputs = Inputs(dt=dt, defaultContent=defaultContent, introMessage=introMessage, awake_message=awake_message, dadMessage=dadMessage, momMessage=momMessage, youtubeId=youtubeId)
                db.session.add(inputs)
                db.session.commit()
                thanks = 'מקווים שהנתונים הועלו לדאטהבייס'
            else:
                all_form_fields = request.form.to_dict()
                no_empty_fields = {k: v for k, v in all_form_fields.items() if v}
                for k,v in no_empty_fields.items():
                    if k != 'dt':
                        if k == 'introMessage':
                            check_date.introMessage = v
                        if k == 'awake_message':
                            check_date.awake_message = v
                        if k == 'dadMessage':
                            check_date.dadMessage = v
                        if k == 'momMessage':
                            check_date.momMessage = v
                        if k == 'youtubeId':
                            check_date.youtubeId = v
                db.session.commit()
                thanks = 'מקווים שהנתונים המעודכנים הועלו לדאטהבייס'
                
            return render_template('dashboard.html', thanks=thanks)
    else:
        if request.args.get('name') == 'schedule': # this is a request to fetch the default daily schedule of a selected day
            date = request.args.get('date')
            format = '%Y-%m-%d'
            dt = datetime.strptime(date, format)
            check_date = Schedule.query.filter_by(dt=dt).first()
            if check_date != None:
                x = Schedule.query.filter_by(dt=dt).all()
            else:
                day_requested = request.args.get('day')
                x = Schedule.query.filter_by(weekday=day_requested).all()
            json_str = []
            for i in range(len(x)):
                task_list = [x[i].time,x[i].task]
                json_str.append(task_list)
            json_str = json.dumps(json_str, ensure_ascii=False)
            return json_str
        
    return render_template('dashboard.html') # this is the default dashboard full page layout