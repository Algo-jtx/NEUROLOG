from pydantic import BaseModel
from typing import List, Optional

class TriageRequest(BaseModel):
    raw_log: str
    runtime_env: Optional[str] = "Python 3.12"

class PlaybookStep(BaseModel):
    step_number: str
    title: str
    command: str
    description: str

class TriageResponse(BaseModel):
    severity: str
    error_type: str
    error_message: str
    confidence: str
    isolated_file: str
    isolated_line: int
    code_snippet: List[str]
    root_cause: str
    playbook_steps: List[PlaybookStep]