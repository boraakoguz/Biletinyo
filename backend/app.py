import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from psycopg2 import pool
import bcrypt
from routes import users, events, tickets, comments, images

IMAGE_FOLDER = "images"

app = Flask(__name__, static_url_path="/images", static_folder="images")
app.config['UPLOAD_FOLDER'] = IMAGE_FOLDER

CORS(app)

app.register_blueprint(users.bp, url_prefix='/api/users')
app.register_blueprint(events.bp, url_prefix='/api/events')
app.register_blueprint(tickets.bp, url_prefix='/api/tickets')
app.register_blueprint(comments.bp, url_prefix='/api/comments')
app.register_blueprint(images.bp, url_prefix='/api/images')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
