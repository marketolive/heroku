from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(32))
    last_name = db.Column(db.String(32))
    email = db.Column(db.String(64))
    role = db.Column(db.String(20))
    password = db.Column(db.String(80))
    marketo_lead_id = db.Column(db.Integer)
    created = db.Column(db.DateTime)
    subscriptions = db.relationship('Subscription', backref='user', lazy='dynamic')

    def __repr__(self):
        return '<User %r>' % (self.email)

class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    account_string = db.Column(db.String(80))
    login = db.Column(db.String(64))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    is_admin = db.Column(db.Boolean)

    def __repr__(self):
        return '<Subscription %r @ %r>' % (self.login, self.account_string)