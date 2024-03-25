'''
All utility functions for training and inference
'''
import re
import logging
from datetime import datetime
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import pandas as pd
import numpy as np
from constants import *
from dbconnectors import *
from evidently.metrics import DataDriftTable
from evidently.report import Report
import json
import xgboost
import shap
import six
import sys
sys.modules['sklearn.externals.six'] = six
from skrules import SkopeRules
from imblearn.over_sampling import SMOTE


def outlier_thresholds(dataframe, col_name, q1=0.05, q3=0.95):
    quartile1 = dataframe[col_name].quantile(q1)
    quartile3 = dataframe[col_name].quantile(q3)
    interquantile_range = quartile3 - quartile1
    up_limit = quartile3 + 1.5 * interquantile_range
    low_limit = quartile1 - 1.5 * interquantile_range
    # Correct Thresholds
    low_limit = max(low_limit, min(dataframe[col_name].to_list()))
    up_limit = min(up_limit,  max(dataframe[col_name].to_list()))
    # Add extreme values check
    if NON_EXTREME_VALUES[col_name][0] != -1 and NON_EXTREME_VALUES[col_name][0] > low_limit:
        low_limit = NON_EXTREME_VALUES[col_name][0]

    if NON_EXTREME_VALUES[col_name][1] != -1 and NON_EXTREME_VALUES[col_name][1] < up_limit:
        up_limit = NON_EXTREME_VALUES[col_name][1]

    # logging.error(col_name)
    # logging.error([low_limit, up_limit])
    # logging.error([NON_EXTREME_VALUES[col_name][0], NON_EXTREME_VALUES[col_name][1]])

    return low_limit, up_limit


def feature_wise_outlier(dataframe, col_name):
    low_limit, up_limit = outlier_thresholds(dataframe, col_name)
    if dataframe[(dataframe[col_name] > up_limit) | (dataframe[col_name] < low_limit)].any(axis=None):
        return (True, low_limit, up_limit)
    else:
        return (False, low_limit, up_limit)
    

def detect_outliers(user):
    '''
    Method to detect feature-wise outlier and their corrected values
    '''
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    filters, selected_features, data, labels = load_filtered_user_data(
        user_details)
    # fetch language
    lang = user_details["Language"]
    # Calculate feature wise outlier
    isOutlier = False
    outliers = []
    out_count = 0
    for f in selected_features:
        outlier_status, low_limit, up_limit = feature_wise_outlier(data, f)
        if outlier_status:
            isOutlier = True
        original_feature_values = data[f].to_list()
        # Get data after filering outliers
        corrected_feature_values = data[(data[f] >= low_limit) & (
            data[f] <= up_limit)][f].to_list()
        # Calculate outlier percentage
        out_count += len(original_feature_values) - \
            len(corrected_feature_values)
        outliers.append(
            {"feature": FRIENDLY_NAMES[f] if (lang == "ENG")  else FRIENDLY_NAMES_SLO[f],
             "status": outlier_status,
             "actuals": {
                "y_val": original_feature_values,
                "x_val": list(range(0, len(original_feature_values)))
            },
                "corrected": {
                "y_val": corrected_feature_values,
                "x_val": list(range(0, len(corrected_feature_values)))
            },
                "lower": low_limit,
                "upper": up_limit
            })
    # Prepare output
    out_pct = np.round(100 * (out_count/len(data)), 1)
    return (True, f"Successful. Outlier information obtained for user: {user}", outliers, isOutlier, out_pct)


def detect_imbalance(user):
    '''
    Method to detect class imbalance and their corrected values
    '''
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    filters, selected_features, data, labels = load_filtered_user_data(
        user_details)
    # Calculate feature wise outlier
    isImbalance = False

    diabetic_count = len(labels[labels[TARGET_VARIABLE] == 1])
    dc_pct = np.round(100 * (diabetic_count/(len(labels))), 0)
    ndc_pct = 100 - dc_pct

    if ndc_pct/dc_pct > 1.4 or ndc_pct/dc_pct < 0.75:
        isImbalance = True

    majority = "diabetic"
    minority = "non-diabetic"
    maj_pct = dc_pct
    min_pct = ndc_pct

    if ndc_pct > dc_pct:
        majority = "non-diabetic"
        maj_pct = ndc_pct
        minority = "diabetic"
        min_pct = dc_pct

    output_json = {
        "majority": majority,
        "majority_pct": maj_pct,
        "minority": minority,
        "minority_pct": min_pct
    }
    # Prepare output
    return (True, f"Successful. Class imbalance information obtained for user: {user}", output_json, isImbalance)


