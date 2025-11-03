# 🩺 Pharma Copilot — AI-Powered Diagnostic Assistant for Doctors

**Doctors often struggle to quickly analyze detailed medical reports, reference similar past cases, and provide multi-specialist insights during diagnosis.**  
Pharma Copilot solves this by offering an AI-powered assistant that streamlines diagnosis, retrieves similar past cases, and simulates analysis from **Cardiologist**, **Pulmonologist**, and **Psychologist** perspectives — all in one interface.

---

## 🚀 Core Functionalities

1️⃣ **Enter Patient Details**  
- Input patient name, age, and medical report  
- Upload attachments (images, PDFs, or DOCX)

2️⃣ **AI Diagnosis via Specialist Agents**  
- Cardiologist, Pulmonologist, and Psychologist agents analyze reports  
- Multi-specialist outputs merged into a single summary  

3️⃣ **Semantic Search Using FAISS**  
- SentenceTransformer + FAISS for vector-based similarity  
- Finds similar past cases for faster, more accurate insights  

4️⃣ **Diagnosis History Viewer**  
- Auto-saves every diagnosis with pagination and search  
- Doctors can edit or delete past records  

5️⃣ **LLM-Ready Architecture**  
- Backend ready for Hugging Face / OpenAI integration  
- Enables deeper reasoning, explanations, and treatment suggestions

---

## ⚙️ Tech Stack

### 🧠 Backend
- **FastAPI**, **SQLAlchemy + SQLite**
- **Sentence Transformers + FAISS**
- **Hugging Face Transformers**
- **Pydantic**, **python-dotenv**, **Uvicorn**

### 💻 Frontend
- **React (Vite)**, **Tailwind CSS**, **DaisyUI**
- **React Router**

---

## 🖼️ Screenshots

> All screenshots below are sized consistently for a clean README.

### 1️⃣ Create Account / Login  
Doctors register and sign in securely.  

<img src="https://github.com/user-attachments/assets/17a8fd0c-7ddb-402a-bb7c-bf1307951311" width="700" alt="Pharma Copilot UI Screenshot" />
<br/>

<img src="https://github.com/user-attachments/assets/4290f9dc-ffd6-4fe5-a8ec-2df7098c07cb" width="700" alt="Login screen" />

---

### 2️⃣ Doctor Dashboard – Overview  
Shows total patients, AI turnaround time, success rate, and recent diagnoses.  

<img src="https://github.com/user-attachments/assets/db9be141-5dff-43de-b384-f99e6d23f715" width="700" alt="Dashboard KPIs" />
<br/>

<img src="https://github.com/user-attachments/assets/71626ab1-a579-44cf-ada6-4d74c0b34cf4" width="700" alt="Dashboard insights widgets" />

---

### 3️⃣ Diagnosis History – Search + Pagination  
Search and manage all past diagnoses, edit / delete / re-analyze.  

<img src="https://github.com/user-attachments/assets/218868d6-a2dd-4706-b9cb-70e154898af0" width="700" alt="Diagnosis history table with pagination" />

---

### 4️⃣ Create New Diagnosis  
Enter patient details, attach reports, and run AI diagnosis.  

<img src="https://github.com/user-attachments/assets/8cee2ee8-5599-46a0-8921-aa03a5e8b2f6" width="700" alt="New diagnosis form" />
<br/>

<img src="https://github.com/user-attachments/assets/6df349d5-30e4-4c69-86a7-8f22eb516eab" width="700" alt="New diagnosis compact layout" />

---

### 5️⃣ Diagnosis Processing + Agent Results  
Shows progress indicators and detailed results from multiple specialists.  

<img src="https://github.com/user-attachments/assets/83e0486c-d90a-4af8-9b11-ecb522035e29" width="700" alt="Specialist agent results" />

---

### 6️⃣ Final AI Diagnosis Summary  
Displays overall AI-generated assessment and case statistics.  

<img src="https://github.com/user-attachments/assets/7f594b98-c83b-4ac3-859f-19d269a625e0" width="700" alt="Final diagnosis summary" />

---

### 7️⃣ Doctor Profile Page  
View or update doctor information and linked hospital.  

<img src="https://github.com/user-attachments/assets/9b59684d-5ca8-4af3-aecf-cae2e949b870" width="700" alt="Doctor profile page" />

---

### 8️⃣ Similar Cases  
Semantic search surfaces related past cases to assist diagnosis.  

<img src="https://github.com/user-attachments/assets/94cc43c9-9a07-456a-a82b-40267d788ba3" width="700" alt="Similar cases panel" />

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
cd ..
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
