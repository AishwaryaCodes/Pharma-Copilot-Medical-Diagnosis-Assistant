from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
import pickle

# Load once globally - Load the pretrained SentenceTransformer model 
# model turns medical text into a numerical embedding 
model = SentenceTransformer("all-MiniLM-L6-v2")

def create_faiss_index(reports: list[str]):
    embeddings = model.encode(reports)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))

    faiss.write_index(index, "backend/utils/faiss_index.bin")
    with open("backend/utils/report_texts.pkl", "wb") as f:
        pickle.dump(reports, f)

    print("✅ FAISS index created and saved.")

def search_similar_cases(new_report: str, k: int = 3):
    # Step 1: Load saved FAISS index and report text mappings
    index = faiss.read_index("backend/utils/faiss_index.bin")
    
    with open("backend/utils/report_texts.pkl", "rb") as f:
        report_texts = pickle.load(f)

    # Step 2: Convert the new medical report to an embedding vector
    new_embedding = model.encode([new_report])
    
    # Step 3: Search the FAISS index for top-k most similar cases
    distances, indices = index.search(np.array(new_embedding), k)
    
    # Step 4: Retrieve the original text of the similar reports
    return [report_texts[i] for i in indices[0]]


