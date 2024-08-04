from dataclasses import asdict
import flask
import functools
import importlib
import jinja2.exceptions
import urllib
import markupsafe


from . import rulings


version = importlib.metadata.version("vtes-rulings")
app = flask.Flask(__name__, template_folder="templates")
app.secret_key = b"FAKE_SECRET_DEBUG"

INDEX = rulings.INDEX


def main():
    app.run(debug=__debug__)


def proposal_required(f):
    @functools.wraps(f)
    async def decorated_function(*args, **kwargs):
        if "proposal" not in flask.session:
            flask.abort(405)
        rulings.INDEX.use_proposal(flask.session["proposal"])
        return await f(*args, **kwargs)

    return decorated_function


def proposal_facultative(f):
    @functools.wraps(f)
    async def decorated_function(*args, **kwargs):
        if "proposal" in flask.session:
            rulings.INDEX.use_proposal(flask.session["proposal"])
        else:
            rulings.INDEX.off_proposals()
        return await f(*args, **kwargs)

    return decorated_function


# Defining Errors
@app.errorhandler(jinja2.exceptions.TemplateNotFound)
@app.errorhandler(404)
def page_not_found(error):
    return flask.render_template("404.html"), 404


@app.errorhandler(rulings.FormatError)
@app.errorhandler(rulings.ConsistencyError)
def data_error(error):
    return flask.jsonify([error.args[0]]), 400


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


# Default route
@app.route("/")
@app.route("/<path:page>")
async def index(page=None):
    if not page:
        return flask.redirect("index.html", 301)
    context = {}
    return flask.render_template(page, **context)


@app.route("/complete/<text>")
async def complete_card(text: str):
    """Card name completion, with IDs."""
    text = urllib.parse.unquote(text)
    ret = rulings.KRCG_SEARCH.name.search(text)["en"]
    ret = [
        ({"name": card.usual_name, "id": card.id, "score": score})
        for card, score in ret.items()
    ]
    ret.sort(key=lambda x: (-x["score"], x["name"]))
    return ret


@app.route("/card/<int:card_id>")
@proposal_facultative
async def get_card(card_id: int):
    try:
        ret = asdict(INDEX.get_card(card_id))
        card_id = str(card_id)
        ret["rulings"] = [asdict(r) for r in INDEX.get_rulings(card_id)]
        ret["groups"] = [asdict(r) for r in INDEX.get_groups_of_card(card_id)]
        ret["backrefs"] = [asdict(r) for r in INDEX.get_backrefs(card_id)]
        return ret
    except KeyError:
        flask.abort(404)


@app.route("/group")
@proposal_facultative
async def list_groups():
    ret = list(asdict(g) for g in INDEX.all_groups())
    return flask.jsonify(ret)


@app.route("/group/<group_id>")
@proposal_facultative
async def get_group(group_id: str):
    try:
        ret = asdict(INDEX.get_group(group_id))
        ret["rulings"] = [asdict(r) for r in INDEX.get_rulings(group_id)]
        return flask.jsonify(ret)
    except KeyError:
        flask.abort(404)


@app.route("/proposal", methods=["POST"])
async def start_proposal():
    data = flask.request.form or flask.request.get_json(force=True, silent=True) or {}
    ret = INDEX.start_proposal(**data)
    flask.session["proposal"] = ret
    return {"proposal_id": ret}


@app.route("/proposal", methods=["PUT"])
@proposal_required
async def update_proposal():
    data = flask.request.form or flask.request.get_json(force=True)
    ret = INDEX.update_proposal(**data)
    flask.session["proposal"] = ret
    return {"proposal_id": ret}


@app.route("/proposal/submit", methods=["POST"])
@proposal_required
async def submit_proposal():
    await INDEX.submit_proposal()
    return INDEX.proposal.channel_id


@app.route("/proposal", methods=["GET"])
async def list_proposals():
    ret = list(INDEX.proposals.keys())
    return flask.jsonify(ret)


@app.route("/reference", methods=["POST"])
@proposal_required
async def post_reference():
    data = flask.request.form or flask.request.get_json(force=True)
    ret = INDEX.insert_reference(**data)
    return asdict(ret)


@app.route("/reference/<reference_id>", methods=["PUT"])
@proposal_required
async def put_reference(reference_id: str):
    data = flask.request.form or flask.request.get_json(force=True)
    ret = INDEX.update_reference(reference_id, **data)
    return asdict(ret)


@app.route("/reference/<reference_id>", methods=["DELETE"])
@proposal_required
async def delete_reference(reference_id: str):
    INDEX.delete_reference(reference_id)
    return {}


@app.route("/check-references", methods=["GET"])
@proposal_facultative
async def check_references():
    ret = [e.args[0] for e in INDEX.check_references()]
    return ret


@app.route("/ruling/<target_id>", methods=["POST"])
@proposal_required
async def post_ruling(target_id: str):
    data = flask.request.form or flask.request.get_json(force=True)
    ret = INDEX.insert_ruling(target_id, **data)
    return asdict(ret)


@app.route("/ruling/<target_id>/<ruling_id>", methods=["PUT"])
@proposal_required
async def put_ruling(target_id: str, ruling_id: str):
    data = flask.request.form or flask.request.get_json(force=True)
    ret = INDEX.update_ruling(target_id, ruling_id, **data)
    return asdict(ret)


@app.route("/ruling/<target_id>/<ruling_id>", methods=["DELETE"])
@proposal_required
async def delete_ruling(target_id: str, ruling_id: str):
    INDEX.delete_ruling(target_id, ruling_id)
    return {}


@app.route("/group", methods=["POST"])
@proposal_required
async def post_group():
    data = flask.request.form or flask.request.get_json(force=True)
    ret = INDEX.upsert_group(**data)
    return asdict(ret)


@app.route("/group/<group_id>", methods=["PUT"])
@proposal_required
async def put_group(group_id: str):
    data = flask.request.form or flask.request.get_json(force=True)
    ret = INDEX.upsert_group(uid=group_id, **data)
    return asdict(ret)


@app.route("/group/<group_id>", methods=["DELETE"])
@proposal_required
async def delete_group(group_id: str):
    INDEX.delete_group(group_id)
    return {}
