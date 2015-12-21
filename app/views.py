from app import app, api, mktorest, models
from flask_restful import Resource, reqparse
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


@app.route('/')
@app.route('/index')
def index():
    return "<html><body><h1>Welcome to the MarketoLive Server!</h1><h2>AKA Project Queequeg</h2><h3><a href='http://www.marketolive.com'>Proceed to Marketo Live</a></h3></body></html>"


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
			return {'success':True,'folder_name': foldername,'results':results}

api.add_resource(CreateFolders, '/createfolders/<string:api_key_in>/<string:new_email>')


rl_parser = reqparse.RequestParser()
rl_parser.add_argument('firstName')
rl_parser.add_argument('lastName')
rl_parser.add_argument('email', required=True)
rl_parser.add_argument('accountString', required=True)
rl_parser.add_argument('pod',required=True)
rl_parser.add_argument('loginDate')

#Endpoint to track who is using mktolive - pass in first/last/email-of-user-id/account-string/pod/(I infer current login date or accept login date)
#may be taking in marketo munchkin ID and not pod, but need one of the two
class RecordLogin(Resource):
	def post(self, api_key_in):
		args=rl_parser.parse_args()
		if 'loginDate' not in args:
			login_date=datetime.utcnow()
		else:
			login_date=datetime.fromtimestamp(args['loginDate'], timezone.utc)
		user = models.User.query.filter_by(email=args['email']).first()
		if not user:
			user = models.User()
			user.first_name = args['firstName']
			user.last_name = args['lastName']
			user.email = args['email']
			#eventually: here we will query the marketo instance with the user db to populate the rest of the fields
		sub = user.subscriptions.filter_by(account_string=args['accountString']).first()
		if not sub:
			sub = models.Subscription()
			sub.mkto_pod = args['pod']
			sub.account_string = args['accountString']

		sub.last_login = login_date
account_string = db.Column(db.String(80))
    mkto_pod = db.Column(db.String(20))
    login = db.Column(db.String(64))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    is_admin = db.Column(db.Boolean)
    last_login = db.Column(db.DateTime)

first_name = db.Column(db.String(32))
    last_name = db.Column(db.String(32))
    email = db.Column(db.String(64))
    role = db.Column(db.String(20))
    password = db.Column(db.String(80))
    marketo_lead_id = db.Column(db.Integer)
    created = db.Column(db.DateTime)
    subscriptions


# This was an example for pope on how to serve robots.txt, we may use it later
# @app.route('/robots.txt')
# def sendrobot():
# 	return app.send_static_file('robots.txt')