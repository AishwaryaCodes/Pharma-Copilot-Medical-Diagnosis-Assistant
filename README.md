

Problem Statement : Patients often visit multiple specialists and receive separate reports that are hard to consolidate. 
Doctors need a quick and reliable way to synthesize all specialist insights and form a unified diagnosis.

This project solves that by:
  1. Letting three AI agents (Cardiologist, Psychologist, Pulmonologist) review a patient report.

  2. Returning a final AI-generated multidisciplinary diagnosis.

  3. Storing results and patient data for future access.

---

## Folder Structure 

```
PharmaCopilot/
│
├── backend/
│   ├── main.py                      # FastAPI entry point
│   ├── create_db.py                 # Script to create DB tables
│
│   ├── db/
│   │   ├── database.py              # SQLAlchemy engine/session
│   │   ├── models.py                # SQLAlchemy DB models
│   │   └── schemas.py               # Pydantic schemas for API
│
│   ├── routes/
│   │   └── diagnosis.py             # POST /diagnose API logic
│
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── cardiologist.py
│   │   ├── psychologist.py
│   │   ├── pulmonologist.py
│   │   └── team_diagnosis.py       # Final unified decision agent
│
│   ├── services/
│   │   └── diagnosis_pipeline.py   # Coordinates all agents
│
│   ├── utils/
│   │   └── llm_loader.py           # Loads HF model safely
│
│   └── llm/
│       └── hf_client.py            # Reusable HuggingFace client wrapper
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── pages/
│       │   └── Home.jsx            # Diagnosis input form
│       ├── components/
│       ├── App.jsx
│       └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .env                            # HF token + DB URL
├── requirements.txt                # Python dependencies
├── package.json                    # React dependencies
├── docker-compose.yml              # 🐳 Multi-service container
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md

```
