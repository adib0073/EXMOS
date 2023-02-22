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
from dbconnectors import get_database, fetch_user_details, update_user_details


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


def load_training_data(filters = None, selected_features = None):
    data = pd.read_csv("data/training_data.csv")
    if filters is not None:
        for i in range(len(DEFAULT_VALUES)):
            data = data[(data[ALL_FEATURES[i]] >= filters[i][0]) & (data[ALL_FEATURES[i]] <= filters[i][1])]

    x_data = data.drop(["Outcome"],axis='columns')
    y_data = data.filter(["Outcome"],axis='columns')

    if selected_features is not None and len(selected_features) > 0:
        x_data = x_data[selected_features]

    return x_data, y_data

def load_test_data(selected_features = None):
    data = pd.read_csv("data/test_data.csv")
    x_data = data.drop(["Outcome"],axis='columns')
    y_data = data.filter(["Outcome"],axis='columns')
    if selected_features is not None and len(selected_features) > 0:
        x_data = x_data[selected_features]

    return x_data, y_data

def training_model(x_data, y_data, selected_features = None):

    numeric_transformer = Pipeline(steps=[('scaler', StandardScaler())])
    column_transformer = ColumnTransformer(transformers=[
        ('numerical', numeric_transformer, list(x_data.columns)),
        ])
    clf = Pipeline(steps=[('preprocessor', column_transformer),
                        ('classifier', RandomForestClassifier(n_estimators=300,
                                                            random_state=123))])
    model = clf.fit(x_data, y_data)
    x_test, y_test = load_test_data(selected_features)
    acc = 100 * model.score(x_data, y_data)
    test_acc = 100 * model.score(x_test, y_test)

    return acc, test_acc

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

def prepare_user_data(user):
    """
    Fetch Data Summary Viz 
    """
    client, user_details = fetch_user_details(user)
    client.close()
    if  user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    # Load Filters and Filter Data
    filters, selected_features, data, labels = load_filtered_user_data(user_details)
    # Load unfiltered data
    unfiltered_data, _ = load_training_data(filters)

    output_json = {}
    for feat in ALL_FEATURES:
        if feat not in selected_features:
            y_val = np.histogram(unfiltered_data[feat].tolist(), bins=30)[0].tolist()
            x_val = np.histogram(unfiltered_data[feat].tolist(), bins=30)[0].tolist()
            avg = np.round(np.mean(unfiltered_data[feat].values),1)
        else:
            y_val = np.histogram(data[feat].tolist(), bins=30)[0].tolist()
            x_val = np.histogram(data[feat].tolist(), bins=30)[1].tolist()
            avg = np.round(np.mean(data[feat].values),1)

        output_json[feat] = {
            "name" : feat,                
            "description" : user_details[feat]["description"],
            "unit" : user_details[feat]["unit"],
            "ydata" : y_val,
            "xdata" : x_val,
            "upperLimit" : user_details[feat]["upperLimit"],
            "lowerLimit" : user_details[feat]["lowerLimit"],
            "average" : avg,
            "isSelected" : user_details[feat]["isSelected"],  
            # Add defaults
            "defaultUpperLimit" : user_details[feat]["defaultUpperLimit"],
            "defaultLowerLimit" : user_details[feat]["defaultLowerLimit"],         
        }
    # Add additional details for target variable
    diabetic_count = len(labels[labels[TARGET_VARIABLE] == 1])
    dc_pct = np.round(100 * (diabetic_count/(len(labels))), 0)

    output_json['target'] = {
        "name" : "Diabetes Status",
        "categories" : ["Diabetic", "Non-diabetic"],
        "category_ratio" : [dc_pct, 100 - dc_pct],
        "isSelected" : True
    }

    return (True, f"Successful. Data summary details founde for user: {user}", output_json)

def load_filtered_user_data(user_details):
    selected_features = []
    filters = []
    for feature in ALL_FEATURES:
        filters.append((user_details[feature]["lowerLimit"], user_details[feature]["upperLimit"]))
        if user_details[feature]["isSelected"]:
            selected_features.append(feature)
            
    # fetch data
    data, labels = load_training_data(filters, selected_features)
    return filters, selected_features, data, labels

