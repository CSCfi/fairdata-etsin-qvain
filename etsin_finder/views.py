from etsin_finder.finder import app
from flask import render_template


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html', title='Front Page')
