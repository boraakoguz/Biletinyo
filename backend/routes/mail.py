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
            subject="Your Biletinyo reset token",
            recipients=[email]
        )
        msg.body = (
            f"Hi {name},\n\n"
            f"We have received a password reset request. Your reset token is:\n\n"
            f"    {token}\n\n"
            "Please use it to change your password right away.\n\n"
        )
        mail.send(msg)

    @staticmethod
    def send_ticket_email(recipient_email, recipient_name, ticket_id, pdf_bytes):
        subject = f"Your Ticket #{ticket_id} from Biletinyo"
        msg = Message(
            subject=subject,
            recipients=[recipient_email]
        )
        msg.body = (
            f"Hi {recipient_name},\n\n"
            f"Thank you for your purchase! Attached is your ticket #{ticket_id}.\n\n"
            "See you at the event!\n"
        )

        filename = f"ticket_{ticket_id}.pdf"
        msg.attach(
            filename,
            "application/pdf",
            pdf_bytes
        )
        mail.send(msg)