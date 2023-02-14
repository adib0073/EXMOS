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


@app.get("/getpredchartvalues/", response_model=OutputwithPayloadDataModel)
async def GetPredictedChartValues(user: str):

	# Call method to get prediction chart value
	code, message, output_json = generate_pred_chart_data(user)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json
		}

	return response

@app.get("/getdatasummaryvalues/", response_model=OutputwithPayloadDataModel)
async def GetDataSummaryValues(user: str):
	# Call method to get data summary value for user
	code, message, output_json = data_summary_viz(user)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json
	}
	return response

@app.get("/getdataquality/", response_model=OutputwithPayloadDataModel)
async def GetDataQuality(user: str):
	# Call method to get data quality value for user
	# code, message, output_json = data_summary_viz(user)

	response = {
		"StatusCode": True,
		"StatusMessage": f"Data quality fetched for user: {user}",
		"OutputJson": {
			"score" : 0.55,
			"quality_class" : "Poor",
			"issues" : ["class imbalance", "outliers", "feature correlation", "data redundancy", "data drift", "data leakage"],
			"issue_val" : [5, 0.2, 2, 0.5, 3, 1]
		}
	}
	return response

@app.get("/getkeyinsights/", response_model=OutputwithPayloadDataModel)
async def GetKeyInsights(user: str):
	# Call method to get data quality value for user
	# code, message, output_json = key_insights_gen(user)

	response = {
		"StatusCode": True,
		"StatusMessage": f"Key Inights fetched for user: {user}",
		"OutputJson": {
			"pct_list" : [71, 52, 39, 29],
			"input_list" : ["Insulin feature has ", "Diabetic patients have ", "Non-diabetic patients have ", "Diabetic patients have "],
			"insight_list" : ["value equal to zero", "BMI more than 25", "diabetes pedigree function less than 0.5", "blood pressure more than 80"]
		}
	}
	return response