from app import app

@app.route('/')
@app.route('/index')
def index():
    return "Welcome to the MarketoLive Server!"

# @app.route('/robots.txt')
# def sendrobot():
# 	return app.send_static_file('robots.txt')