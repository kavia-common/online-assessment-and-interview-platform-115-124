from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.file import StoredFile, FileStorageBackend
from app.services.storage_service import save_file

router = APIRouter()

# PUBLIC_INTERFACE
@router.post(
    "/upload",
    summary="Upload a file",
    description="Uploads a file and stores metadata. Returns file record.",
    operation_id="files_upload",
)
async def upload_file(
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
    owner_id: Optional[int] = Form(default=None),
):
    content = await file.read()
    storage_path = save_file(file.filename, content)
    meta = StoredFile(
        owner_id=owner_id,
        filename=file.filename,
        content_type=file.content_type or "application/octet-stream",
        size_bytes=len(content),
        backend=FileStorageBackend.local,
        storage_path=storage_path,
    )
    db.add(meta)
    db.commit()
    db.refresh(meta)
    return {
        "id": meta.id,
        "owner_id": meta.owner_id,
        "filename": meta.filename,
        "content_type": meta.content_type,
        "size_bytes": meta.size_bytes,
        "storage_path": meta.storage_path,
    }
