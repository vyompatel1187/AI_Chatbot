import subprocess


class AIModel:
    def __init__(self, model="mistral"):
        self.model = model
        self.history = []

    def stream(self, message: str):
        self.history.append(f"User: {message}")
        prompt = "\n".join(self.history) + "\nAI:"

        process = subprocess.Popen(
            ["ollama", "run", self.model, prompt], stdout=subprocess.PIPE, text=True
        )

        response = ""
        for line in process.stdout:
            response += line
            yield line

        self.history.append(f"AI: {response.strip()}")
