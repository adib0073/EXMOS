from typing import List, Union
from fastapi import FastAPI, Query
from utils import *
from data_model import *
from constants import *
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
# fix ObjectId & FastApi conflict
import pydantic
from bson.objectid import ObjectId
pydantic.json.ENCODERS_BY_TYPE[ObjectId]=str

app = FastAPI()
origins = ["*"]

# Enable CORS in FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def get_root():

	return {'message': 'Welcome to Diabetes Detection API'}



@app.get("/train")
async def train_model():
	x_data, y_data = load_training_data()
	message = training_model(x_data, y_data)

	response = { 
		"StatusCode": 1,
		"StatusMessage": message,
		}

	return response

@app.get("/checkmissingvalues")
async def check_missing_values():
	status_code = 0
	status_message = "Pending execution"
	data, labels = load_training_data()
	checker = detect_missing_values(data)

	if checker:
		status_code = 1
		status_message = "Missing values detected"	
	else:
		status_code = 0
		status_message = "Missing Values not found"	
	
	response = { 
		"StatusCode": status_code,
		"StatusMessage": status_message,
		}

	return response

@app.get("/checkduplicates")
async def check_duplicates():
	status_code = 0
	status_message = "Pending execution"
	data, labels = load_training_data()
	checker = detect_duplicates(data)

	if checker:
		status_code = 1
		status_message = "Data duplicates found"	
	else:
		status_code = 0
		status_message = "Data duplicates not found"	
	
	response = { 
		"StatusCode": status_code,
		"StatusMessage": status_message,
		}

	return response	

@app.get("/checkoutliers")
async def check_outliers():
	status_code = 0
	status_message = "Pending execution"
	data, labels = load_training_data()
	checker = detect_outliers(data, list(data.columns))

	if checker:
		status_code = 1
		status_message = "Outliers found"	
	else:
		status_code = 0
		status_message = "Outliers not found"	
	
	response = { 
		"StatusCode": status_code,
		"StatusMessage": status_message,
		}

	return response

@app.post("/filterfeatures", response_model=OutputDataModel)
async def retrain_filtered_features(features: FeaturesToInclude):

	data, labels = load_training_data()
	status_code, status_message = retrain_selected_features(data, labels, features.features_to_include)

	response = {
		"StatusCode": status_code,
		"StatusMessage": status_message
	}
	return response


@app.post("/filterfeatureranges", response_model=OutputDataModel)
async def filter_feature_ranges(features: FeatureRanges):

	data, labels = load_training_data(features.features_ranges)
	
	status_code, status_message = retrain_selected_features(data, labels, features.features_to_include)

	response = {
		"StatusCode": status_code,
		"StatusMessage": status_message
	}
	return response

@app.post("/validateusers", response_model=OutputwithPayloadDataModel)
async def validate_user(user: ValidateUserModel):

	# Call method to validate user
	code, message, output_json = login_service(user.UserId, user.Cohort)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json
	}
	return response