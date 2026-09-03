from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import TriageRequest, TriageResponse
from app.core.ai_engine import process_log_triage

app = FastAPI(title="Neurolog Engine", version="0.1.0")

# Allow the Next.js frontend to communicate with the FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/triage", response_model=TriageResponse)
async def triage_log(payload: TriageRequest):
    if not payload.raw_log.strip():
        raise HTTPException(status_code=400, detail="Empty log input stream.")

    try:
        result = process_log_triage(payload.raw_log, payload.runtime_env)

        if not result:
            raise HTTPException(
                status_code=500,
                detail="AI Engine returned empty output."
            )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))