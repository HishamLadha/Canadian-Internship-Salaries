# Use the official python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy the requirements.txt
COPY requirements.txt .

# Install the dependencies
RUN pip install -r requirements.txt

# Copy the rest of the files
COPY . .

# Expose the port that FastAPI is running on
EXPOSE 8000

# Run the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]