def remove_outliers():
    pass


def detect_missing_values(data):
    return data.isnull().sum().any()


def load_training_data(filters=None, selected_features=None):
    data = pd.read_csv("data/training_data.csv")

    if selected_features is not None and len(selected_features) > 0:
        data = data[selected_features + ['Outcome']]

    if filters is not None and len(filters) > 0:
        if selected_features is not None and len(selected_features) > 0:
            for i in range(len(selected_features)):
                data = data[(data[selected_features[i]] >= filters[i][0]) & (
                    data[selected_features[i]] <= filters[i][1])]

    x_data = data.drop(["Outcome"], axis='columns')
    y_data = data.filter(["Outcome"], axis='columns')

    return x_data, y_data


def load_test_data(selected_features=None):
    data = pd.read_csv("data/test_data.csv")
    x_data = data.drop(["Outcome"], axis='columns')
    y_data = data.filter(["Outcome"], axis='columns')
    if selected_features is not None and len(selected_features) > 0:
        x_data = x_data[selected_features]

    return x_data, y_data


def training_model(x_data, y_data, selected_features=None):

    numeric_transformer = Pipeline(steps=[('scaler', StandardScaler())])
    column_transformer = ColumnTransformer(transformers=[
        ('numerical', numeric_transformer, list(x_data.columns)),
    ])
    clf = Pipeline(steps=[('preprocessor', column_transformer),
                          ('classifier', RandomForestClassifier(n_estimators=300,
                                                                class_weight="balanced",
                                                                random_state=123))])
    model = clf.fit(x_data, y_data)
    x_test, y_test = load_test_data(selected_features)
    acc = 100 * model.score(x_data, y_data)
    test_acc = 100 * model.score(x_test, y_test)

    return acc, test_acc


def retrain_selected_features(x_data, y_data, features_to_include):
    """
    # TO-DO : Check if this method is being used
    """

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


def login_service(user_name, cohort, language):
    """
    Method to relieve user details if exists
    or create a new user if doesn't exist
    """
    client, db = get_database()
    collection_name = db[USER_COLLECTION]
    user_details = collection_name.find_one({"UserName": user_name})

    # find and update last login time
    if user_details is None:
        print("Record Not Found")
        new_user = USER_DETAIL_JSON
        new_user["UserName"] = user_name
        new_user["Cohort"] = cohort
        new_user["Language"] = language
        new_user.update({"_id": user_name+cohort})
        collection_name.insert_one(new_user)
        user_details = collection_name.find_one({"UserName": user_name})
        client.close()
        autocorrect_configs = {
            "UserName": user_name,
            "Cohort": cohort,
            "AutoCorrectConfig":   {
                "outlier": False,
                "correlation": False,
                "skew": False,
                "imbalance": False,
                "drift": False,
                "duplicate": False,
            }
        }
        insert_autocorrect_configs(autocorrect_configs)
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
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    # Load Filters and Filter Data
    filters, selected_features, data, labels = load_filtered_user_data(
        user_details)
    # Load unfiltered data
    unfiltered_data, _ = load_training_data(filters)
    # fetch language
    lang = user_details["Language"]
    if lang == "ENG":
        target_categories = ["Diabetic", "Non-diabetic"]
    else:
        target_categories = ["Diabetik", "Nediabetik"]

    output_json = {}
    for feat in ALL_FEATURES:
        if feat not in selected_features:
            y_val = np.histogram(unfiltered_data[feat].tolist(), bins=15)[
                0].tolist() + [0]
            x_val = np.histogram(unfiltered_data[feat].tolist(), bins=15)[
                1].tolist()
            avg = np.round(np.median(unfiltered_data[feat].values), 1)
        else:
            y_val = np.histogram(data[feat].tolist(), bins=15)[
                0].tolist() + [0]
            x_val = np.histogram(data[feat].tolist(), bins=15)[1].tolist()
            avg = np.round(np.median(data[feat].values), 1)

        output_json[feat] = {
            "name": FRIENDLY_NAMES[feat],
            "description": user_details[feat]["description"],
            "unit": user_details[feat]["unit"],
            "ydata": y_val,
            "xdata": x_val,
            "upperLimit": user_details[feat]["upperLimit"],
            "lowerLimit": user_details[feat]["lowerLimit"],
            "q1": NON_EXTREME_VALUES[feat][0],
            "q3": NON_EXTREME_VALUES[feat][1],
            "average": avg,
            "isSelected": user_details[feat]["isSelected"],
            # Add defaults
            "defaultUpperLimit": user_details[feat]["defaultUpperLimit"],
            "defaultLowerLimit": user_details[feat]["defaultLowerLimit"],
        }
    # Add additional details for target variable
    diabetic_count = len(labels[labels[TARGET_VARIABLE] == 1])
    dc_pct = np.round(100 * (diabetic_count/(len(labels))), 0)

    output_json['target'] = {
        "name": "Diabetes Status",
        "categories": target_categories,
        "category_ratio": [dc_pct, 100 - dc_pct],
        "isSelected": True
    }

    return (True, f"Successful. Data summary details founde for user: {user}", output_json)


