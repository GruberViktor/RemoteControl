from smtplib import SMTP
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from .config import config

### General email sending function
def send_email(from_, to, subject, message):
    smtp_server = config["EMAIL"]["smtp_server"]
    port = int(config["EMAIL"]["port"])
    login_user = config["EMAIL"]["email-address"]
    login_pwd = config["EMAIL"]["email-password"]

    server = SMTP(smtp_server, port, "localhost")
    server.starttls()
    server.login(login_user, login_pwd)
    msg = MIMEMultipart()
    msg["From"] = from_
    msg["To"] = str(to)
    msg["Subject"] = subject
    msg.attach(MIMEText(message, "html"))
    server.send_message(msg)
    server.quit()

