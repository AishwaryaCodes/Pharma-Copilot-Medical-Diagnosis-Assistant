**Doctors often struggle to quickly analyze detailed medical reports, reference similar past cases, and provide multi-specialist insights during diagnosis. This can lead to delays, oversight, or repetitive work, especially in high-pressure clinical environments.**
--- Pharma Copilot addresses this by offering an AI-powered assistant that streamlines diagnosis, retrieves similar past cases, and simulates analysis from cardiologist, pulmonologist, and psychologist perspectives, all in one place.

---

## Core Functionalities for Doctors:
1) **Enter Patient Details**
- Add patient name, age, and medical report
  
2) **AI Diagnosis via Specialist Agents**
- Uses Cardiologist, Pulmonologist, and Psychologist agents
- Agents analyze the report using vector similarity and provide health condition assessments
  
3) **Semantic Search Using FAISS**
- Embeds medical reports using SentenceTransformer
- Searches similar past cases to assist in diagnosis recommendations
  
4) **Diagnosis History Viewer**
- Automatically stores all diagnosis records
- Searchable and filterable diagnosis history by name or report
- Pagination for easy navigation
- Doctors can edit or delete past records if needed
  
5) **LLM-Ready Architecture**
- Backend designed to easily plug in Hugging Face or OpenAI models for advanced explanations or treatment suggestions

---

## Tech Stack

###  Backend
- **FastAPI** – Lightning-fast web API for Python
- **SQLAlchemy + SQLite** – ORM and lightweight database
- **Sentence Transformers + FAISS** – For semantic similarity search in diagnosis history
- **Hugging Face Transformers** – (LLM integration for future reasoning and explanation)
- **Pydantic** – Data validation
- **python-dotenv** – Secure environment variable management
- **Uvicorn** – ASGI server for running FastAPI

###  Frontend
- **React (Vite)** – Fast SPA frontend
- **Tailwind CSS** – Utility-first styling
- **DaisyUI** – Styled UI components + Toasts
- **React Router** – For page routing

---

##  Screenshots

###  1. Enter Patient Details  
Form where doctors input the patient's name, age, and medical report to begin diagnosis.

<img src="https://github.com/user-attachments/assets/2765c2a5-2fb2-4140-9e5b-4923b2ca3b4f" width="600"/>

---

###  2. AI Diagnosis Loading Indicator  
Animated loader indicating that the AI agents are processing the input.

<img src="https://github.com/user-attachments/assets/8361492c-9207-499f-b6a9-e6ceb54560e1" width="600"/>

---

###  3. Diagnosis Results (Accordion View)  
All AI agent responses (Cardiologist, Pulmonologist, Psychologist) are grouped into collapsible sections for clarity.

<img src="https://github.com/user-attachments/assets/29c1a629-c7b0-4e56-a8d1-1cd072609e0d" width="600"/>

---

###  4. Expanded Cardiologist Report  
Example of an expanded specialist report providing detailed diagnosis.

<img src="https://github.com/user-attachments/assets/f0a0923e-dd19-423d-9937-0def0faff5e3" width="600"/>

---

### 5. Diagnosis History with Pagination  
Doctors can view past records with full history, pagination, search, and action buttons.

<img src="https://github.com/user-attachments/assets/9778572f-54c1-419b-ba54-26b292b98182" width="600"/>

---

###  6. View Full Report in Modal  
Modal showing complete patient details and diagnosis when the user clicks the "edit" or "view" button.

<img src="https://github.com/user-attachments/assets/b123cd9b-a5f2-4e67-a92c-cf9cf6c72b9d" width="600"/>


--- 

## Installation 

```
git clone https://github.com/your-username/pharma-copilot.git
cd pharma-copilot
```

### Backend Setup (FastAPI)
```
cd backend
python -m venv venv
venv\Scripts\activate         
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

### Frontend Setup (React + Vite)
```
cd frontend/vite-project
npm install
npm run dev
```

---

## Future Scope

 1) Authentication – Add Doctor/Patient login and role-based access

 2) Advanced LLM Agents – Plug HuggingFace / OpenAI agents for deeper diagnosis explanation

 3) Export Features – Export reports as PDF/CSV for offline storage

 4) Multiple Specializations – Add more specialist agents (e.g., Neurologist, Orthopedist)

 5) Analytics Dashboard – Show diagnosis trends and patient recovery stats


---

Thanks <br>
-akundur17@gmail.com 


