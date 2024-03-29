export const tooltipEnglishContent = {
    "dce": {
        "accuracyChart": {
            "title": "This visual shows the overall accuracy of the prediction model. It also shows the size of the dataset and number of features present in the dataset. Furthermore, it shows the score difference between the current setting the previous setting.",
            "trainingSamples": "Number of records used to train the prediction model. It is recommended to have a sufficient number of training samples to get accurate predictions. If the training samples are less than the prediction accuracy can be low.",
            "featuresConsidered": "Number of risk factors selected to train the prediction model. It is recommeded to train the model on relevant features. Noisy and unimportant features can decrease prediction accuracy.",
            "upScore": "Good job! Your current settings have increased the prediction accuracy.",
            "downScore": "Try a different configuration as your current settings have decreased the prediction accuracy.",
            "autoCorrectOn" : "You have selected to auto-correct data issues. Please reset to default model if want to undo the auto-changes.",
        },
        "keyInsights": {
            "title": "This visual shows interesting information about the training dataset and the risk factors. You can use this visual to find any abnormal patterns in the training data.",
        },
        "dataDensity": {
            "title": "This visual shows the patient count distribution for each risk factor of the dataset. You can use this to find the average risk factor value (shown by the black marker), observe the graphical distribution of the data and see any potential abnormality  present in the data.",
            "extreme" : "The region in the graph displayed in pink denotes potential abnormal value in the data",
            "nonExtreme" : "The region in the graph displayed in blue denotes non-abnormal value in the data"
        },
        "dataQuality": {
            "title": "This visual shows the overall quality of the dataset. You can also see if the dataset is affected by any data issues.",
            "skew" : "Data is considered to be skewed when the data distribution is asymmetrical. Predictive models trained on skewed data are more prone towards giving incorrect predictions.",
            "outlier" : "An outlier is data point which is significantly different from majority of the data points and does not follow the general patterns present in the data. Removing outliers can improve the prediction accuracy.",
            "drift" : "Data drift is detected when the underlying patterns, distributions of the data changes. It can result in the predictive model making incorrect or outdated predictions.",
            "duplicate" : "Training a predictive model with duplicate or redundant records add more bias to model, thus, increasing the prediction error. Removing duplicate records from training data can increase the prediction accuracy.",
            "imbalance" : "Class imbalance is an issue in which the predictive model has a higher tendency to generate biased and unfair results towards the majority class. Correcting class imbalance can improve the overall prediction accuracy.",
            "correlation" : "Correlated features degrade the predictive power as they do not add new information to the model. Dropping highly correlated features is recommended during the training process to obtain a better prediction accuracy.",
        }
    },
    "mce": {
        "accuracyChart": {
            "title": "This visual shows the overall accuracy of the prediction model. It also shows the size of the dataset and number of features present in the dataset. Furthermore, it shows the score difference between the current setting the previous setting.",
            "trainingSamples": "Number of records used to train the prediction model. It is recommeded to have sufficient number of training samples to get accurate predictions. If the training samples are less than the prediction accuracy can be low.",
            "featuresConsidered": "Number of risk factors selected to train the prediction model. It is recommeded to train the model on relevant features. Noisy and unimportant features can decrease prediction accuracy.",
            "upScore": "Good job! Your current settings have increased the prediction accuracy.",
            "downScore": "Try a different configuration as your current settings have decreased the prediction accuracy."
        },
        "decisionRule": {
            "title": "This visual shows the top conditions considered by the prediction model for predicting diabetic and non-diabetic states. You can use the switch control below to see the decision rules for diabetic and non-diabetic states.",
        },
        "featureImportance": {
            "title": "This visual shows the important risk factors and their importance as considered by the prediction model. The actionable features are the risk factors which can be effectively controlled by the patients. Whereas the non-actionable features are the risk factors which are not feasible to change by the patients, but yet can be important for the decision process.",
            "actionable": "The actionable features are the risk factors which can be effectively controlled by the patients.",
            "nonActionable": "Non-actionable features are the risk factors which are not feasible to change by the patients, but yet, can be important for the decision process."
        },
    },
    "featureConfig" : {
        "title" : "You can configure the training data from this page. Please select the risk factors which you think is important for the predictive model. If you observe any abnormal or extreme data value for any of the risk factors, you can use the slider control to filter the data and re-train the model.",
        "diabetesStatus": "This visual shows the proportion of diabetic and non-diabetic patients in the training data. For a higher prediction accuracy it is recommended that the proportions of diabetic and non-diabetic patients should be almost equal.",
        "glucose" : "Plasma glucose concentration in saliva after 2 hours of eating in an oral glucose tolerance test.  It is measured in mg/dl",
        "pregnancies" : "Number of times pregnant in the past",
        "pressure": "Diastolic blood pressure of patients measured in mm Hg",
        "skinfold" : "Triceps skin fold thickness of patients",
        "insulin" : "Two-hour serum insulin that is measured in mu U/ml",
        "bmi" : "Body mass index of patients",
        "dpf" : "Diabetes pedigree function is a function which scores likelihood of diabetes based on family history",
        "age" : "Age of patients in years"
    },
    "dataConfig" : {
        "title": "You can expand to learn more about these data issues. You can also select the data issues which you want to auto-correct and re-train. Please note that auto-correcting data issues may improve the data quality but it may or may not improve the prediction accuracy. Also, auto-correcting one data issue, may introduce other issues."
    }
};