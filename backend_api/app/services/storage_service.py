import os
from pathlib import Path
from app.core.config import settings

# PUBLIC_INTERFACE
def save_file(filename: str, content: bytes) -> str:
    """Save file to configured backend and return a path or key."""
    if settings.FILE_STORAGE_BACKEND == "local":
        Path(settings.FILE_STORAGE_LOCAL_DIR).mkdir(parents=True, exist_ok=True)
        path = os.path.join(settings.FILE_STORAGE_LOCAL_DIR, filename)
        with open(path, "wb") as f:
            f.write(content)
        return path
    # TODO: implement s3
    return f"s3://{settings.S3_BUCKET}/{filename}"
