FROM python:3.10-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev curl && \
    rm -rf /var/lib/apt/lists/*

# Create and set working directory
WORKDIR /app

# Install application code
COPY . .

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:$PORT/api/health || exit 1

# Run application with uvicorn
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT