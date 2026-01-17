import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import get_settings

class EmailService:
    def __init__(self):
        settings = get_settings()
        self.user = settings.EMAIL_USER
        self.password = settings.EMAIL_PASSWORD
        self.smtp_server = settings.SMTP_SERVER
        self.smtp_port = settings.SMTP_PORT

    def send_bulk_emails(self, recipients: list, subject: str, body: str) -> bool:
        """Send bulk emails to recipients."""
        if not recipients:
            raise ValueError("No recipients provided")
        
        if not self.user or not self.password:
            raise ValueError("Email credentials not configured. Please configure SMTP settings.")
        
        server = None
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port, timeout=10)
            server.starttls()
            server.login(self.user, self.password)

            sent_count = 0
            for recipient in recipients:
                try:
                    msg = MIMEMultipart()
                    msg['From'] = self.user
                    msg['To'] = recipient
                    msg['Subject'] = subject
                    msg.attach(MIMEText(body, 'plain'))
                    server.send_message(msg)
                    sent_count += 1
                    print(f"Email sent to {recipient}")
                except Exception as e:
                    print(f"Failed to send to {recipient}: {e}")
                    continue
            
            if sent_count == 0:
                raise Exception("No emails sent successfully")
            
            print(f"Successfully sent {sent_count}/{len(recipients)} emails")
            return True
        except smtplib.SMTPAuthenticationError as e:
            raise Exception("Email authentication failed. Check your credentials.")
        except Exception as e:
            print(f"Failed to send emails: {e}")
            raise
        finally:
            if server:
                try:
                    server.quit()
                except:
                    pass
            if server:
                try:
                    server.quit()
                except:
                    pass