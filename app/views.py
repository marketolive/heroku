from app import app, api, mktorest, models, lm, db
from flask_restful import Resource, reqparse
from flask.ext.login import login_user, logout_user, current_user, login_required
from flask import render_template, flash, request, redirect, g
from .forms import LoginForm
import os
from datetime import datetime

# Init rest client on import
# setvars.py should be maintained locally containing restcreds dictionary
try:
	from app import setvars
	restClient = mktorest.MarketoWrapper(setvars.restcreds['munchkin_id'], 
										 setvars.restcreds['client_id'], 
										 setvars.restcreds['client_secret'])
	apiKey = setvars.apiKey
except ImportError:
	restClient = mktorest.MarketoWrapper(os.environ['munchkin_id'], os.environ['client_id'], os.environ['client_secret'])
	apiKey = os.environ['apiKey']

@app.before_request
def before_request():
	g.loginform=LoginForm()
	g.user = current_user
	if current_user.is_authenticated:
		g.name = g.user.first_name
	else:
		g.name = None

@lm.user_loader
def load_user(id):
    return models.User.query.get(int(id))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    g.user=None
    return redirect('/')

@app.route('/login', methods=['GET','POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        # Login and validate the user.
        # user should be an instance of your `User` class
        user = models.User.query.filter_by(email=form.inputEmail.data).first()
        if user:
        	if user.check_password(form.inputPassword.data):
	        	login_user(user)
	        	g.user=user
	        	return redirect(request.referrer)
        	flash('Invalid Password')
        else:
        	flash('Unrecognized Email Address')
        return redirect(request.referrer)
    return redirect('/')

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if g.user is not None and g.user.is_authenticated:
#         return redirect(url_for('index'))
#     form = LoginForm()
#     if form.validate_on_submit():
#         session['remember_me'] = form.remember_me.data
#         return oid.try_login(form.openid.data, ask_for=['nickname', 'email'])
#     return render_template('login.html', 
#                            title='Sign In',
#                            form=form,
#                            providers=app.config['OPENID_PROVIDERS'])

languages = ['en', 'jp']
pages = ['base', 'b2b', 'lead-management']

@app.route('/')
def no_language():
	return redirect('/en')

@app.route('/<language>')
def index(language):
	if language in pages:
		return redirect('/en/'+language)
	if language not in languages:
		return redirect('/en')
	return render_template(language+'/index.html', form=g.loginform, name=g.name, lang=language)

@app.route('/<language>/base')
def base(language):
	if language not in languages:
		return redirect('/en/base')
	return render_template(language+'/base.html', form=g.loginform, name=g.name, lang=language)

@app.route('/<language>/b2b')
def get_started_b2b(language):
	if language not in languages:
		return redirect('/en/b2b')
	return render_template(language+'/b2b.html', form=g.loginform, name=g.name, lang=language, page='b2b')

@app.route('/<language>/lead-management')
def feature_function(language):
	if language not in languages:
		return redirect('/en/lead-management.html')
	return render_template(language+'/lead-management.html', form=g.loginform, name=g.name, lang=language, page='lead-management')

class CreateFolders(Resource):
	def get(self, api_key_in, new_email):
		if api_key_in != apiKey or '@' not in new_email:
			return {'success':False}
		else:
			results = []
			foldername = new_email.split('@')[0].lower()
			for parentId in [19802,19801,19799,19797,19798,19794,19795,19791,19790]:
				trialcounter=0
				while trialcounter<3:
					try:
						create_result = restClient.create_folder(foldername, str(parentId))
						print(create_result)
						if create_result['success']:
							results.append(create_result['result'][0]['id'])
						else:
							results.append(create_result['errors'])
						break
					except Exception as e:
						print(e)
						trialcounter+=1
						if trialcounter==3:
							results.append('Unknown Error')
			p_result='error on folder creation'
			if isinstance( results[0], int ):
				trialcounter=0
				while trialcounter<3:
					try:
						program_result = restClient.create_program({"type":"Folder", "id":results[0]},"My First Program - "+foldername, "Default", "Content", "My First Program")
						if program_result['success']:
							p_result=program_result['result'][0]['id']
						else:
							p_result=program_result['errors']
						break
					except Exception as e:
						print(e)
						trialcounter+=1
						if trialcounter==3:
							p_result='Unknown Error'
				# result[0] is the id of the parent folder, finish writing create_program api call first
				# prog_result = restClient.create_program()

			return {'success':True,'folder_name': foldername,'folder_results':results, 'program_result':p_result}

api.add_resource(CreateFolders, '/createfolders/<string:api_key_in>/<string:new_email>')

cu_parser = reqparse.RequestParser()
cu_parser.add_argument('FirstName', type=str, required=True, location='form')
cu_parser.add_argument('LastName', type=str, required=True, location='form')
cu_parser.add_argument('Email', type=str, required=True, location='form')
cu_parser.add_argument('password', type=str, required=True, location='form')
cu_parser.add_argument('LeadRole', type=str, required=True, location='form')
cu_parser.add_argument('language', location='form')

class CreateUser(Resource):
	def post(self, api_key_in):
		if api_key_in != apiKey:
			return {'success':False, 'message':''}
		args = cu_parser.parse_args()
		if models.User.query.filter_by(email=args['Email']).all():
			return {'success':False, 'message':'This email address is already in use by another account'}
		else:
			newuser = models.User(args['FirstName'], args['LastName'], args['LeadRole'], args['Email'], 
								  args['password'], language=args['language'])
			db.session.add(newuser)
			db.session.commit()
			return {'success':True, 'message':''}

api.add_resource(CreateUser, '/api/<string:api_key_in>/newuser')

# rl_parser = reqparse.RequestParser()
# rl_parser.add_argument('firstName')
# rl_parser.add_argument('lastName')
# rl_parser.add_argument('email', required=True)
# rl_parser.add_argument('accountString', required=True)
# rl_parser.add_argument('pod',required=True)
# rl_parser.add_argument('loginDate')


# #Endpoint to track who is using mktolive - pass in first/last/email-of-user-id/account-string/pod/(I infer current login date or accept login date)
# #may be taking in marketo munchkin ID and not pod, but need one of the two

#Endpoint to track who is using mktolive - pass in first/last/email-of-user-id/account-string/pod/(I infer current login date or accept login date)
#may be taking in marketo munchkin ID and not pod, but need one of the two

# class RecordLogin(Resource):
# 	def post(self, api_key_in):
# 		args=rl_parser.parse_args()
# 		if 'loginDate' not in args:
# 			login_date=datetime.utcnow()
# 		else:
# 			login_date=datetime.fromtimestamp(args['loginDate'], timezone.utc)
# 		user = models.User.query.filter_by(email=args['email']).first()
# 		if not user:
# 			user = models.User()
# 			user.first_name = args['firstName']
# 			user.last_name = args['lastName']
# 			user.email = args['email']
# 			#eventually: here we will query the marketo instance with the user db to populate the rest of the fields
# 		sub = user.subscriptions.filter_by(account_string=args['accountString']).first()
# 		if not sub:
# 			sub = models.Subscription()
# 			sub.mkto_pod = args['pod']
# 			sub.account_string = args['accountString']
# 		sub.last_login = login_date


# This was an example for pope on how to serve robots.txt, we may use it later
# @app.route('/robots.txt')
# def sendrobot():
# 	return app.send_static_file('robots.txt')