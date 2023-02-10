'''
All utility functions for training and inference
'''

from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import pandas as pd
import numpy as np
from constants import *
from dbconnectors import get_database


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


def load_training_data(filters = None):
    data = pd.read_csv("data/training_data.csv")
    if filters is not None:
        for i in range(len(DEFAULT_VALUES)):
            data = data[(data[ALL_FEATURES[i]] >= filters[i][0]) & (data[ALL_FEATURES[i]] <= filters[i][1])]


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
    x_test, y_test = load_test_data()
    acc = 100 * model.score(x_data, y_data)
    test_acc = 100 * model.score(x_test, y_test)

    return f"Training Accuracy: {acc}; Test Accuracy {test_acc}"

def retrain_selected_features(x_data, y_data, features_to_include):

    if features_to_include is not None or len(features_to_include) > 0:
        x_data = x_data[features_to_include]
    numeric_transformer = Pipeline(steps=[('scaler', StandardScaler())])
    column_transformer = ColumnTransformer(transformers=[
        ('numerical', numeric_transformer, list(x_data.columns)),
        ])
    clf = Pipeline(steps=[('preprocessor', column_transformer),
                        ('classifier', RandomForestClassifier(n_estimators=300,
                                                            random_state=123))])
    model = clf.fit(x_data, y_data)
    x_test, y_test = load_test_data()
    acc = 100 * model.score(x_data, y_data)
    test_acc = 100 * model.score(x_test, y_test)

    return 1, f"Training Accuracy: {acc}; Test Accuracy {test_acc}"


def get_default_feature_values():
    data, _ = load_training_data()
    feature_bounds = []
    for feature in ALL_FEATURES:
        min_val = np.min(data[feature])
        max_val = np.max(data[feature])
        feature_bounds.append([feature, (min_val, max_val)])
    # Output: "[['Pregnancies', (0, 15)], ['Glucose', (0, 199)], ['BloodPressure', (0, 122)], ['SkinThickness', (0, 99)], ['Insulin', (0, 846)], ['BMI', (0.0, 67.1)], ['DiabetesPedigreeFunction', (0.078, 2.329)], ['Age', (21, 81)]]"
    return feature_bounds


def login_service(user_name, cohort):
    """
    Method to relieve user details if exists
    or create a new user if doesn't exist
    """
    client, db = get_database()
    collection_name = db[USER_COLLECTION]
    user_details = collection_name.find_one({"UserName" : user_name})
    
    # TO-DO: find and update last login time
    if  user_details is None:
        print("Record Not Found")
        new_user = USER_DETAIL_JSON
        new_user["UserName"] = user_name
        new_user["Cohort"] = cohort
        collection_name.insert_one(new_user)
        user_details = collection_name.find_one({"UserName" : user_name})
        client.close()
        return (True, f"New record created for user: {user_name}", user_details)
    else:
        print("Record found")
        client.close()
        return (True, f"Record found for user: {user_name}", user_details)

def data_summary_viz(user):
    """
    Fetch Data Summary Viz 
    """
    client, db = get_database()
    collection_name = db[USER_COLLECTION]
    user_details = collection_name.find_one({"UserName" : user})
    client.close()
    if  user_details is None:
        return (False, f"Invalid username: {user}", user_details)
    else:
        # TO-DO - Load Filters and Filter Data
        data, labels = load_training_data()
        output_json = {}
        for feat in ALL_FEATURES:
            output_json[feat] = {
                "name" : feat,                
                "description" : user_details[feat]["Description"],
                "unit" : user_details[feat]["Unit"],
                "ydata" : np.histogram(data[feat].tolist(), bins=30)[0].tolist(),
                "xdata" : np.histogram(data[feat].tolist(), bins=30)[1].tolist(),
                "upperLimit" : user_details[feat]["UpperLimit"],
                "lowerLimit" : user_details[feat]["LowerLimit"],
                "average" : np.round(np.mean(data[feat].values),1),
                "isSelected" : user_details[feat]["Selected"],           
            }
        return (True, f"Successful. Data summary details founde for user: {user}", output_json)




