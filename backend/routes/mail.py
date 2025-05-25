from flask_mail import Message, Mail

mail = Mail()

class Mail:
    @staticmethod
    def send_welcome_email(email, name):
        msg = Message(
            subject="Welcome to Biletinyo!",
            recipients=[email]
        )
        msg.body = f"Hi {name},\n\nThanks for signing up!"
        msg.html = f"<p>Hi {name},</p><p>Welcome to Biletinyo!</p>"
        mail.send(msg)
    
    @staticmethod
    def send_password_reset_email(email, name, token):
        msg = Message(
            subject="Your new Biletinyo password",
            recipients=[email]
        )
        msg.body = (
            f"Hi {name},\n\n"
            f"We have received a password reset request. Your reset token is:\n\n"
            f"    {token}\n\n"
            "Please use it to change your password right away.\n\n"
        )
        mail.send(msg)