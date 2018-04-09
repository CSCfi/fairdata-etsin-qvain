from flask import render_template

from etsin_finder.finder import app


# This route is used by React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def frontend_app(path):
    return render_template('index.html', title='Front Page')
