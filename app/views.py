from app import app, api, mktorest, models, lm, db, formFill
from flask_restful import Resource, reqparse
from flask.ext.login import login_user, logout_user, current_user, login_required
from flask import render_template, flash, request, redirect, g, abort, make_response
from .forms import LoginForm
import os, re
from datetime import datetime
from math import floor

# Init rest client on import
# setvars.py should be maintained locally containing restcreds dictionary
try:
	from app import setvars
	restClient = mktorest.MarketoWrapper(setvars.restcreds['munchkin_id'], setvars.restcreds['client_id'], setvars.restcreds['client_secret'])
	rest_client_mktosolutions = mktorest.MarketoWrapper(setvars.rest_api_mktosolutions['munchkin_id'], setvars.rest_api_mktosolutions['client_id'], setvars.rest_api_mktosolutions['client_secret'])
	apiKey = setvars.apiKey
except ImportError:
	restClient = mktorest.MarketoWrapper(os.environ['munchkin_id'], os.environ['client_id'], os.environ['client_secret'])
	apiKey = os.environ['apiKey']


########################################################
#
#						Logins
#					
########################################################
#
# We use the flask-login library to manage user logins, see docs to understand these endpoints
# https://flask-login.readthedocs.org/en/latest/
#
@app.before_request
def before_request():
	g.loginform=LoginForm()
	g.user = current_user
	g.timestamp = floor(datetime.now().timestamp())
	if current_user.is_authenticated:
		g.name = g.user.first_name
		g.full_name = g.user.first_name + ' ' + g.user.last_name
		g.email = g.user.email
	else:
		g.name = None
		g.full_name = None
		g.email = None
	if request.url.split('.')[0].split('//')[1]=="partners":
		g.partners=True
	else:
		g.partners=False

@app.after_request
def add_header(response):
  if (re.search('/?javascript;?', response.headers['Content-Type'])):
    response.headers['Cache-Control'] = 'public, max-age=28800'
  elif (re.search('^text/(html|css);?', response.headers['Content-Type'])):
    response.headers['Cache-Control'] = 'public, max-age=43200'
  elif (re.search('^image/', response.headers['Content-Type'])):
    response.headers['Cache-Control'] = 'public, max-age=86400'
  else:
    response.headers['Cache-Control'] = 'public, max-age=86400'
  return response

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
		# Login and validate the user
		# user should be an instance of your `User` class
		user = models.User.query.filter_by(email=form.inputEmail.data).first()
		if user:
			login_user(user, remember=True)
			g.user=user
			new_cookie=user.set_id_cookie()
			db.session.add(user)
			db.session.commit()
			resp = make_response(redirect(request.referrer))
			resp.set_cookie('user_id', new_cookie)
			return resp
		else:
			flash('Invalid Email Address')
		return redirect(request.referrer)
	return redirect('/')

########################################################
#
#				Base Template and Index
#					
########################################################

# The following should contain a comprehensive list of languages and pages
# These are used to validate incoming URLs
languages = ['en', 'jp']
categories = ['solutions', 'verticals', 'analytics', 'update', 'events', 'tools', 'learn']
pages = ['base', 'b2b', 'email-marketing', 'lead-management', 'consumer-marketing', 'test',
		 'customer-base-marketing', 'mobile-marketing', 'higher-education',
		 'financial-services', 'healthcare', 'email-insights', 'higher-education2', 'magento', 'conference'
		 'email-insights-summit-demo-1', 'email-insights-summit-demo-2', 'msi', 'privacy-policy', 'extension', 'extension-update', 'clear-cache', 'summit-17', 'summit-18', 'summit-19', 'summit-19-links', 'ad-targeting', 'videos', 'auto-close', 'linkedin']

@app.route('/')
@app.route('/', subdomain="partners")
def no_language():
	return redirect('/en')

@app.route('/<language>')
@app.route('/<language>/')
@app.route('/<language>/', subdomain="partners")
def index(language):
	if language in pages:
		return redirect('/en/' + language)
	if language not in languages:
		return redirect('/en')
	return render_template(language + '/index.html', 
							form=g.loginform, 
							name=g.name,
							full_name = g.full_name, 
							lang=language, 
							page='', 
							path='', 
							user_email = g.email, 
							timestamp = g.timestamp,
							partners=g.partners)

@app.route('/<language>/base')
@app.route('/<language>/base', subdomain="partners")
def base(language):
	if language not in languages:
		return redirect('/en/base')
	return render_template(language+'/base.html', 
							form=g.loginform, 
							name=g.name, 
							full_name = g.full_name,
							lang=language, 
							user_email = g.email, 
							timestamp = g.timestamp,
							partners=g.partners)

