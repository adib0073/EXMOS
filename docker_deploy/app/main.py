from fastapi import FastAPIy
from utils import *

app = FastAPI()

@app.get('/')
def get_root():

	return {'message': 'Welcome to Diabetes Detection API'}

@app.get("/train")
async def train_model():

    pred_value, pred_class = apply_model(model, inference_data)

    response = {
        "StatusCode": pred_value,
        "StatusMessage": pred_class
    }
    return response