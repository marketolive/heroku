from flask.ext.wtf import Form
from flask.ext.wtf.html5 import EmailField
from wtforms import PasswordField
from wtforms.validators import DataRequired

class LoginForm(Form):
    inputEmail = EmailField('inputEmail', validators=[DataRequired()])
    #inputPassword = PasswordField('inputPassword', validators=[DataRequired()])