

Problem Statement : Patients often visit multiple specialists and receive separate reports that are hard to consolidate. 
Doctors need a quick and reliable way to synthesize all specialist insights and form a unified diagnosis.

This project solves that by:
  1. Letting three AI agents (Cardiologist, Psychologist, Pulmonologist) review a patient report.

  2. Returning a final AI-generated multidisciplinary diagnosis.

  3. Storing results and patient data for future access.

---

## Folder Structure 

```
neurocare-ai/
│
├── backend/
│   ├── main.py
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── cardiologist.py
│   │   ├── psychologist.py
│   │   ├── pulmonologist.py
│   │   └── team_diagnosis.py
│   ├── models/
│   │   └── report.py
│   ├── routes/
│   │   └── diagnosis.py
│   ├── db/
│   │   ├── database.py
│   │   └── schemas.py
│   └── utils/
│       └── inference_client.py
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Report.jsx
│       └── components/
│           └── Layout.jsx
│       ├── App.jsx
│       └── main.jsx
│
├── .env
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md


```