# @app.errorhandler(404)
# def page_not_found(error):
#     return render_template('page_not_found.html'), 404

########################################################
#
#	   Universal Route for Solutions and Verticals
#					
########################################################

@app.route('/<language>/<category>/<page>')
@app.route('/<language>/<category>/<page>', subdomain="partners")
def main_router(language, category, page):
	if language not in languages:
		return redirect('/en/%s/%s' % (category, page))
	if category not in categories or page not in pages:
		abort(404)
	return render_template('%s/%s/%s.html' % (language, category, page), 
							form=g.loginform,
							name=g.name,
							full_name = g.full_name,
							lang=language, 
							path='%s/' % (category), 
							page=page, 
							user_email = g.email, 
							timestamp = g.timestamp,
							partners=g.partners)

@app.route('/<category>/<page>')
def no_lang_main_router(category, page):
	if category in categories and page in pages:
		return redirect('/en/%s/%s' % (category, page))
	else:
		abort(404)

@app.route('/plugin')
def plugin():
	return redirect('https://chrome.google.com/webstore/detail/marketolive/onibnnoghllldiecboelbpcaeggfiohl')

########################################################
#
#					Data Endpoints
#					
########################################################
@app.route('/en/info/<page>')
@app.route('/info/<page>')
def info_page(page):
  return render_template('/en/data/submit-web-visits.html', content=page)

@app.route('/data/jp-leads-master')
def jp_leads_master():
    return render_template('/en/data/jp-leads-master.html')

@app.route('/data/abm-106-acme-leads')
def abm_106_acme_leads():
    return render_template('/en/data/abm-106-acme-leads.html')

@app.route('/data/dynamics-lead-web-visit')
def dynamics_lead_web_visit():
    return render_template('/en/data/dynamics-lead-web-visit.html')

@app.route('/data/web-visit')
def web_visit():
    return render_template('/en/data/web-visit.html')

@app.route('/data/form-fill')
def form_fill():
    firstName = request.args.get('firstName')
    lastName = request.args.get('lastName')
    email = request.args.get('email')
    domain = request.args.get('domain')
    formId = request.args.get('formId')
    subId = request.args.get('subId')
    formVid = request.args.get('formVid')
    lpId = request.args.get('lpId')
    munchkinId = request.args.get('munchkinId')
    mktoReferrer= request.args.get('mktoReferrer')
    output = formFill.request(firstName, lastName, email, domain, formId, subId, formVid, lpId, munchkinId, mktoReferrer)
    return render_template('en/data/form-fill-results.html', content=output)

@app.route('/data/mock-lead')
def mock_lead():
    return render_template('/en/data/submit-mock-lead.html', content="Submitting Mock Lead Data")

@app.route('/en/update/plugin-update')
def plugin_update():
    return render_template('/en/update/extension.html',
        form = g.loginform,
        name = g.name,
        full_name = g.full_name,
        lang = 'en',
        path = '%s/update',
        page = 'extension',
        user_email = g.email,
        timestamp = g.timestamp,
        partners = g.partners)

@app.route('/en/signup')
def signup():
    if (request.args.get('key') == 'newUserRequest'):
        return render_template('/en/signup.html',
            form = g.loginform,
            name = g.name,
            full_name = g.full_name,
            lang = 'en',
            path = '%s/',
            page = 'signup',
            user_email = g.email,
            timestamp = g.timestamp,
            partners = g.partners)
    else:
        abort(404)

########################################################
#
#					API Endpoints
#					
########################################################

#
# Create Folders
#
# /createfolders/<string:api_key_in>/<string:new_email>
# GET, no query string
#
# Creates folders and 'My First Program - [name]' in MarketoLive Demo instance. 
# Name is username from email, i.e. email.split('@')[0]
# Primarily used during the provisioning of new MarketoLive users

class CreateFolders(Resource):
	def get(self, api_key_in, new_email):
		if api_key_in != apiKey or '@' not in new_email:
			return {'success':False}
		else:
			results = []
			foldername = new_email.split('@')[0].lower()
			for parentId in [19802,19801,19799,19797,19798,19794,19795,19791,19790,19796,19792,19806]:
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

