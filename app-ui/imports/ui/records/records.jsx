export const records = {
    "2631": {
        "PatientInfo": {
            patientId: "2631",
            region: "Savinja",
            institution: "04",
            gender: "Male",
            age: 47,
            bloodSugar: {
                value: 7.5,
                upperBoundary: 6.3,
                lowerBoundary: 4.7,
            },
            bmi: {
                value: 33.9,
                upperBoundary: 25,
                lowerBoundary: 18,
            },
            waistMeasure: {
                value: 112,
                upperBoundary: 98,
                lowerBoundary: 80,
            },
            pulse: {
                value: 80,
                upperBoundary: 100,
                lowerBoundary: 60,
            },
            drinkingStatus: {
                value: "Rarely Drinks",
                type: "Good"
            },
            smokingStatus: {
                value: "Non Smoker",
                type: "Good"
            },
            physicalActivityLevel: {
                value: "Low",
                type: "Bad"
            }
        },
        "Risk": 82,
        "Recommendations": [
            {
                variable: "Physical Activity Level",
                currentVal: "Low",
                unit: null,
                cfVal: "High",
                message: "Exercise everyday for 30 mins",
                riskReduction: 7,
                feasibility: "easy",
                similarPatient: "2200",
                similarPatientRisk: "Low",
            },
            {
                variable: "Waist Measure",
                currentVal: "112",
                unit: "cm",
                cfVal: "98",
                message: "Reduce waist measure by 14 cm",
                riskReduction: 5,
                feasibility: "difficult",
                similarPatient: "1570",
                similarPatientRisk: "Moderate",
            }
        ],
        "Risk Recovery": {
            dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            risk: [55, 60, 55, 60, 65, 70, 75, 80, 84, 74, 82]
        },
        "Risk Factors":{
            bloodSugar: {
                value: 25,
                type: "measure",
                isPositive: false,
            },
            bmi: {
                value: 15,
                type: "measure",
                isPositive: false,
            },
            waistMeasure: {
                value: 19,
                type: "measure",
                isPositive: false,
            },
            drinkingStatus: {
                value: 9,
                type: "behaviour",
                isPositive: true,
            },
            smokingStatus: {
                value: 12,
                type: "behaviour",
                isPositive: true,
            },
            physicalActivityLevel:{
                value: 15,
                type: "behaviour",
                isPositive: false,
            },
        }
    },
    "1570": {
        "PatientInfo": {
            patientId: "1570",
            region: "Drava",
            institution: "02",
            gender: "Female",
            age: 60,
            bloodSugar: {
                value: 5.2,
                upperBoundary: 6.3,
                lowerBoundary: 4.7,
            },
            bmi: {
                value: 29.4,
                upperBoundary: 25,
                lowerBoundary: 18,
            },
            waistMeasure: {
                value: 98,
                upperBoundary: 98,
                lowerBoundary: 80,
            },
            pulse: {
                value: 79,
                upperBoundary: 100,
                lowerBoundary: 60,
            },
            drinkingStatus: {
                value: "Rarely Drinks",
                type: "Good"
            },
            smokingStatus: {
                value: "Smoker",
                type: "Bad"
            },
            physicalActivityLevel: {
                value: "Moderate",
                type: "Medium"
            }
        },
        "Risk": 61,
        "Recommendations": [
            {
                variable: "Smoking Status",
                currentVal: "Smoker",
                unit: null,
                cfVal: "Non Smoker",
                message: "Stop smoking at least for next 6 months",
                riskReduction: 4,
                feasibility: "difficult",
                similarPatient: "2949",
                similarPatientRisk: "Low",
            },
            {
                variable: "BMI",
                currentVal: "29.4",
                unit: null,
                cfVal: "25",
                message: "Reduce BMI below 25 by reducing weight by 15 kg",
                riskReduction: 4,
                feasibility: "difficult",
                similarPatient: "2949",
                similarPatientRisk: "Low",
            }
        ],
        "Risk Recovery": {
            dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            risk: [72, 68, 73, 70, 75, 78, 81, 84, 88, 73, 61]
        },
        "Risk Factors":{
            bloodSugar: {
                value: 37,
                type: "measure",
                isPositive: true,
            },
            bmi: {
                value: 10,
                type: "measure",
                isPositive: false,
            },
            waistMeasure: {
                value: 17,
                type: "measure",
                isPositive: true,
            },
            drinkingStatus: {
                value: 12,
                type: "behaviour",
                isPositive: true,
            },
            smokingStatus: {
                value: 11,
                type: "behaviour",
                isPositive: false,
            },
            physicalActivityLevel:{
                value: 13,
                type: "behaviour",
                isPositive: false,
            },
        }
    },
    "2949": {
        "PatientInfo": {
            patientId: "2949",
            region: "Southeast Slovenia",
            institution: "01",
            gender: "Male",
            age: 43,
            bloodSugar: {
                value: 4.7,
                upperBoundary: 6.3,
                lowerBoundary: 4.7,
            },
            bmi: {
                value: 24,
                upperBoundary: 25,
                lowerBoundary: 18,
            },
            waistMeasure: {
                value: 90,
                upperBoundary: 98,
                lowerBoundary: 80,
            },
            pulse: {
                value: 67,
                upperBoundary: 100,
                lowerBoundary: 60,
            },
            drinkingStatus: {
                value: "Rarely Drinks",
                type: "Good"
            },
            smokingStatus: {
                value: "Non Smoker",
                type: "Good"
            },
            physicalActivityLevel: {
                value: "Moderate",
                type: "Medium"
            }
        },
        "Risk": 39,
        "Recommendations": [
            {
                variable: "Physical Activity Level",
                currentVal: "Moderate",
                unit: null,
                cfVal: "High",
                message: "Exercise everyday for 30 mins",
                riskReduction: 2,
                feasibility: "easy",
                similarPatient: "2200",
                similarPatientRisk: "Low",
            },
            {
                variable: "BMI",
                currentVal: "24",
                unit: null,
                cfVal: "23",
                message: "Reduce BMI to 24 by reducing weight by 3 kg",
                riskReduction: 1,
                feasibility: "easy",
                similarPatient: "2200",
                similarPatientRisk: "Low",
            }
        ],
        "Risk Recovery": {
            dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            risk: [35, 40, 55, 60, 75, 70, 50, 35, 25, 34, 39]
        },
        "Risk Factors":{
            bloodSugar: {
                value: 21,
                type: "measure",
                isPositive: true,
            },
            bmi: {
                value: 17,
                type: "measure",
                isPositive: true,
            },
            waistMeasure: {
                value: 16,
                type: "measure",
                isPositive: true,
            },
            drinkingStatus: {
                value: 4,
                type: "behaviour",
                isPositive: true,
            },
            smokingStatus: {
                value: 9,
                type: "behaviour",
                isPositive: true,
            },
            physicalActivityLevel:{
                value: 8,
                type: "behaviour",
                isPositive: false,
            },
        }
    }
};