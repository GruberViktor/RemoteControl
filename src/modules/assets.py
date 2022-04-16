from flask_assets import Environment, Bundle

from .app import app


assets = Environment(app)
assets.init_app(app)

js = Bundle(
    "node_modules/socket.io/client-dist/socket.io.js",
    "node_modules/mustache/mustache.js",
    "js/notifications.js",
    "js/main.js",
    filters="jsmin",
    output="gen/packed.js",
)
assets.register("js_all", js)

assets.url = app.static_url_path
scss = Bundle('style.scss', filters='pyscss', output='all.css')
assets.register('scss_all', scss)