def load_filtered_user_data(user_details):
    selected_features = []
    filters = []
    for feature in ALL_FEATURES:
        if user_details[feature]["isSelected"]:
            filters.append(
                (user_details[feature]["lowerLimit"], user_details[feature]["upperLimit"]))
            selected_features.append(feature)

    # fetch data
    data, labels = load_training_data(filters, selected_features)
    #############################################################
    # TO-DO : Apply Auto-Corrections if already set
    #############################################################
    # fetch auto-corrections config
    selectedIssues = fetch_autocorrect_configs(user_details["UserName"])
    corrected_data, corrected_labels, new_selected_features = apply_data_corrections(data, labels, selected_features, selectedIssues)
    # Update Selected features in DB
    for feature in selected_features:
        updated_feature = user_details[feature]
        if feature not in new_selected_features:
            updated_feature['isSelected'] = False
        update_user_details(user_details["UserName"], {feature: updated_feature})
    #############################################################
    return filters, new_selected_features, corrected_data, corrected_labels


def generate_pred_chart_data(user):
    """
    # get data filter settings
        # apply filters and retrain and generate new stats - update previous and new accuracy in mongo data
    """
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)
    else:
        filters, selected_features, data, labels = load_filtered_user_data(
            user_details)

        prev_score = user_details["PrevScore"]
        curr_score = user_details["CurrentScore"]

        # calc score change
        score_change = 0
        if prev_score is None or prev_score == 0:
            score_change = 0
        else:
            score_change = np.ceil(curr_score) - np.ceil(prev_score)

        # Get if auto-config features are on
        autocorrect_config = fetch_autocorrect_configs(user)
        if autocorrect_config is None:
            autocorrect_on = False
        else:
            # logging.error(list(autocorrect_config.values()))
            autocorrect_on = any(list(autocorrect_config.values()))

        output_json = {
            "Accuracy": np.ceil(curr_score),
            "NumSamples": data.shape[0],
            "NumFeatures": data.shape[1],
            "ScoreChange": score_change,
            "AutoCorrectOn" : autocorrect_on
        }

        return (True, f"Successful. Data summary details founde for user: {user}", output_json)


def key_insights_gen(user):
    """
    Method to generate insights
    """
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    filters, selected_features, data, labels = load_filtered_user_data(
        user_details)
    # fetch language
    lang = user_details["Language"]
    # Diabetic ratio
    xy_data = data.copy()
    xy_data[TARGET_VARIABLE] = labels
    pct_list = []
    input_list = []
    insight_list = []
    diabetic_count = len(xy_data[xy_data[TARGET_VARIABLE] == 1])
    dc_pct = np.round(100 * (diabetic_count/(len(xy_data))), 0)
    pct_list.append(dc_pct)
    if lang == "SLO":
        input_list.append("pacientov ima ")
        insight_list.append("sladkorno bolezen")
    else:
        input_list.append("Patients have ")
        insight_list.append("diabetes")
    # Zero Counts insights
    for feat in ACTIONABLE_FEATURES:
        if feat not in selected_features:
            continue  # Skip for filtered features
        zero_counts_pct = np.round(
            100 * (len(data[data[feat] == 0.0])/len(data)), 0)
        pct_list.append(zero_counts_pct)
        if lang == "SLO":
            input_list.append(f"{FRIENDLY_NAMES_SLO[feat]} ima ")
            insight_list.append("vrednost, ki je enaka nič")
        else:
            input_list.append(f"{FRIENDLY_NAMES[feat]} feature has ")
            insight_list.append("value equal to zero")
        # 90th and 10th Percentile Insights
        # Greater than
        qv = np.round(data[feat].quantile(0.9), 1)
        qvc_pct = np.round(100 * (len(data[data[feat] > qv])/len(data)), 0)
        pct_list.append(qvc_pct)
        if lang == "SLO":
            input_list.append(f"Pacientov ima {FRIENDLY_NAMES_SLO[feat]} ")
            insight_list.append(f"> {qv}")
        else:
            input_list.append(f"Patients have {FRIENDLY_NAMES[feat]} ")
            insight_list.append(f"greater than {qv}")
        # Lesser than
        qv = np.round(data[feat].quantile(0.1), 1)
        qvc_pct = np.round(100 * (len(data[data[feat] < qv])/len(data)), 0)
        pct_list.append(qvc_pct)
        if lang == "SLO":
            input_list.append(f"Pacientov ima {FRIENDLY_NAMES_SLO[feat]} ")
            insight_list.append(f"< {qv}")
        else:
            input_list.append(f"Patients have {FRIENDLY_NAMES[feat]} ")
            insight_list.append(f"lesser than {qv}")

    # Sorting in a dataframe
    ki_df = pd.DataFrame()
    ki_df['pct'] = pct_list
    ki_df['input'] = input_list
    ki_df['insight'] = insight_list
    ki_df = ki_df.sort_values(by=['pct'], ascending=False).head(4)

    insights = {
        "pct_list": ki_df['pct'].tolist(),
        "input_list": ki_df["input"].tolist(),
        "insight_list": ki_df["insight"].tolist()
    }
    return (True, f"Successful. Data summary details founde for user: {user}", insights)


