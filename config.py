import os
basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL','postgresql://localhost/mktolive')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')

WTF_CSRF_ENABLED = True
SECRET_KEY = 'you-will-never-guess'

try:
	from app.setvars import FORM_KEY
	SECRET_KEY = FORM_KEY
except ImportError:
	SECRET_KEY = os.environ['FORM_KEY']