ALL_FEATURES = ["Pregnancies", "Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"]
DEFAULT_VALUES = [(0, 15), (0, 199), (0, 122), (0, 99), (0, 846), (0.0, 67.1), (0.078, 2.329), (21, 81)]
# Provide the mongodb atlas url to connect python to mongodb using pymongo
CONNECTION_STRING = "mongodb+srv://exmos:Exmos1005@exmoscluster1.rt8qvof.mongodb.net/?retryWrites=true&w=majority"
# MONGO DATABASE NAME
DBNAME = "exmos_db"
# MONGO COLLECTION NAME
USER_COLLECTION = "exmos_collection"
# User Detail Template
USER_DETAIL_JSON = {
    "UserName": None,
    "Cohort": None,  
    "Pregnancies": {
            "isSelected": True,
            "upperLimit": 15,
            "lowerLimit": 0,
            "defaultUpperLimit": 15,
            "defaultLowerLimit": 0,
            "unit": None,
            "description": "Number of times pregnant"
            },
    "Glucose": {
            "isSelected": True,
            "upperLimit": 199,
            "lowerLimit": 0,
            "defaultUpperLimit": 199,
            "defaultLowerLimit": 0,
            "unit": "mg/dl",
            "description": "Plasma glucose concentration after 2 hours of eating in an oral glucose tolerance test"
            },
    "BloodPressure": {
            "isSelected": True,
            "upperLimit": 122,
            "lowerLimit": 0,
            "defaultUpperLimit": 122,
            "defaultLowerLimit": 0,
            "unit": "mm Hg",
            "description": "Diastolic blood pressure"
            },
  "SkinThickness": {
            "isSelected": True,
            "upperLimit": 99,
            "lowerLimit": 0,
            "defaultUpperLimit": 99,
            "defaultLowerLimit": 0,
            "unit": "mm",
            "description": "Triceps skin fold thickness"
            },
  "Insulin": {
            "isSelected": True,
            "upperLimit": 850,
            "lowerLimit": 0,
            "defaultUpperLimit": 850,
            "defaultLowerLimit": 0,
            "unit": "mu U/ml",
            "description": "2-Hour serum insulin"
            },
  "BMI": {
            "isSelected": True,
            "upperLimit": 67.1,
            "lowerLimit": 0,
            "defaultUpperLimit": 67.1,
            "defaultLowerLimit": 0,
            "unit": "kg/m^2",
            "description": "Body mass index"
            },
  "DiabetesPedigreeFunction": {
            "isSelected": True,
            "upperLimit": 2.39,
            "lowerLimit": 0.07,
            "defaultUpperLimit": 2.39,
            "defaultLowerLimit": 0.07,
            "unit": None,
            "description": "Diabetes pedigree function is a function which scores likelihood of diabetes based on family history"
            },
  "Age": {
            "isSelected": True,
            "upperLimit": 85,
            "lowerLimit": 20,
            "defaultUpperLimit": 85,
            "defaultLowerLimit": 20,
            "unit": "years",
            "description": "Age in years"
        },
   "CurrentScore" : 80,
   "PrevScore": 0
}
# FRIENDLY NAMES
FRIENDLY_NAMES = {
    "Pregnancies" : "Pregnancies", 
    "Glucose" : "Glucose", 
    "BloodPressure" : "Blood Pressure", 
    "SkinThickness" : "Skin Thickness",
    "Insulin" : "Insulin", 
    "BMI" : "Body Mass Index", 
    "DiabetesPedigreeFunction" : "Diabetes Pedigree Function", 
    "Age" : "Age"
}
# ACTIONABLE FEATURES
ACTIONABLE_FEATURES = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
#target variable
TARGET_VARIABLE = "Outcome"
# NON-EXTREME VALUES
NON_EXTREME_VALUES = {
    "Pregnancies" : [-1, -1], 
    "Glucose" : [30, 200], 
    "BloodPressure" : [30, 100], 
    "SkinThickness" : [2, 50],
    "Insulin" : [5, -1], 
    "BMI" : [10, 60], 
    "DiabetesPedigreeFunction" : [-1,-1], 
    "Age" : [-1,-1]
}