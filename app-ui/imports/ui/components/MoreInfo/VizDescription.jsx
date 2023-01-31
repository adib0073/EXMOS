export const VizDescription = [
    {
        title : "Patient Summary",
        shortDesc: "Summarize the important health variables for the current patient.",
        longDesc: "This visualization gives you insights about the specific patient by summarzing the observations for the actionable variables present in the dataset. The distribution plots shown for each health variable shows the count of patients (on y-axis) for each value of the variable (on x-axis). Find out where the current patient is as compared to other patients.",
        info1: {
            title: "Patient Measures",
            message: "These are measurements taken for patients in routine medical check-ups. \nYou can see the distribution of the patients measures for all patients in the dataset. The blue marker shows the current value of the patient measure. The graph also shows you different zones. The green zone indicates that the health variable is not increasing risk of diabetes onset, but if the zone is red or orange, then the current value of the health variable can increase the risk of diabetes onset."
        },
        info2: {
            title: "Patient Behaviours",
            message: "This data is collected based on the FINDRISC questionnaire about the patient habits. \nYou can see the distribution of the patients measures for all patients in the dataset. The blue marker shows the current value of the patient measure. The graph also shows you different zones. The green zone indicates that the health variable is not increasing risk of diabetes onset, but if the zone is red or orange, then the current value of the health variable can increase the risk of diabetes onset.",
        },
        note: "** Note - You can hover and try to change the current values of the health variables and observe how the overall risk changes.",
    },
    {
        title : "Recommendations to reduce risk",
        shortDesc: "This visual provides you system generated recommendations to reduce risk.",
        longDesc: "This visual provides you system generated recommendations to reduce risk. This is an interactive visual, please select the actions and observe how the overall risk is changing.",
        info1: {
            title: "Actions",
            message: "The actions mentioned is specific to the current patient. The recommended action can reduce risk for the patient. Compare the suggested action with the current value for this health variable."
        },
        info2: {
            title: "More information about the action",
            message: "Take a look at the overall impact (percentage reduction of the overall risk) and feasibility of this action (easy or difficult)."
        },
        note: null,
    },
    {
        title: "Important Risk Factors",
        shortDesc: "This visualization gives you insights about the various factors which increases or decreases the risk of diabetes for the patient.",
        longDesc: "This visualization gives you insights about the import risk factors (health variables) which increases the risk of diabetes for the patient. The percentage impact indicates how harmful the current value of the health variable can be for increasing the overall risk of diabetes onset for the patient",
        info1: {
            title: "Actions",
            message: "The actions mentioned is specific to the current patient. The recommended action can reduce risk for the patient. Compare the suggested action with the current value for this health variable."
        },
        info2: {
            title: "More information about the action",
            message: "Take a look at the overall impact (percentage reduction of the overall risk) and feasibility of this action (easy or difficult)."
        },
        note: "**Note - You can use the slider to change the current value of the health variable and observe how the overall risk can be changed",

    },
    {
        title: "Risk Recovery",
        shortDesc: "This visual shows you whether the patient condition is improving or not.",
        longDesc: "This visual shows you whether the patient condition is improving or not. Monitor the overall risk for the current patient using the historical records.",
        info1: {
            title: "Risk Values",
            message: "If the estimated risk is greater than 75% the patient is in high risk zone. If the risk is between 75% and 50% the patient is in moderate risk zone. If the estimated risk is below 50% the patient is in low risk zone."
        },
        info2: {
            title: "Risk Colors",
            message: "High risk is show using the Red color, Moderate risk is shown using the Orange color and Low risk is shown using the Green color."
        },
        note: "** Note - You can hover over each point and view the actual risk percentage at a specific time point."
    }
];