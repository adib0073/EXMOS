'''
All utility functions for training and inference
'''

from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import pandas as pd
import numpy as np


def outlier_thresholds(dataframe, col_name, q1=0.05, q3=0.95):
    quartile1 = dataframe[col_name].quantile(q1)
    quartile3 = dataframe[col_name].quantile(q3)
    interquantile_range = quartile3 - quartile1
    up_limit = quartile3 + 1.5 * interquantile_range
    low_limit = quartile1 - 1.5 * interquantile_range
    return low_limit, up_limit

def feature_wise_outlier(dataframe, col_name):
    low_limit, up_limit = outlier_thresholds(dataframe, col_name)
    if dataframe[(dataframe[col_name] > up_limit) | (dataframe[col_name] < low_limit)].any(axis=None):
        return True
    else:
        return False

def detect_outliers(data, features):
    outliers = []
    for f in features:
        outliers.append(feature_wise_outlier(data, features))
    return np.array(outliers).any()

def remove_outliers():
    pass

def detect_missing_values(data):
    return data.isnull().sum().any()


def remove_missing_values():
    pass

def detect_duplicates(data):
    return data.duplicated().any()

def remove_duplicates():
    pass

def detect_correlation():
    pass

def normalize_data():
    pass


def load_training_data():
    data = pd.read_csv("data/training_data.csv")
    x_data = data.drop(["Outcome"],axis='columns')
    y_data = data.filter(["Outcome"],axis='columns')

    return x_data, y_data

def load_test_data():
    data = pd.read_csv("data/test_data.csv")
    x_data = data.drop(["Outcome"],axis='columns')
    y_data = data.filter(["Outcome"],axis='columns')

    return x_data, y_data

def training_model(x_data, y_data):

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
