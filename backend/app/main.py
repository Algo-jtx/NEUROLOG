from fastapi import FastAPI, HTTPException
from app.schemas import TriageRequest, TriageResponse
from app.core.ai_engine import process_log_triage

app = FastAPI(title="Neurolog Engine", version="0.1.0")

@app.post("/api/triage", response_model=TriageResponse)
async def triage_log(payload: TriageRequest):
    if not payload.raw_log.strip():
        raise HTTPException(status_code=400, detail="Empty log input stream.")
    
    try:
        result = process_log_triage(payload.raw_log, payload.runtime_env)
        if not result:
            raise HTTPException(status_code=500, detail="AI Engine returned empty output.")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))