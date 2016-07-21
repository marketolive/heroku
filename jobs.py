from app.views import restClient
from flask.ext.script import Manager
from migrate.versioning import api
from config import SQLALCHEMY_DATABASE_URI
from config import SQLALCHEMY_MIGRATE_REPO
import imp
import os.path
from app import app, db

manager = Manager(app)

#########################################################
#
#  Monthly Job to schedule campaigns for calendar demo
#
#########################################################

@manager.command
def skedMonthCampaigns():
	results = []
	for campaignId in [19802,19801,19799,19797,19798,19794,19795,19791,19790]: #NEED TO CHANGE THESE IDS
		trialcounter=0
		while trialcounter<3:
			try:
				sked_result = restClient.schedule_campaign(campaignId, run_at=run_date)
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


#########################################################
#
#                 	  Database Jobs
#
#########################################################


@manager.command
def db_create():
	db.create_all()
	if not os.path.exists(SQLALCHEMY_MIGRATE_REPO):
	    api.create(SQLALCHEMY_MIGRATE_REPO, 'database repository')
	    api.version_control(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
	else:
	    api.version_control(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO, api.version(SQLALCHEMY_MIGRATE_REPO))

@manager.command
def db_downgrade():
	v = api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
	api.downgrade(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO, v - 1)
	v = api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
	print('Current database version: ' + str(v))

@manager.command
def db_migrate():
	v = api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
	migration = SQLALCHEMY_MIGRATE_REPO + ('/versions/%03d_migration.py' % (v+1))
	tmp_module = imp.new_module('old_model')
	old_model = api.create_model(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
	exec(old_model, tmp_module.__dict__)
	script = api.make_update_script_for_model(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO, tmp_module.meta, db.metadata)
	open(migration, "wt").write(script)
	api.upgrade(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
	v = api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
	print('New migration saved as ' + migration)
	print('Current database version: ' + str(v))

@manager.command
def db_upgrade():
	api.upgrade(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
	v = api.db_version(SQLALCHEMY_DATABASE_URI, SQLALCHEMY_MIGRATE_REPO)
	print('Current database version: ' + str(v))


# Main
if __name__ == "__main__":
    manager.run()
