from etsin_finder.finder import app
from flask import render_template, send_from_directory

# @app.route('/', defaults={'path': ''})
# @app.route('/<path:filename>')
# def send_static(filename):
#     return send_from_directory('frontend/static', filename)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html', title='Front Page')
