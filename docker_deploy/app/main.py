from fastapi import FastAPI
from utils import *

import sklearn
from sklearn.model_selection import train_test_split
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score

import pandas as pd

app = FastAPI()

@app.get('/')
def get_root():

	return {'message': 'Welcome to Diabetes Detection API'}



def training_model():
	data = pd.read_csv("data/training_data.csv")
	x_data = data.drop(["Outcome"],axis='columns')
	y_data = data.filter(["Outcome"],axis='columns')
	
	numeric_transformer = Pipeline(steps=[('scaler', StandardScaler())])
	column_transformer = ColumnTransformer(transformers=[
		('numerical', numeric_transformer, list(x_data.columns)),
        ])
	clf = Pipeline(steps=[('preprocessor', column_transformer),
                      ('classifier', RandomForestClassifier(n_estimators=300,
                                                            random_state=123))])
	model = clf.fit(x_data, y_data)
	acc = 100 * model.score(x_data, y_data)
	
	return acc

@app.get("/train")
async def train_model():

		message = training_model()

		response = { 
			"StatusCode": 1,
			"StatusMessage": message,
			}

		return response