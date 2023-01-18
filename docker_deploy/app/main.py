from typing import List, Union
from fastapi import FastAPI, Query
from utils import *
from data_model import *

app = FastAPI()

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
	print(features.features_to_include)
	status_code, status_message = retrain_selected_features(data, labels, features.features_to_include)

	response = {
		"StatusCode": status_code,
		"StatusMessage": status_message
	}
	return response


@app.post("/filterfeatureranges", response_model=OutputDataModel)
async def filter_feature_ranges(features: FeaturesToInclude):

	data, labels = load_training_data()
	print(features.features_to_include)
	status_code, status_message = retrain_selected_features(data, labels, features.features_to_include)

	response = {
		"StatusCode": status_code,
		"StatusMessage": status_message
	}
	return response