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
            "Selected": True,
            "UpperLimit": 15,
            "LowerLimit": 0,
            "DefaultUpperLimit": 15,
            "DefaultLowerLimit": 0,
            "Unit": None,
            "Description": "Number of times pregnant"
            },
    "Glucose": {
            "Selected": True,
            "UpperLimit": 199,
            "LowerLimit": 0,
            "DefaultUpperLimit": 199,
            "DefaultLowerLimit": 0,
            "Unit": "mg/dl",
            "Description": "Plasma glucose concentration after 2 hours of eating in an oral glucose tolerance test"
            },
    "BloodPressure": {
            "Selected": True,
            "UpperLimit": 122,
            "LowerLimit": 0,
            "DefaultUpperLimit": 122,
            "DefaultLowerLimit": 0,
            "Unit": "mm Hg",
            "Description": "Diastolic blood pressure"
            },
  "SkinThickness": {
           "Selected": True,
            "UpperLimit": 99,
            "LowerLimit": 0,
            "DefaultUpperLimit": 99,
            "DefaultLowerLimit": 0,
            "Unit": "mm",
            "Description": "Triceps skin fold thickness"
            },
  "Insulin": {
           "Selected": True,
            "UpperLimit": 850,
            "LowerLimit": 0,
            "DefaultUpperLimit": 850,
            "DefaultLowerLimit": 0,
            "Unit": "mm",
            "Description": "2-Hour serum insulin"
            },
  "BMI": {
           "Selected": True,
            "UpperLimit": 67.1,
            "LowerLimit": 0,
            "DefaultUpperLimit": 67.1,
            "DefaultLowerLimit": 0,
            "Unit": "kg/m^2",
            "Description": "Body mass index"
            },
  "DiabetesPedigreeFunction": {
           "Selected": True,
            "UpperLimit": 2.39,
            "LowerLimit": 0.07,
            "DefaultUpperLimit": 2.39,
            "DefaultLowerLimit": 0.07,
            "Unit": None,
            "Description": "Diabetes pedigree function"
            },
  "Age": {
           "Selected": True,
            "UpperLimit": 85,
            "LowerLimit": 20,
            "DefaultUpperLimit": 85,
            "DefaultLowerLimit": 20,
            "Unit": "years",
            "Description": "Age in years"
        }
}
