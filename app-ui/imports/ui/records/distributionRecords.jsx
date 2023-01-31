export const distributionRecords = {
    "bloodSugar": {
        variable: "Blood Sugar",
        type: "measure",
        data: [4.3, 4.7, 5.2, 5.5, 5.7, 6.1, 6.3, 7.1, 7.5, 7.9, 9.6],
        count: [20, 35, 40, 36, 80, 150, 80, 25, 15, 30, 3],
        boundaryVal: [4.7, 6.3]
    },
    "waistMeasure": {
        variable: "Waist Measure",
        type: "measure",
        data: [70, 75, 80, 83, 85, 90, 92, 95, 98, 100, 105, 110, 112, 120, 125],
        count: [20, 40, 80, 150, 80, 25, 30, 10, 32, 20, 30, 30, 40, 15, 25],
        boundaryVal: [80, 98]
    },
    "bmi": {
        variable: "BMI",
        type: "measure",
        data: [16, 18, 22, 24, 25, 29.4, 30, 33.9, 35],
        count: [2, 50, 10, 21, 30, 43, 100, 2, 4],
        boundaryVal: [18, 25]
    },
    "drinkingStatus": {
        variable: "Alcohol Drinking Status",
        type: "behaviour",
        data: ["Doesn't Drink", "Rarely Drinks", "Moderately Drinks", "Frequently Drinks", "Addicted"],
        valueType: ["Good", "Good", "Medium", "Bad", "Bad"],
        count: [300, 500, 800, 1300, 900],
        boundaryVal: null
    },
    "smokingStatus": {
        variable: "Smoking Status",
        type: "behaviour",
        data: ["Non Smoker", "Passive Smoker", "Former Smoker", "Smoker"],
        valueType: ["Good", "Medium", "Medium", "Bad"],
        count: [900, 1000, 200, 1800 ],
        boundaryVal: null
    },
    "physicalActivityLevel": {
        variable: "Physical Activity Level",
        type: "behaviour",
        data: ["Low", "Moderate", "High"],
        valueType: ["Bad", "Medium", "Good"],
        count: [1450, 970, 240],
        boundaryVal: null
    }
}