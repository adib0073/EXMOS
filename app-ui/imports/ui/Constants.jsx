export const BASE_API = "http://127.0.0.1:8000";

// DATA SUMMARY VIZ DEFAULT MODEL
export const DATA_SUMMARY_DEFAULT_MODEL = {
    "Pregnancies": {
          "name": "Pregnancies",
          "description": "Number of times pregnant",
          "unit": null,
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 15,
          "lowerLimit": 0,
          "defaultUpperLimit": 15,
          "defaultLowerLimit": 0,
          "average": 3.8,
          "isSelected": true
        },
        "Glucose": {
          "name": "Glucose",
          "description": "Plasma glucose concentration after 2 hours of eating in an oral glucose tolerance test",
          "unit": "mg/dl",
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 199,
          "lowerLimit": 0,
          "defaultUpperLimit": 199,
          "defaultLowerLimit": 0,
          "average": 121,
          "isSelected": true
        },
        "BloodPressure": {
          "name": "BloodPressure",
          "description": "Diastolic blood pressure",
          "unit": "mm Hg",
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 122,
          "lowerLimit": 0,
          "defaultUpperLimit": 122,
          "defaultLowerLimit": 0,
          "average": 68.8,
          "isSelected": true
        },
        "SkinThickness": {
          "name": "SkinThickness",
          "description": "Triceps skin fold thickness",
          "unit": "mm",
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 99,
          "lowerLimit": 0,
          "defaultUpperLimit": 99,
          "defaultLowerLimit": 0,
          "average": 20.7,
          "isSelected": true
        },
        "Insulin": {
          "name": "Insulin",
          "description": "2-Hour serum insulin",
          "unit": "mm",
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 846,
          "lowerLimit": 0,
          "defaultUpperLimit": 846,
          "defaultLowerLimit": 0,
          "average": 81,
          "isSelected": true
        },
        "BMI": {
          "name": "BMI",
          "description": "Body mass index",
          "unit": "kg/m^2",
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 67.1,
          "lowerLimit": 0,
          "defaultUpperLimit": 67.1,
          "defaultLowerLimit": 0,
          "average": 32,
          "isSelected": true
        },
        "DiabetesPedigreeFunction": {
          "name": "DiabetesPedigreeFunction",
          "description": "Diabetes pedigree function",
          "unit": null,
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 2.39,
          "lowerLimit": 0.07,
          "defaultUpperLimit": 2.39,
          "defaultLowerLimit": 0.07,
          "average": 0.5,
          "isSelected": true
        },
        "Age": {
          "name": "Age",
          "description": "Age in years",
          "unit": "years",
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 85,
          "lowerLimit": 20,
          "defaultUpperLimit": 85,
          "defaultLowerLimit": 20,
          "average": 33.1,
          "isSelected": true
        },
        "target" : {
          "name":"Diabetes Status", 
          "categories" : ["Diabetic", "Non-diabetic"],
          "category_ratio" : [0, 0],    
          "isSelected": true
        }
};
