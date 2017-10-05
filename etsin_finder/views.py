from etsin_finder import app
from flask import render_template

log = app.logger


@app.route("/")
def hello():
    log.debug("Debug msg")
    log.info("Info msg")
    log.warning("Warn msg")
    log.error("Error msg")
    return render_template('index.html', title='Front Page')
