FROM python:3.10-slim

WORKDIR /app/backend

COPY backend/ /app/backend
COPY backend/requirements.txt /app/backend/requirements.txt
COPY pharma.db /app/pharma.db

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
