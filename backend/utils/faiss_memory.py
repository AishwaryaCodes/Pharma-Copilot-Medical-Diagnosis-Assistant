from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
import pickle

# Load once globally
model = SentenceTransformer("all-MiniLM-L6-v2")

# Simulated past diagnoses (replace this with DB fetch)
sample_reports = [
    "Patient experienced chest pain and shortness of breath.",
    "Mild fever with nasal congestion and headache.",
    "Palpitations noted during exertion.",
    "Persistent cough and wheezing over 2 weeks.",
    "Severe anxiety and insomnia reported."
]

def create_faiss_index(reports):
    embeddings = model.encode(reports)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(np.array(embeddings))

    # Save both index and text mappings
   
    faiss.write_index(index, "backend/utils/faiss_index.bin")
    
    with open("backend/utils/report_texts.pkl", "wb") as f:
        pickle.dump(reports, f)

    print(" FAISS index and texts saved.")

if __name__ == "__main__":
    create_faiss_index(sample_reports)


def search_similar_cases(new_report: str, k: int = 3):
    # Load saved index
    index = faiss.read_index("backend/utils/faiss_index.bin")
    with open("backend/utils/report_texts.pkl", "rb") as f:
        report_texts = pickle.load(f)

    # Encode new report
    new_embedding = model.encode([new_report])
    
    # Search top-k similar reports
    distances, indices = index.search(np.array(new_embedding), k)
    similar = [report_texts[i] for i in indices[0]]

    return similar