def UpdateDataIssues(data, labels, data_issue_json, selected_features):
    """
    Updating the data issues
    """
    # Imbalance
    diabetic_count = len(labels[labels[TARGET_VARIABLE] == 1])
    dc_pct = np.round(100 * (diabetic_count/(len(labels))), 0)
    ndc_pct = 100 - dc_pct
    imbalance_score = np.round(
        (1 - min(dc_pct, ndc_pct) / max(dc_pct, ndc_pct)) * 100, 2)
    if imbalance_score != data_issue_json["imbalance"]["curr"]:
        data_issue_json["imbalance"]["prev"] = data_issue_json["imbalance"]["curr"]
        data_issue_json["imbalance"]["curr"] = imbalance_score

    # Duplicates
    duplicate_features = np.count_nonzero(data.duplicated())
    duplicate_pct = np.round(duplicate_features/len(data) * 100, 2)
    if duplicate_pct != data_issue_json["duplicate"]["curr"]:
        data_issue_json["duplicate"]["prev"] = data_issue_json["duplicate"]["curr"]
        data_issue_json["duplicate"]["curr"] = duplicate_pct

    # Outlier
    outliers = []
    out_count = 0
    for f in selected_features:
        outlier_status, low_limit, up_limit = feature_wise_outlier(data, f)
        if outlier_status:
            isOutlier = True
        original_feature_values = data[f].to_list()
        # Get data after filering outliers
        corrected_feature_values = data[(data[f] >= low_limit) & (
            data[f] <= up_limit)][f].to_list()
        # Calculate outlier percentage
        out_count += len(original_feature_values) - \
            len(corrected_feature_values)
    # Prepare output
    out_pct = np.round(100 * (out_count/len(data)), 1)
    if out_pct != data_issue_json["outlier"]["curr"]:
        data_issue_json["outlier"]["prev"] = data_issue_json["outlier"]["curr"]
        data_issue_json["outlier"]["curr"] = out_pct

    # Skew
    skewed_df = data.skew(axis=0, skipna=True).abs()
    skewed_features = np.count_nonzero(skewed_df.values > 1)
    skew_pct = np.round(skewed_features/len(selected_features) * 100, 2)
    if skew_pct != data_issue_json["skew"]["curr"]:
        data_issue_json["skew"]["prev"] = data_issue_json["skew"]["curr"]
        data_issue_json["skew"]["curr"] = skew_pct

    # Drift
    test_data, test_labels = load_test_data(selected_features)
    data_drift_dataset_report = Report(metrics=[
        DataDriftTable(),
    ])
    data_drift_dataset_report.run(reference_data=data,
                                  current_data=test_data)

    report_result = str(data_drift_dataset_report.json())
    report_result = json.loads(report_result)

    for metric in report_result['metrics']:
        if metric['metric'] == 'DataDriftTable':
            drift_pct = np.round(
                metric['result']['share_of_drifted_columns'] * 100, 2)
    if drift_pct != data_issue_json["drift"]["curr"]:
        data_issue_json["drift"]["prev"] = data_issue_json["drift"]["curr"]
        data_issue_json["drift"]["curr"] = drift_pct

    # Correlation
    corr_list = []
    corr_df = data.corr()
    corr_df = corr_df.where(
        np.triu(np.ones(corr_df.shape), k=1).astype(np.bool))

    for ind in range(len(corr_df)):
        for col in corr_df.columns:
            if (corr_df.iloc[ind][col]) > 0.5 or (corr_df.iloc[ind][col]) < -0.5:
                corr_list.append(
                    {
                        "feature1": corr_df.index[ind],
                        "feature2": col,
                        "score": corr_df.iloc[ind][col]
                    }
                )

    corr_pct = np.round(len(corr_list) * 2/len(selected_features) * 100, 2)
    if corr_pct != data_issue_json["correlation"]["curr"]:
        data_issue_json["correlation"]["prev"] = data_issue_json["correlation"]["curr"]
        data_issue_json["correlation"]["curr"] = corr_pct

    return data_issue_json

