import os
import json
from pyexpat.errors import messages
from huggingface_hub import InferenceClient
from app.schemas import TriageResponse

HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
client = InferenceClient(
    token=HF_TOKEN,
    model="Qwen/Qwen2.5-Coder-32B-Instruct"
)

SYSTEM_PROMPT ="You are Neurolog, an expert DevOps system triage AI. Analyze the provided log stream and return a diagnostic triage payload matching the requested JSON schema. Esure playbook resolution steps contain cocrete CLI commands (e.g docker compose, nc, kubectl)"
def process_log_triage(raw_log: str, runtime_env: str) -> dict:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Runtime Environment: {runtime_env}\nLog Payload:\n{raw_log}"}
    ]

    response = client.chat_completion(
       messages=messages,
       response_format={
          "type": "json_schema",
        "json_schema":{
            "name": "TriageResponse",
            "schema": TriageResponse.model_json_schema()
        }
    },
    max_tokens=1200,
    temperature=0.1
)
    return json.loads(response.choices[0].message.content)f