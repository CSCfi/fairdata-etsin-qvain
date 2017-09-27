from app import app

@app.route("/")
def hello():
    log.debug("Debug msg")
    log.info("Info msg")
    log.warning("Warn msg")
    log.error("Error msg")
    return "Hello World!"
