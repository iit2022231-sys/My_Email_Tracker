from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.utils import BaseRepository
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse, ResumeListItem

router = APIRouter(prefix="/resumes", tags=["resumes"])

def check_duplicate_name(db: Session, name: str, exclude_id: int = None) -> None:
    """Check if resume name already exists."""
    query = db.query(Resume).filter(Resume.name == name)
    if exclude_id:
        query = query.filter(Resume.id != exclude_id)
    if query.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume with this name already exists"
        )

@router.post("/", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def create_resume(resume: ResumeCreate, db: Session = Depends(get_db)):
    """Create a new resume."""
    check_duplicate_name(db, resume.name)
    db_resume = Resume(name=resume.name, content=resume.content)
    repo = BaseRepository(Resume, db)
    return repo.create(db_resume)

@router.get("/", response_model=list[ResumeListItem])
def list_resumes(db: Session = Depends(get_db)):
    """Get all resumes (list view without full content)."""
    repo = BaseRepository(Resume, db)
    return repo.get_all()

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(resume_id: int, db: Session = Depends(get_db)):
    """Get a specific resume by ID."""
    repo = BaseRepository(Resume, db)
    return repo.get_or_404(resume_id)

@router.put("/{resume_id}", response_model=ResumeResponse)
def update_resume(resume_id: int, resume: ResumeUpdate, db: Session = Depends(get_db)):
    """Update a resume."""
    repo = BaseRepository(Resume, db)
    db_resume = repo.get_or_404(resume_id)
    
    if resume.name and resume.name != db_resume.name:
        check_duplicate_name(db, resume.name, exclude_id=resume_id)
        db_resume.name = resume.name
    
    if resume.content:
        db_resume.content = resume.content
    
    return repo.update(db_resume)

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    """Delete a resume."""
    repo = BaseRepository(Resume, db)
    db_resume = repo.get_or_404(resume_id)
    repo.delete(db_resume)
    return None
