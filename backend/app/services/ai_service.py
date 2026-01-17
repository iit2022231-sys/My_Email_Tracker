import google.generativeai as genai
from app.core.config import get_settings

class AIService:
    def __init__(self):
        settings = get_settings()
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('models/gemini-flash-latest')

    async def generate_email(self, prompt: str, context: str = "") -> str:
        full_prompt = f"Context: {context}\n\nTask: {prompt}\n\nWrite a professional email:"
        response = self.model.generate_content(full_prompt)
        return response.text