def score_adjustment(score, selected_features):
    if "SkinThickness" not in selected_features:
        score+=2
    if "Insulin" not in selected_features:
        score+=2
    return score

def retrain_config_data(config_data):
    user = config_data.UserId
    # Update records lower and upper limited and isSelected
    for feature in ALL_FEATURES:
        updated_feature = config_data.JsonData[feature]
        for unwanted_val in ["xdata", "ydata", "average"]:
            del updated_feature[unwanted_val]
        update_user_details(user, {feature: updated_feature})
    # re-train model with updated data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)
    filters, selected_features, data, labels = load_filtered_user_data(
        user_details)
    # train model
    train_score, test_score = training_model(data, labels, selected_features)
    # adjustment
    test_score = score_adjustment(test_score, selected_features)
    # Insert in  accuracy information MongoDB
    accuracy_detail = {
        "user": user,
        "cohort": config_data.Cohort,
        "score": test_score,
        "type": "train",
        "timestamp": datetime.now(),
    }
    insert_accuracy_detail(accuracy_detail)
    # Update old score
    prev_score = user_details["CurrentScore"]
    if prev_score != test_score:
        update_user_details(user, {"CurrentScore": test_score})
        update_user_details(user, {"PrevScore": prev_score})
    # Update data issue scores
    new_data_issues = UpdateDataIssues(
        data, labels, user_details["DataIssues"], selected_features)
    update_user_details(user, {"DataIssues": new_data_issues})
    # Adding target in output json
    user_details['target'] = config_data.JsonData['target']

    return (True, f"Success. New score is :{test_score}", user_details)


def restore_and_retrain(config_data):
    """
    Method to restore default values
    """
    user = config_data.UserId
    # Update upper and lower limits
    for feature in ALL_FEATURES:
        updated_feature = config_data.JsonData[feature]
        updated_feature['isSelected'] = True
        updated_feature['upperLimit'] = updated_feature['defaultUpperLimit']
        updated_feature['lowerLimit'] = updated_feature['defaultLowerLimit']
        for unwanted_val in ["xdata", "ydata", "average"]:
            del updated_feature[unwanted_val]
        update_user_details(user, {feature: updated_feature})
    # Update AutoCorrect Configs
    autocorrect_configs = {
            "outlier": False,
            "correlation": False,
            "skew": False,
            "imbalance": False,
            "drift": False,
            "duplicate": False,
        }
    update_autocorrect_details(user, {"AutoCorrectConfig": autocorrect_configs})
    # re-train model with updated data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)
    filters, selected_features, data, labels = load_filtered_user_data(
        user_details)
    # train model
    train_score, test_score = training_model(data, labels, selected_features)
    # Insert in  accuracy information MongoDB
    accuracy_detail = {
        "user": user,
        "cohort": config_data.Cohort,
        "score": test_score,
        "type": "restore",
        "timestamp": datetime.now(),
    }
    insert_accuracy_detail(accuracy_detail)
    # Update old score
    prev_score = user_details["CurrentScore"]
    if prev_score != test_score:
        update_user_details(user, {"CurrentScore": test_score})
        update_user_details(user, {"PrevScore": prev_score})
    # Update data issue scores
    new_data_issues = UpdateDataIssues(
        data, labels, user_details["DataIssues"], selected_features)
    update_user_details(user, {"DataIssues": new_data_issues})
    # Adding target in output json
    user_details['target'] = config_data.JsonData['target']
    
    return (True, f"Success. Default score is :{test_score}", user_details)


