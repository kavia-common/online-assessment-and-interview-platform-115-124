from datetime import datetime

# PUBLIC_INTERFACE
def log_event(event_type: str, metadata: dict | None = None) -> None:
    """Log an event (to be expanded to DB/backends)."""
    print(f"[EVENT] {datetime.utcnow().isoformat()} | {event_type} | {metadata or {}}")
