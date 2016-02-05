from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(32))
    last_name = db.Column(db.String(32))
    email = db.Column(db.String(64), unique=True)
    role = db.Column(db.String(20))
    language = db.Column(db.String(20))
    password = db.Column(db.String(80))
    marketo_lead_id = db.Column(db.Integer)
    created = db.Column(db.DateTime)
    subscriptions = db.relationship('Subscription', backref='user', lazy='dynamic')

    def __init__(self, fname, lname, email, role=None, password=None, created=None, language=None):
        self.first_name=fname
        self.last_name=lname
        self.role=role
        self.created=created if created else datetime.now()
        self.email = email
        self.language = language if language else 'en'
        #self.set_password(password)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)  # python 3

    def __repr__(self):
        return '<User %r>' % (self.email)

class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    account_string = db.Column(db.String(80))
    mkto_pod = db.Column(db.String(20))
    login = db.Column(db.String(64)) #Email address used to Login
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    is_admin = db.Column(db.Boolean)
    last_login = db.Column(db.DateTime)

    def __repr__(self):
        return '<Subscription %r @ %r>' % (self.login, self.account_string)