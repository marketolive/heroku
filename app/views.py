from app import app, api, mktorest
from flask_restful import Resource
import os

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
    return "<html><body><h1>Welcome to the MarketoLive Server!</h1><h2><a href='http://www.marketolive.com'>Proceed to Marketo Live</a></h2></body></html>"


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

# This was an example for pope on how to serve robots.txt, we may use it later
# @app.route('/robots.txt')
# def sendrobot():
# 	return app.send_static_file('robots.txt')