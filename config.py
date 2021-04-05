import os
basedir = os.path.abspath(os.path.dirname(__file__))

FORCE_SSL = True

SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL','postgresql://localhost/mktolive')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
SQLALCHEMY_TRACK_MODIFICATIONS = True


WTF_CSRF_ENABLED = True

try:
	from app.setvars import FORM_KEY
	SECRET_KEY = FORM_KEY
except ImportError:
	SECRET_KEY = os.environ['FORM_KEY']