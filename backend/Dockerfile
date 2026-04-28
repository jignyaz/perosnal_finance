# Use an official Python runtime as a parent image
FROM python:3.11-slim
# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV TF_CPP_MIN_LOG_LEVEL 2
# Set work directory
WORKDIR /app
# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*
# Install Python dependencies
COPY requirements_cloud.txt .
RUN pip install --no-cache-dir -r requirements_cloud.txt
# Copy project files
COPY . .
# Expose port
EXPOSE 8000
# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]