class DeleteLead(Resource):
	def get(self, api_key_in, email):
		if api_key_in == apiKey and '@' in email:
			get_lead_results = []
			delete_lead_results = []
			try:
				get_lead_result = rest_client_mktosolutions.get_multiple_leads_by_filter_type('email', [email], ['id'])
				print(get_lead_result)
				if get_lead_result['success']:
					get_lead_results.append(get_lead_result['result'][0]['id'])
					lead = [{"id": get_lead_result['result'][0]['id']}]
					try:
						delete_lead_result = rest_client_mktosolutions.delete_lead(lead)
						print(delete_lead_result)
						if delete_lead_result['success']:
							delete_lead_results.append(delete_lead_result['result'][0]['id'])
							return {'success': True, 'email': email, 'get_lead_results': get_lead_results, 'delete_lead_results': delete_lead_results}
						else:
							delete_lead_results.append(delete_lead_result['errors'])
							return {'success': False, 'email': email, 'get_lead_results': get_lead_results, 'delete_lead_results': delete_lead_results}
					except Exception as e:
						print(e)
						print('Unknown Error')
				else:
					get_lead_results.append(get_lead_result['errors'])
					return {'success': False, 'email': email, 'get_lead_results': get_lead_results}
			except Exception as e:
				print(e)
				print('Unknown Error')
		else:
			return {'success': False}

api.add_resource(DeleteLead, '/deleteLead/<string:api_key_in>/<string:email>')
#
# Create User
#
# /api/<string:api_key_in>/newuser
# POST, Content-Type = application/x-www-form-urlencoded OR application/json
# 
# inputs = *firstName, *lastName, *email, role, language (*REQUIRED)
#
# Output = 	{
#			'success':True/False, 
#			'message':[error message if unsuccessful or blank if wrong API key],
#			'result':''
#			}
#
# Creates new user in server database. 

cu_parser = reqparse.RequestParser()
cu_parser.add_argument('firstName', type=str, required=True)
cu_parser.add_argument('lastName', type=str, required=True)
cu_parser.add_argument('email', type=str, required=True)
#cu_parser.add_argument('password', type=str, required=True, location='form')
cu_parser.add_argument('role', type=str)
cu_parser.add_argument('language')

class CreateUser(Resource):
	def post(self, api_key_in):
		if api_key_in != apiKey:
			return {'success':False, 'message':'', 'result':''}
		args = cu_parser.parse_args()
		if models.User.query.filter_by(email=args['email']).all():
			return {'success':False, 'message':'There is already an account associated with this email address'}
		else:
			newuser = models.User(args['firstName'], args['lastName'], args['email'], role=args['role'], language=args['language'])
			db.session.add(newuser)
			db.session.commit()
			return {'success':True, 'message':'','result':''}

api.add_resource(CreateUser, '/api/<string:api_key_in>/newuser')

#
# Record Last Login - WORK IN PROGRESS
#
# /api/<string:api_key_in>/recordlogin
# POST, Content-Type = application/x-www-form-urlencoded OR application/json
# 
# inputs = *uidCookie, *loginEmail, *accountString, *pod, loginDate (*REQUIRED)
#
# Output = 	{
#			'success':True/False, 
#			'message':[error message, blank if wrong API key, or note about success],
#			'result':''
#			}
#
# Records last login in database. Login datetime can be passed in explicitly as a UTC Timestamp
# or, if blank, will be set to the time of request

rl_parser = reqparse.RequestParser()
rl_parser.add_argument('uidCookie', required=True)
rl_parser.add_argument('loginEmail', required=True)
rl_parser.add_argument('accountString', required=True)
rl_parser.add_argument('pod',required=True)
rl_parser.add_argument('loginDate')

class RecordLogin(Resource):
	def post(self, api_key_in):
		if api_key_in != apiKey:
			return {'success':False, 'message':'', 'result':''}
		args=rl_parser.parse_args()
		if 'loginDate' not in args or not args['loginDate']:
			login_date=datetime.utcnow()
		else:
			login_date=datetime.fromtimestamp(args['loginDate'], timezone.utc)
		user = models.User.query.filter_by(cookie=args['uidCookie']).first()
		if not user:
			return {'success':False, 'message':'No user associated with that cookie', 'result':''}
		sub = user.subscriptions.filter_by(account_string=args['accountString']).first()
		if not sub:
			sub = models.Subscription()
			sub.user_id = user.id
			sub.account_string = args['accountString']
			sub.mkto_pod = args['pod']
			message='New subscription for this user'
		else:
			message='Last login updated'
		sub.login = args['loginEmail']
		sub.last_login = login_date
		db.session.add(sub)
		db.session.commit()
		return {'success':True, 'message':message, 'result':''}

api.add_resource(RecordLogin, '/api/<string:api_key_in>/recordlogin')

# Temporary for Andy
class ReturnCoupon(Resource):
	def get(self, api_key_in):
		if api_key_in != apiKey:
			return {'success':False, 'message':'', 'result':''}
		return {'success':True, 'couponCode':'coupon123'}

api.add_resource(ReturnCoupon, '/api/<string:api_key_in>/getcoupon')


########################################################
#
#				Archive and Miscellany
#					
########################################################

# Robots.txt is currently set to disallow search engine indexing of all pages
@app.route('/robots.txt')
def sendrobot():
	return app.send_static_file('robots.txt')