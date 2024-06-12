import flask
import importlib
import jinja2.exceptions
import urllib
import markupsafe

version = importlib.metadata.version("vtes-rulings")
app = flask.Flask(__name__, template_folder="templates")
app.jinja_env.policies["ext.i18n.trimmed"] = True


def main():
    app.run(debug=__debug__)


# Defining Errors
@app.errorhandler(jinja2.exceptions.TemplateNotFound)
@app.errorhandler(404)
def page_not_found(error):
    return flask.render_template("404.html"), 404


# Default route
@app.route("/")
@app.route("/<path:page>")
def index(page=None):
    redirect = False
    if not page:
        page = "index.html"
        redirect = True
    if redirect:
        return flask.redirect(page, 301)
    context = {}
    return flask.render_template(page, **context)


# Helper for hyperlinks
@app.context_processor
def linker():

    def external_link(name, url, anchor=None, class_=None, params=None):
        if params:
            url += "?" + urllib.parse.urlencode(params)
        if anchor:
            url += "#" + anchor

        class_ = f"class={class_} " if class_ else ""
        return markupsafe.Markup(f'<a {class_}target="_blank" href="{url}">{name}</a>')

    return dict(
        external_link=external_link,
    )