def apply_data_corrections(data, labels, selected_features, selectedIssues=None):
    if selectedIssues == None:
        return data, labels, selected_features

    if selectedIssues["duplicate"]:
        # Drop Duplicates
        complete_data = data.copy()
        complete_data[TARGET_VARIABLE] = labels
        complete_data.drop_duplicates(subset=None, inplace=True)
        data = complete_data.drop([TARGET_VARIABLE],axis='columns')
        labels = complete_data.filter([TARGET_VARIABLE],axis='columns')

    # Apply Corrections to the data
    if selectedIssues["outlier"]:
        # Detect Outliers
        for f in selected_features:
            outlier_status, low_limit, up_limit = feature_wise_outlier(data, f)
            if outlier_status:
                  # Replace outliers with up_limit and low_limit
                  data.loc[(data[f] < low_limit), f] = low_limit
                  data.loc[(data[f] > up_limit), f] = up_limit

    if selectedIssues["correlation"]:
        # Correct Correlation
        corr_df = data.corr()
        corr_df = corr_df.where(
            np.triu(np.ones(corr_df.shape), k=1).astype(np.bool))
        
        correlated_features = []
        for ind in range(len(corr_df)):
            for col in corr_df.columns:
                feature_to_remove = None
                if (corr_df.iloc[ind][col]) > 0.5 or (corr_df.iloc[ind][col]) < -0.5:
                    # Remove second feature from selected features
                    correlated_features.append(col)
        correlated_features = list(set(correlated_features))
        selected_features = [feat for feat in selected_features if feat not in correlated_features]
        data = data[selected_features]

    if selectedIssues["imbalance"]:
        # Correct Imbalance - With SMOTE method
        smote = SMOTE()
        data, labels = smote.fit_resample(data, labels)

    return data, labels, selected_features


def retrain_autocorrect_data(config_data):
    """
    Method to auto-correct selected issues and re-train model
    """
    user = config_data.UserId
    # Store auto-correction configurations
    update_autocorrect_details(
        user, {"AutoCorrectConfig": config_data.JsonData})
    
    # Fetch user details
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)
    filters, selected_features, data, labels = load_filtered_user_data(
        user_details)

    # re-train model after correction
    train_score, test_score = training_model(data, labels, selected_features)
    # Insert in  accuracy information MongoDB
    accuracy_detail = {
        "user": user,
        "cohort": config_data.Cohort,
        "score": test_score,
        "type": "autocorrect",
        "timestamp": datetime.now(),
    }
    insert_accuracy_detail(accuracy_detail)
    # Update old score
    prev_score = user_details["CurrentScore"]
    if prev_score != test_score:
        update_user_details(user, {"CurrentScore": test_score})
        update_user_details(user, {"PrevScore": prev_score})
    # Update data issue scores
    new_data_issues = UpdateDataIssues(
        data, labels, user_details["DataIssues"], selected_features)
    update_user_details(user, {"DataIssues": new_data_issues})

    return (True, f"Success. Default score is :{test_score}", user_details)


def detect_drift(user):
    '''
    Method to detect class imbalance and their corrected values
    '''
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    # Get training data
    filters, selected_features, train_data, train_labels = load_filtered_user_data(
        user_details)
    # Get test data
    test_data, test_labels = load_test_data(selected_features)

    data_drift_dataset_report = Report(metrics=[
        DataDriftTable(),
    ])
    data_drift_dataset_report.run(reference_data=train_data,
                                  current_data=test_data)

    drift_output = {}

    report_result = str(data_drift_dataset_report.json())
    report_result = json.loads(report_result)

    for metric in report_result['metrics']:
        if metric['metric'] == 'DataDriftTable':
            drift_output['overall'] = {
                "drift_score": np.round(metric['result']['share_of_drifted_columns'] * 100, 2),
                "isDrift": metric['result']['share_of_drifted_columns'] > 0.0
            }
            drift_output['features'] = metric['result']['drift_by_columns']
    for feat in drift_output['features'].keys():
        del drift_output['features'][feat]['column_name']
        del drift_output['features'][feat]['column_type']

    # Drift details
    isDrift = drift_output['overall']['isDrift']
    # Prepare output
    return (True, f"Successful. Drift information obtained for user: {user}", drift_output, isDrift)


