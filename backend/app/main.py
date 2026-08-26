import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

from app.schemas import TriageRequest, TriageResponse
from app.core.ai_engine import process_log_triage 
app = FastAPI(title="Neurolog Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("api/triage", response_model=TriageResponse)
async def triage_log(payload: TriageRequest):
    if not payload.raw_log.strip():
        raise HTTPException(status_code=400, detail="Empty log input stream.")
        try:
            result = process_log_triage(payload.raw_log, payload.runtime_env)
            return result
            except Exception as e:
                raise HTTPException(status_code=500, detail="Triage engine failure: {str(e)}")            