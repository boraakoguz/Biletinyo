import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import psycopg2
from psycopg2 import pool
from routes.mail import mail

import bcrypt
from routes import users, events, tickets, comments, images, venues, login, register, payments, reports, follows, forget_password

IMAGE_FOLDER = "images"

app = Flask(__name__, static_url_path="/images", static_folder="images")
app.config['UPLOAD_FOLDER'] = IMAGE_FOLDER
app.config["JWT_SECRET_KEY"] = "RandomStringForJWTGeneration"
app.config["JWT_ACCESS_TOKEN_EXPIRES"]  = 900

app.config.update(
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME=os.getenv("EMAIL_USER"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASS"),
    MAIL_DEFAULT_SENDER=(
        "Biletinyo",
        os.getenv("EMAIL_USER")
    )
)

mail.init_app(app)

CORS(app)

app.register_blueprint(users.bp, url_prefix='/api/users')
app.register_blueprint(events.bp, url_prefix='/api/events')
app.register_blueprint(tickets.bp, url_prefix='/api/tickets')
app.register_blueprint(comments.bp, url_prefix='/api/comments')
app.register_blueprint(images.bp, url_prefix='/api/images')
app.register_blueprint(login.bp, url_prefix='/api/login')
app.register_blueprint(register.bp, url_prefix='/api/register')
app.register_blueprint(venues.bp, url_prefix='/api/venues')
app.register_blueprint(payments.bp, url_prefix='/api/payments')
app.register_blueprint(reports.bp, url_prefix='/api/reports')
app.register_blueprint(follows.bp, url_prefix='/api/follows')
app.register_blueprint(forget_password.bp, url_prefix='/api/forgot_password')


jwt = JWTManager(app)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
