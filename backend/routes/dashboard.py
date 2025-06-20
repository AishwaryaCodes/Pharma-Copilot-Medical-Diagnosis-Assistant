from fastapi import APIRouter, Depends
from backend.utils.dependencies import get_current_doctor

router = APIRouter()

@router.get("/dashboard")
def access_dashboard(current_user: str = Depends(get_current_doctor)):
    return {"message": f"Welcome to your dashboard, {current_user}!"}
