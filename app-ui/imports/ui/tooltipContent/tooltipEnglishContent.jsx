export const tooltipEnglishContent = {
    "dce": {
        "accuracyChart": {
            "title": "This visual shows the overall accuracy of the prediction model. It also shows the size of the dataset and number of features present in the dataset. Furthermore, it shows the score difference between the current setting the previous setting.",
        },
        "keyInsights": {
            "title": "This visual shows interesting information about the training dataset and the risk factors. You can use this visual to find any abnormal patterns in the training data.",
        },
        "dataDensity": {
            "title": "This visual shows the patient count distribution for each risk factor of the dataset. You can use this to find the average risk factor value (shown by the black marker), observe the graphical distribution of the data and see any potential abnormality  present in the data.",
        },
        "dataQuality": {
            "title": "This visual shows the overall quality of the dataset. You can also see if the dataset is affected by any data issues."
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
    }
};