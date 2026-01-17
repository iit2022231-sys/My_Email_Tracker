import imaplib
import email

class ReplyCheckerService:
    def __init__(self):
        self.host = "imap.gmail.com"

    def check_for_replies(self, user_email: str, app_password: str, known_hr_emails: list):
        replies = []
        try:
            mail = imaplib.IMAP4_SSL(self.host)
            mail.login(user_email, app_password)
            mail.select("inbox")

            for hr_email in known_hr_emails:
                status, messages = mail.search(None, f'(FROM "{hr_email}")')
                if status == "OK":
                    for num in messages[0].split():
                        _, data = mail.fetch(num, "(RFC822)")
                        msg = email.message_from_bytes(data[0][1])
                        
                        # Fix: Safely get snippet even if multipart
                        body = ""
                        if msg.is_multipart():
                            for part in msg.walk():
                                if part.get_content_type() == "text/plain":
                                    payload = part.get_payload(decode=True)
                                    if payload: body = payload.decode(errors='ignore')
                                    break
                        else:
                            payload = msg.get_payload(decode=True)
                            if payload: body = payload.decode(errors='ignore')

                        replies.append({
                            "from": hr_email,
                            "subject": msg['subject'],
                            "snippet": body[:100] if body else "No content preview available"
                        })
            mail.logout()
        except Exception as e:
            print(f"Error checking mail: {e}")
        return replies