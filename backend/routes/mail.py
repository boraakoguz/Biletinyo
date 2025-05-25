from flask_mail import Message, Mail

mail = Mail()

class Mail:
    def send_welcome_email(email, name):
        msg = Message(
            subject="Welcome to Biletinyo!",
            recipients=[email]
        )
        msg.body = f"Hi {name},\n\nThanks for signing up!"
        msg.html = f"<p>Hi {name},</p><p>Welcome to Biletinyo!</p>"
        mail.send(msg)