def detect_skew(user):
    '''
    Method to detect class imbalance and their corrected values
    '''
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    # Get training data
    filters, selected_features, train_data, train_labels = load_filtered_user_data(
        user_details)
    skewed_df = train_data.skew(axis=0, skipna=True).abs()
    # logging.error(train_data.skew(axis = 0, skipna = True))
    skewed_features = np.count_nonzero(skewed_df.values > 1)
    skew_pct = np.round(skewed_features/len(selected_features) * 100, 2)
    isSkew = skewed_features > 0
    skew_json = {
        "skew_score": skew_pct,
        "features": train_data.skew(axis=0, skipna=True).to_dict()
    }
    # Prepare output
    return (True, f"Successful. Skewness information obtained for user: {user}", skew_json, isSkew)


def detect_duplicates(user):
    '''
    Method to detect class imbalance and their corrected values
    '''
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details, False)

    # Get training data
    filters, selected_features, train_data, train_labels = load_filtered_user_data(
        user_details)
    isDuplicate = bool(train_data.duplicated().any())
    duplicate_features = np.count_nonzero(train_data.duplicated())
    duplicate_pct = np.round(duplicate_features/len(train_data) * 100, 2)

    duplicate_json = {
        "duplicate_score": duplicate_pct,
    }

    # Prepare output
    return (True, f"Successful. Duplicate information obtained for user: {user}", duplicate_json, isDuplicate)


def detect_correlation(user):
    '''
    Method to detect data correlation
    '''
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details, False)

    # Get training data
    filters, selected_features, train_data, train_labels = load_filtered_user_data(
        user_details)

    isCorrelated = False
    corr_list = []
    corr_df = train_data.corr()
    corr_df = corr_df.where(
        np.triu(np.ones(corr_df.shape), k=1).astype(np.bool))

    for ind in range(len(corr_df)):
        for col in corr_df.columns:
            if (corr_df.iloc[ind][col]) > 0.5 or (corr_df.iloc[ind][col]) < -0.5:
                corr_list.append(
                    {
                        "feature1": corr_df.index[ind],
                        "feature2": col,
                        "score": corr_df.iloc[ind][col]
                    }
                )
    if len(corr_list) > 0:
        isCorrelated = True

    # Prepare output
    output_json = {
        "corrScore": np.round(len(corr_list) * 2/len(selected_features) * 100, 2),
        "corrFeatures": corr_list
    }
    return (True, f"Successful. Feature Correlation information obtained for user: {user}", output_json, isCorrelated)


def data_quality_gen(user):
    """
    Method to estimate data quality based on data issues
    """
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    data_issues = user_details["DataIssues"]
    data_issue_df = pd.DataFrame(data_issues).transpose()
    
    # fetch language
    lang = user_details["Language"]

    data_issue_df['delta_pct'] = np.round(
        data_issue_df['curr'] - data_issue_df['prev'], 1)
    quality_score = (100 - (data_issue_df['curr'].sum()/5))/100
    if lang == "SLO":
        quality_class = "Nizka"
    else:
        quality_class = "Poor"

    if quality_score > 0.80:
        if lang == "SLO":
            quality_class = "Dobra"
        else:
            quality_class = "Good"
    elif quality_score > 0.50:
        if lang == "SLO":
            quality_class = "Srednja"
        else:
            quality_class = "Moderate"

    data_issue_df.sort_values(by="delta_pct", ascending=False, inplace=True)

    output_json = {
        "score": quality_score,
        "quality_class": quality_class,
        "issues": data_issue_df.index.tolist(),
        "issue_val": data_issue_df["delta_pct"].tolist()
    }

    return (True, f"Successful. Data quality information obtained for user: {user}", output_json)


