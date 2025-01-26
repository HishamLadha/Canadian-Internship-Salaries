from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Pydantic model for the request body
class PostRequest(BaseModel):
    name: str
    address: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/test")
def read_test():
    return {"helloooooo"}

@app.post("/posting")
def post_test(request: PostRequest):
    return {
        "message": "Received successfully",
        "data": {
            "name": request.name,
            "address": request.address
        },
    }