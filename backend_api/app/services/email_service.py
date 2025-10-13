from app.core.config import settings

# PUBLIC_INTERFACE
def send_email(to_email: str, subject: str, body: str) -> None:
    """Send an email using configured backend (smtp/sendgrid/console). Stub implementation."""
    backend = settings.EMAIL_BACKEND.lower()
    if backend == "console":
        print(f"[EMAIL console] To: {to_email} | Subject: {subject}\n{body}")
    else:
        # TODO: implement SMTP or SendGrid
        print(f"[EMAIL {backend}] Stub send to {to_email}")
