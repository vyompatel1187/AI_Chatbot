from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.llm_service import AIModel

router = APIRouter()
ai = AIModel()


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat(req: ChatRequest):
    return StreamingResponse(ai.stream(req.message), media_type="text/plain")
