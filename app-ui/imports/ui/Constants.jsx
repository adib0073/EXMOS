export const BASE_API = "http://cassatt.experiments.cs.kuleuven.be:3950"; //"http://127.0.0.1:8000";
//export const BASE_API = "http://127.0.0.1:8000";

// DATA SUMMARY VIZ DEFAULT MODEL
export const DATA_SUMMARY_DEFAULT_MODEL = {
    "Pregnancies": {
          "name": "Pregnancies",
          "description": "Number of times pregnant in the past",
          "unit": null,
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 15,
          "lowerLimit": 0,
          "defaultUpperLimit": 15,
          "defaultLowerLimit": 0,
          "average": 3.8,
          "q1" : 0,
          "q3": 0,
          "isSelected": true
        },
        "Glucose": {
          "name": "Glucose",
          "description": "Plasma glucose concentration in saliva after 2 hours of eating in an oral glucose tolerance test. It is measured in mg/dl",
          "unit": "mg/dl",
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 199,
          "lowerLimit": 0,
          "defaultUpperLimit": 199,
          "defaultLowerLimit": 0,
          "average": 121,
          "q1" : 0,
          "q3": 0,
          "isSelected": true
        },
        "BloodPressure": {
          "name": "Blood Pressure",
          "description": "Diastolic blood pressure of patients measured in mm Hg",
          "unit": "mm Hg",
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 122,
          "lowerLimit": 0,
          "defaultUpperLimit": 122,
          "defaultLowerLimit": 0,
          "average": 68.8,
          "q1" : 0,
          "q3": 0,
          "isSelected": true
        },
        "SkinThickness": {
          "name": "Skin Thickness",
          "description": "Triceps skin fold thickness of patients",
          "unit": "mm",
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 99,
          "lowerLimit": 0,
          "defaultUpperLimit": 99,
          "defaultLowerLimit": 0,
          "average": 20.7,
          "q1" : 0,
          "q3": 0,
          "isSelected": true
        },
        "Insulin": {
          "name": "Insulin",
          "description": "Two-hour serum insulin that is measured in mu U/ml",
          "unit": "mu U/ml",
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 846,
          "lowerLimit": 0,
          "defaultUpperLimit": 846,
          "defaultLowerLimit": 0,
          "average": 81,
          "q1" : 0,
          "q3": 0,
          "isSelected": true
        },
        "BMI": {
          "name": "Body mass index",
          "description": "Body mass index of patients",
          "unit": "kg/m^2",
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 67.1,
          "lowerLimit": 0,
          "defaultUpperLimit": 67.1,
          "defaultLowerLimit": 0,
          "average": 32,
          "q1" : 0,
          "q3": 0,
          "isSelected": true
        },
        "DiabetesPedigreeFunction": {
          "name": "Diabetes Pedigree Function",
          "description": "Diabetes pedigree function is a function which scores likelihood of diabetes based on family history",
          "unit": null,
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 2.39,
          "lowerLimit": 0.07,
          "defaultUpperLimit": 2.39,
          "defaultLowerLimit": 0.07,
          "average": 0.5,
          "q1" : 0,
          "q3": 0,
          "isSelected": true
        },
        "Age": {
          "name": "Age",
          "description": "Age of patients in years",
          "unit": "years",
          "ydata": [0],
          "xdata": [0],
          "upperLimit": 85,
          "lowerLimit": 20,
          "defaultUpperLimit": 85,
          "defaultLowerLimit": 20,
          "average": 33.1,
          "q1" : 0,
          "q3": 0,
          "isSelected": true
        },
        "target" : {
          "name":"Diabetes Status", 
          "categories" : ["Diabetic", "Non-diabetic"],
          "category_ratio" : [0, 0],    
          "isSelected": true
        }
};

// DATA ISSUE FRIENDLY NAMES ENG
export const DATA_ISSUE_FRIENDLY_NAMES_Eng = {
  "drift" : "Data Drift",
  "imbalance" : "Class Imbalance",
  "skew" : "Data Skewness",
  "duplicate" : "Duplicate Data",
  "outlier" : "Data Outlier",
  "correlation" : "Feature Correlation",
}

// DATA ISSUE FRIENDLY NAMES SLO
export const DATA_ISSUE_FRIENDLY_NAMES_Slo = {
  "drift" : "Odstopanje podatkov",
  "imbalance" : "Neuravnoteženost razredov",
  "skew" : "Izkrivljenost podatkov",
  "duplicate" : "Podvajanje podatkov",
  "outlier" : "Izstopajoče vrednosti",
  "correlation" : "Korelacija značilnosti",
}

// FRIENDLY NAMES
export const FRIENDLY_NAMES_ENG = {
    "Pregnancies": "Number of Pregnancies",
    "Glucose": "Plasma Glucose Concentration",
    "BloodPressure": "Diastolic Blood Pressure",
    "SkinThickness": "Triceps skinfold thickness",
    "Insulin": "Two-hour Serum Insulin",
    "BMI": "Body Mass Index",
    "DiabetesPedigreeFunction": "Diabetes Pedigree Function",
    "Age": "Age"
}

export const FRIENDLY_NAMES_SLO = {
  "Pregnancies": "Število nosečnosti",
  "Glucose": "Koncentracija glukoze v plazmi",
  "BloodPressure": "Diastolični krvni tlak",
  "SkinThickness": "Debelina kožne gube tricepsa",
  "Insulin": "Dveurni serumski inzulin",
  "BMI": "Indeks telesne mase (BMI)",
  "DiabetesPedigreeFunction": "Rodovnik sladkorne bolezni",
  "Age": "Starost"
}

export const FEAT_DESCRIPTIONS_SLO = {
  "Pregnancies": "Število nosečnosti v preteklosti",
  "Glucose": "Plazemska koncentracija glukoze v slini po dveh urah po zaužitju hrane pri oralnem tolerančnem testu z glukozo. Meri se v mg/dl.",
  "BloodPressure": "Diastolični krvni tlak pacientov, izmerjen v mmHg",
  "SkinThickness": "Debelina kožne gube tricepsa pri pacientih",
  "Insulin": "Dveurni serumski inzulin, izmerjen v U/ml",
  "BMI": "Indeks telesne mase pacientov (BMI)",
  "DiabetesPedigreeFunction": "Funkcija rodovnika sladkorne bolezni je funkcija, ki oceni verjetnost sladkorne bolezni na podlagi družinske anamneze.",
  "Age": "Starost pacientov v letih"
}