def generate_pred_chart_data(user):
    """
    # get data filter settings
	# apply filters and retrain and generate new stats - update previous and new accuracy in mongo data
    """
    client, user_details = fetch_user_details(user)
    client.close()
    if  user_details is None:
        return (False, f"Invalid username: {user}", user_details)
    else:
        filters, selected_features, data, labels = load_filtered_user_data(user_details)
        # train model
        train_score, test_score = training_model(data, labels, selected_features)
        # generate test accuracy
        prev_score = user_details["CurrentScore"]
        
        # calc score change
        score_change = 0
        if prev_score is None:
            score_change = 0
        else:
            score_change = test_score - prev_score
            # Update new accuracy
            # update_user_details(user, {"CurrentScore" : test_score})

        output_json = {
            "Accuracy" : np.ceil(test_score),
            "NumSamples" : data.shape[0],
            "NumFeatures" : data.shape[1],
            "ScoreChange" : np.ceil(score_change)
        }

        return (True, f"Successful. Data summary details founde for user: {user}", output_json)



def key_insights_gen(user):
    """
    Method to generate insights
    """
    client, user_details = fetch_user_details(user)
    client.close()
    if  user_details is None:
        return (False, f"Invalid username: {user}", user_details)
    
    filters, selected_features, data, labels = load_filtered_user_data(user_details)
    # Diabetic ratio
    xy_data = data.copy()
    xy_data['target'] = labels
    pct_list = []
    input_list = []
    insight_list = []
    diabetic_count = len(xy_data[xy_data['target'] == 1])
    dc_pct = np.round(100 * (diabetic_count/(len(xy_data))), 0)
    pct_list.append(dc_pct)
    input_list.append("Patients have ")
    insight_list.append("diabetes")
    # Zero Counts insights
    for feat in ACTIONABLE_FEATURES:
        if feat not in selected_features:
            continue # Skip for filtered features
        zero_counts_pct = np.round(100 * (len(data[data[feat] == 0.0])/len(data)), 0)
        pct_list.append(zero_counts_pct)
        input_list.append(f"{FRIENDLY_NAMES[feat]} feature has ")
        insight_list.append("value equal to zero")
        # 90th and 10th Percentile Insights
        # Greater than
        qv = np.round(data[feat].quantile(0.9), 1)
        qvc_pct = np.round(100 * (len(data[data[feat] > qv])/len(data)), 0)
        pct_list.append(qvc_pct)
        input_list.append(f"Patients have {FRIENDLY_NAMES[feat]} ")
        insight_list.append(f"greater than {qv}")
        # Lesser than
        qv = np.round(data[feat].quantile(0.1), 1)
        qvc_pct = np.round(100 * (len(data[data[feat] < qv])/len(data)), 0)
        pct_list.append(qvc_pct)
        input_list.append(f"Patients have {FRIENDLY_NAMES[feat]} ")
        insight_list.append(f"lesser than {qv}")
    
    # Sorting in a dataframe
    ki_df = pd.DataFrame()
    ki_df['pct'] = pct_list
    ki_df['input'] = input_list
    ki_df['insight'] = insight_list
    ki_df = ki_df.sort_values(by=['pct'], ascending=False).head(4)


    insights = {
			"pct_list" : ki_df['pct'].tolist(),
			"input_list" : ki_df["input"].tolist(),
			"insight_list" : ki_df["insight"].tolist()
		    }
    return (True, f"Successful. Data summary details founde for user: {user}", insights)


def retrain_config_data(config_data):
    user = config_data.UserId
    # Update records
    for feature in ALL_FEATURES:
        updated_feature = config_data.JsonData[feature]
        for unwanted_val in ["xdata", "ydata", "average"]:
            del updated_feature[unwanted_val]
        update_user_details(user, {feature : updated_feature})
    # re-train model with updated data
    client, user_details = fetch_user_details(user)
    client.close()
    if  user_details is None:
        return (False, f"Invalid username: {user}", user_details)
    filters, selected_features, data, labels = load_filtered_user_data(user_details)
    # train model
    train_score, test_score = training_model(data, labels, selected_features)
    update_user_details(user, {"CurrentScore" : test_score})

    return (True, f"Success. New score is :{test_score}", user_details)

