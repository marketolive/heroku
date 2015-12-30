from flask.ext.wtf import Form
from wtforms import EmailField, PasswordField
from wtforms.validators import DataRequired

class LoginForm(Form):
    email = EmailField('email', label='Email', validators=[DataRequired()])
    password = PasswordField('password', label='Password', validators=[DataRequired()])