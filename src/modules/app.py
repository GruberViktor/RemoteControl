import os
import flask
import flask_login

from config import config
from relais_controller import machines


app = flask.Flask(__name__)
app._static_folder = os.path.abspath("static/")
app.secret_key = config["FLASK"]["secret_key"]
app.config["TEMPLATES_AUTO_RELOAD"] = True

login_manager = flask_login.LoginManager()
login_manager.init_app(app)

# Mock database.
users = {config["CREDENTIALS"]["user"]: {"pw": config["CREDENTIALS"]["password"]}}


class User(flask_login.UserMixin):
    pass


@login_manager.user_loader
def user_loader(email):
    if email not in users:
        return

    user = User()
    user.id = email
    return user


@login_manager.request_loader
def request_loader(request):
    email = request.form.get("email")
    if type(email) == str:
        email = email.lower().strip()
    if email not in users:
        return

    user = User()
    user.id = email

    user.is_authenticated = request.form["pw"] == users[email]["pw"]

    return user


@login_manager.unauthorized_handler
def unauthorized_handler():
    return flask.redirect("/login")


@app.route("/login", methods=["GET", "POST"])
def login():
    if flask.request.method == "GET":
        return flask.render_template("login.html")

    email = flask.request.form["email"]
    if email == "":
        return flask.redirect("/login")
    if flask.request.form["pw"] == users[email]["pw"]:
        user = User()
        user.id = email
        flask_login.login_user(user)
        return flask.redirect("/")

    return flask.redirect("/login")


@app.route("/logout")
def logout():
    flask_login.logout_user()
    return flask.redirect("/login")


@app.route("/")
@flask_login.login_required
def index():
    return flask.render_template("main.html", machines=machines)


@app.route("/static/<path:filename>")
def serve_static(filename):
    root_dir = os.path.dirname(os.getcwd())
    return flask.send_from_directory(os.path.join(root_dir, "static"), filename)