def compute_feature_importance(user):
    """
    Method to estimate feature importance using SHAP
    """
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    filters, selected_features, train_data, train_labels = load_filtered_user_data(
        user_details)
    
    # fetch language
    lang = user_details["Language"]

    model = xgboost.XGBClassifier().fit(
        train_data, train_labels[TARGET_VARIABLE].values)
    # compute SHAP values
    explainer = shap.Explainer(model, train_data)
    shap_values = explainer(train_data)
    vals = np.abs(shap_values.values).mean(0)
    feature_names = train_data.columns

    feature_importance = pd.DataFrame(list(zip(feature_names, vals)),
                                      columns=['feature', 'importance'])

    # Actionable Features
    actionable_features = feature_importance.query(
        "feature in ['Glucose', 'BMI', 'BloodPressure', 'Insulin', 'SkinThickness']")
    actionable_features['importance'] = (
        actionable_features['importance']/actionable_features['importance'].sum()) * 100
    actionable_features.sort_values(by=['importance'],
                                    ascending=False, inplace=True)
    # Non-actionable Features
    non_actionable_features = feature_importance.query(
        "feature in ['Age', 'Pregnancies', 'DiabetesPedigreeFunction']")
    non_actionable_features['importance'] = (
        non_actionable_features['importance']/non_actionable_features['importance'].sum()) * 100
    non_actionable_features.sort_values(by=['importance'],
                                        ascending=False, inplace=True)

    output_json = {
        "actionable": {
            "features": [FRIENDLY_NAMES[feat] if lang == "ENG" else FRIENDLY_NAMES_SLO[feat] for feat in actionable_features['feature'].tolist()],
            "importance": list(np.around(actionable_features['importance'].values, 0))
        },
        "non-actionable": {
            "features": [FRIENDLY_NAMES[feat] if lang == "ENG" else FRIENDLY_NAMES_SLO[feat] for feat in non_actionable_features['feature'].tolist()],
            "importance": list(np.around(non_actionable_features['importance'].values, 0))
        },
    }
    return (True, f"Successful. Feature importance information obtained for user: {user}", output_json)


def compute_decision_rules(user):
    """
    Method to compute decision rules using Skope-rules
    """
    # Load user data
    client, user_details = fetch_user_details(user)
    client.close()
    if user_details is None:
        return (False, f"Invalid username: {user}", user_details)

    filters, selected_features, train_data, train_labels = load_filtered_user_data(
        user_details)
    # fetch language
    lang = user_details["Language"]
    output_json = {}
    ########################################
    # Code to generate decision rules      #
    ########################################
    clf = SkopeRules(max_depth_duplication=2,
                     n_estimators=30,
                     precision_min=0.3,
                     recall_min=0.3,
                     random_state=123,
                     feature_names=train_data.columns)
    for idx, outcome in enumerate(['non-diabetic', 'diabetic']):
        X, y = train_data, train_labels[TARGET_VARIABLE]
        clf.fit(X, y == idx)
        rules = clf.rules_[0:4]
        rule_list = []
        for rule in rules:
            new_rule = []
            conditions = rule[0].split(' and ')
            for cond in conditions:
                if ("<=" in cond):
                    feature, op, threshold = cond.partition(" <= ")
                elif (">=" in cond):
                    feature, op, threshold = cond.partition(" >= ")
                elif ("<" in cond):
                    feature, op, threshold = cond.partition(" < ")
                elif (">" in cond):
                    feature, op, threshold = cond.partition(" > ")
                if lang == "ENG":
                    new_rule.append(
                        f"{FRIENDLY_NAMES[feature]}{op}{round(float(threshold),2)} {USER_DETAIL_JSON[feature]['unit']}")
                else:
                    new_rule.append(
                        f"{FRIENDLY_NAMES_SLO[feature]}{op}{round(float(threshold),2)} {USER_DETAIL_JSON[feature]['unit']}")
            if lang == "ENG":
                rule_list.append(" and ".join(new_rule))
            else:
                rule_list.append(" in ".join(new_rule))
        if len(rule_list) < 1:
            if lang == "ENG":
                rule_list.append("No rules found.")
            else:
                rule_list.append("Ni najdenih pravil.")
        output_json[outcome] = rule_list
    #########################################
    return (True, f"Successful. Decision rules obtained for user: {user}", output_json)


def save_interaction_data(config_data):
    """
    Method to store interaction data
    """
    interaction_detail = {
        "user": config_data.UserId,
        "cohort": config_data.Cohort,
        "viz": config_data.JsonData["viz"],
        "eventType": config_data.JsonData["eventType"],
        "description": config_data.JsonData["description"],
        "timestamp": config_data.JsonData["timestamp"],
        "duration": config_data.JsonData["duration"]
    }
    #insert_interaction_data(interaction_detail) -- Disabling interaction logs
    return (True, f"Successful. Interaction data inserted for user: {config_data.UserId}", interaction_detail)

def get_autocorrect_configs(user):
    """
    Fetched Auto Correct Configs
    """
    autocorrect_configs = fetch_autocorrect_configs(user)
    if autocorrect_configs is None:
        autocorrect_configs = {
            "outlier": False,
            "correlation": False,
            "skew": False,
            "imbalance": False,
            "drift": False,
            "duplicate": False,
        }
    return (True, f"Successful. Autocorrect Configs fetched for user: {user}", autocorrect_configs)

