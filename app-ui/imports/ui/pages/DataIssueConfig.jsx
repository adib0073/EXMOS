import React, { useState, useEffect } from 'react';
import { InfoLogo } from '../components/Icons/InfoLogo';
import { Collapse, Checkbox, Select, Spin, Tooltip, message } from 'antd';
const { Panel } = Collapse;
const { Option } = Select;
import { ConfigScatter, ConfigScatterCorr } from '../components/ConfigCharts/ConfigScatter';
import { BASE_API } from '../Constants';
import axios from 'axios';
import { DataIssueBar } from '../components/ConfigCharts/DataIssueBar';
import { DataIssueArea, DataDriftArea } from '../components/ConfigCharts/DataIssueArea';
import { tooltipEnglishContent } from '../tooltipContent/tooltipEnglishContent';
import { tooltipSloveneContent } from '../tooltipContent/tooltipSloveneContent';

const GetOutliers = ({ userid, setOutlierData, setDisplayIssue }) => {
    //console.log(userid);
    axios.get(BASE_API + '/checkoutliers/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setOutlierData(response.data["OutputJson"]);
            setDisplayIssue(prevState => ({
                ...prevState,
                "outlier": response.data["isOutlier"]
            }));
        }).catch(function (error) {
            console.log(error);
        });
};

const GetImbalance = ({ userid, setImbalanceData, setDisplayIssue }) => {
    //console.log(userid);
    axios.get(BASE_API + '/checkclassimbalance/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setImbalanceData(response.data["OutputJson"]);
            setDisplayIssue(prevState => ({
                ...prevState,
                "imbalance": response.data["isImbalance"]
            }));
        }).catch(function (error) {
            console.log(error);
        });
};

const GetDuplicates = ({ userid, setDuplicateData, setDisplayIssue }) => {
    //console.log(userid);
    axios.get(BASE_API + '/checkduplicates/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setDuplicateData(response.data["OutputJson"]);
            setDisplayIssue(prevState => ({
                ...prevState,
                "duplicate": response.data["isDuplicate"]
            }));
        }).catch(function (error) {
            console.log(error);
        });
};
const GetSkew = ({ userid, setSkewData, setDisplayIssue }) => {
    //console.log(userid);
    axios.get(BASE_API + '/checkskew/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setSkewData(response.data["OutputJson"]);
            setDisplayIssue(prevState => ({
                ...prevState,
                "skew": response.data["isSkew"]
            }));
        }).catch(function (error) {
            console.log(error);
        });
};
const GetDrift = ({ userid, setDriftData, setDisplayIssue }) => {
    //console.log(userid);
    axios.get(BASE_API + '/checkdatadrift/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setDriftData(response.data["OutputJson"]);
            setDisplayIssue(prevState => ({
                ...prevState,
                "drift": response.data["isDrift"]
            }));
        }).catch(function (error) {
            console.log(error);
        });
};
const GetCorrelation = ({ userid, setCorrelationData, setDisplayIssue }) => {
    //console.log(userid);
    axios.get(BASE_API + '/checkcorrelation/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setCorrelationData(response.data["OutputJson"]);
            setDisplayIssue(prevState => ({
                ...prevState,
                "correlation": response.data["isCorrelated"]
            }));
        }).catch(function (error) {
            console.log(error);
        });
};

const PostConfigData = ({ userid, cohort, selectedDataIssues }) => {
    axios.post(BASE_API + '/autocorrectandretrain', {
        UserId: userid,
        Cohort: cohort,
        JsonData: selectedDataIssues
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            /*"Access-Control-Allow-Origin": "*",*/
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
        }
    }).then(function (response) {
        //console.log(response.data["OutputJson"]);
        if (response.data["StatusCode"]) {
            // No action needed
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    }).catch(function (error) {
        console.log(error);
    });
};

export const DataIssueConfig = ({ userid, cohort, setActiveTab }) => {

    const onOutlierFilter = (value) => {
        outlierData.map((item, index) => {
            if (item.feature == value) {
                setOutlierMapData(item);
            }
        });
    };

    const selectGen = (issueName, isDisabled = false) => (
        <>
            <Tooltip
                placement="top"
                title={isDisabled ? "Unfortunately, this issue cannot be auto-corrected" : "Select to auto-correct"}
                overlayStyle={{ maxWidth: '400px' }}
            >
                <Checkbox disabled={isDisabled} onChange={() => { handleTickClick(issueName) }} />
            </Tooltip>
        </>
    );

    /* Use State Initializations */
    const [outlierData, setOutlierData] = useState([
        {
            "feature": "No feature",
            "status": false,
        }
    ]);
    const [duplicateData, setDuplicateData] = useState(
        {
            "duplicate_score": 0
        }
    );
    const [imblanceData, setImbalanceData] = useState({
        "majority": "non-diabetic",
        "majority_pct": 0,
        "minority": "diabetic",
        "minority_pct": 0
    });
    const [driftData, setDriftData] = useState({
        "overall": {
            "drift_score": 0
        },
        "feature": "No feature",
    }
    );
    const [skewData, setSkewData] = useState(
        {
            "skew_score": 0,
            "features": "No features"
        }
    );
    const [correlationData, setCorrelationData] = useState(
        {
            "corrScore": 0,
            "corrFeatures": "No features"
        }
    );
    const [displayIssue, setDisplayIssue] = useState(
        {
            "outlier": true,
            "correlation": true,
            "skew": true,
            "imbalance": true,
            "drift": true,
            "duplicate": true,
        }
    );

    const [outlierMapData, setOutlierMapData] = useState({
        "actuals": {
            "y_val": [0],
            "x_val": [0]
        },
        "corrected": {
            "y_val": [0],
            "x_val": [0]
        },
        "lower": 0,
        "upper": 0
    });

    const [selectedDataIssues, setSelectedDataIssues] = useState(
        {
            "outlier": false,
            "correlation": false,
            "skew": false,
            "imbalance": false,
            "drift": false,
            "duplicate": false,
        }
    );

    useEffect(() => {
        GetOutliers({ userid, setOutlierData, setDisplayIssue });
        GetImbalance({ userid, setImbalanceData, setDisplayIssue });
        GetDuplicates({ userid, setDuplicateData, setDisplayIssue });
        GetDrift({ userid, setDriftData, setDisplayIssue });
        GetCorrelation({ userid, setCorrelationData, setDisplayIssue });
        GetSkew({ userid, setSkewData, setDisplayIssue });
        setTimeout(function () {
            setWaitFlag(false);
        }, 4000);
    }, []);
    const [waitFlag, setWaitFlag] = useState(true);

    /* Methods */
    const handleTickClick = (feature) => {
        console.log(feature);
        setSelectedDataIssues({
            ...selectedDataIssues,
            [feature]: !selectedDataIssues[feature]
        });
    };

    const loadingIndicator = (
        <>
            <Spin tip="Fetching current data issues ...  " size="large" />
        </>
    );

    // Handle cancel button
    const handleCancelButton = () => {
        if (window.confirm('Do you want to revert all your changes?')) {
            setActiveTab("tab2");
            window.location.reload();
        }
    };

    // Handle retrain button
    const handleTrainButton = () => {
        setActiveTab("tab2");
        if (window.confirm('Do you want to auto-correct and re-train the machine learning model?')) {
            window.location.reload();
            setWaitFlag(true);
            PostConfigData({ userid, cohort, selectedDataIssues });
            setTimeout(function () {
                message.success("Model is successfully re-trained with latest changes.", 3);
                setWaitFlag(false);
            }, 3000);
    
        }
    };

    // Language variable
    // TO-DO: Take language preferred as input
    const lang = (1 == 1) ? tooltipEnglishContent : tooltipSloveneContent;

    return (
        waitFlag ? loadingIndicator :
            <>
                <div className='config-display-fc-r1'>
                    <div className='config-display-fc-r1-text'>
                        {"The following data quality issues have been observed in the training data:"}

                    </div>
                    <Tooltip
                        placement="top"
                        title={lang.dataConfig.title}
                        overlayStyle={{ maxWidth: '500px' }}
                    >
                        <div className='config-display-fc-r1-icon'>
                            <InfoLogo />
                        </div>
                    </Tooltip>
                </div>
                <div className='data-issue-list'>
                    <Collapse accordion>
                        {displayIssue.outlier ?
                            (<Panel header="Data Outliers" key="1" extra={selectGen("outlier")}>
                                <div className='data-issue-r1'>
                                    <span>{"Potential outliers have been found in the training dataset."}</span>
                                    <Select
                                        defaultValue={"Please select:"}
                                        style={{
                                            margin: '0 8px',
                                        }}
                                        onChange={onOutlierFilter}>

                                        {outlierData.map((item, index) => {
                                            if (item.status) {
                                                return (
                                                    <Option key={index} value={item.feature}>{item.feature}</Option>
                                                );
                                            }
                                        })}
                                    </Select>
                                </div>
                                <div className='data-issue-r2'>
                                    <div className='di-graph-left'>
                                        Before Correction
                                        <ConfigScatter x_values={outlierMapData.actuals.x_val} y_values={outlierMapData.actuals.y_val} outlierLimit={[outlierMapData.lower, outlierMapData.upper]} />
                                    </div>
                                    <div className='di-graph-middle'>
                                        {"---->"}
                                    </div>
                                    <div className='di-graph-right'>
                                        After Correction
                                        <ConfigScatter x_values={outlierMapData.corrected.x_val} y_values={outlierMapData.corrected.y_val} outlierLimit={[outlierMapData.lower, outlierMapData.upper]} />
                                    </div>
                                </div>
                                <div className='data-issue-r3'>
                                    <p>{"An outlier is data point which is significantly different from majority of the data points and does not follow the general patterns present in the data. Removing outliers can improve the prediction accuracy."}</p>
                                </div>
                            </Panel>) : null}
                        {displayIssue.correlation ?
                            (<Panel header="Data Correlation" key="2" extra={selectGen("correlation")}>
                                <div className='data-issue-r1'>
                                    <span>Feature correlation is detected in the training data with a correlation score of <span style={{ color: "#D64242", fontWeight: 600 }}>{correlationData.corrScore}%</span>. The following plots show example representations of correlation.</span>
                                </div>
                                <div className='data-issue-r2'>
                                    <div className='di-graph-left'>
                                        Positive Correlation
                                        <ConfigScatterCorr x_values={[1, 2, 3, 4, 5, 6, 7, 8]} y_values={[1, 3, 4, 5, 8, 6, 10, 12]} outlierLimit={[0, 0]} />
                                    </div>
                                    <div className='di-graph-left'>
                                        Negative Correlation
                                        <ConfigScatterCorr x_values={[1, 2, 3, 4, 5, 6, 7, 8]} y_values={[14, 11, 10, 6, 5, 3, 2, 1]} outlierLimit={[0, 0]} />
                                    </div>
                                    <div className='di-graph-middle'>
                                        {"---->"}
                                    </div>
                                    <div className='di-graph-right'>
                                        No Correlation
                                        <ConfigScatterCorr x_values={[1, 2, 3, 4, 5, 6, 7, 8]} y_values={[1, 12, 6, 8, 4, 14, 5, 8]} outlierLimit={[0, 20]} />
                                    </div>
                                </div>
                                <div className='data-issue-r3'>
                                    <p>{"Correlated features degrade the predictive power as they do not add new information to the model. Dropping highly correlated features is recommended during the training process to obtain a better prediction accuracy."}</p>
                                </div>
                            </Panel>) : null}
                        {displayIssue.skew ?
                            (<Panel header="Skewed Data" key="3" extra={selectGen("skew", true)}>
                                <div className='data-issue-r1'>
                                    <span>Skewness is detected in the training data with a skewness score of <span style={{ color: "#D64242", fontWeight: 600 }}>{skewData.skew_score}%</span>. The following plots show example representations of skewness.</span>
                                </div>
                                <div className='data-issue-r2'>
                                    <div className='di-graph-left'>
                                        Example: Left Skewed
                                        <DataIssueArea x_values={[1, 2, 3, 4, 5, 6, 7, 8]} y_values={[1, 2, 3, 3, 3, 3, 15, 1]} color1={"#D64242"} color2={"#D6424230"} />
                                    </div>
                                    <div className='di-graph-left'>
                                        Example: Right Skewed
                                        <DataIssueArea x_values={[1, 2, 3, 4, 5, 6, 7, 8]} y_values={[1, 15, 5, 4, 3, 3, 2, 1]} color1={"#D64242"} color2={"#D6424230"} />
                                    </div>
                                    <div className='di-graph-middle'>
                                        {"---->"}
                                    </div>
                                    <div className='di-graph-right'>
                                        Symmetrical Distribution
                                        <DataIssueArea x_values={[1, 2, 3, 4, 5, 6, 7, 8]} y_values={[1, 2, 5, 12, 12, 4, 1, 1]} color1={"#244CB1"} color2={"#244CB130"} />
                                    </div>
                                </div>
                                <div className='data-issue-r3'>
                                    <p>{"Data is considered to be skewed when the data distribution is asymmetrical. Predictive models trained on skewed data are more prone towards giving incorrect predictions. This issue cannot be auto-corrected. Please use configure features to manually adjust the data range to reduce skewness."}</p>
                                </div>
                            </Panel>) : null}
                        {displayIssue.imbalance ?
                            (<Panel header="Class Imbalance" key="4" extra={selectGen("imbalance")}>
                                <div className='data-issue-r1'>
                                    <span>The training data is imbalanced with {imblanceData.majority_pct}% {imblanceData.majority} patients and {imblanceData.minority_pct}% {imblanceData.minority} patients.</span>
                                </div>
                                <div className='data-issue-r2'>
                                    <div className='di-graph-left'>
                                        Before Correction
                                        <DataIssueBar x_values={[imblanceData.majority, imblanceData.minority]} y_values={[imblanceData.majority_pct, imblanceData.minority_pct]} />
                                    </div>
                                    <div className='di-graph-middle'>
                                        {"---->"}
                                    </div>
                                    <div className='di-graph-right'>
                                        After Correction
                                        <DataIssueBar x_values={[imblanceData.majority, imblanceData.minority]} y_values={[50, 50]} />
                                    </div>
                                </div>
                                <div className='data-issue-r3'>
                                    <p>{"Class imbalance is an issue in which the predictive model has a higher tendency to generate biased and unfair results towards the majority class. Correcting class imbalance can improve the overall prediction accuracy."}</p>
                                </div>
                            </Panel>) : null}
                        {displayIssue.drift ?
                            (<Panel header="Data Drift" key="5" extra={selectGen("drift", true)}>
                                <div className='data-issue-r1'>
                                    <span>Data drift is detected in the training data with a drift score of <span style={{ color: "#D64242", fontWeight: 600 }}>{driftData.overall.drift_score}%</span>. The following plots show example representations of data drift.</span>
                                </div>
                                <div className='data-issue-r2'>
                                    <div className='di-graph-left'>
                                        With Data Drift
                                        <DataDriftArea
                                            x_values={[1, 2, 3, 4, 5, 6, 7, 8]}
                                            y1_values={[1, 8, 15, 6, 1, 1, 2, 1]}
                                            primColor1={"#244CB1"}
                                            secColor1={"#244CB130"}
                                            y2_values={[1, 2, 2, 1, 2, 5, 9, 3]}
                                            primColor2={"#D64242"}
                                            secColor2={"#D6424230"}
                                        />
                                    </div>
                                    <div className='di-graph-middle'>
                                        {"---->"}
                                    </div>
                                    <div className='di-graph-right'>
                                        Without Data Drift
                                        <DataDriftArea
                                            x_values={[1, 2, 3, 4, 5, 6, 7, 8]}
                                            y1_values={[1, 2, 3, 6, 8, 6, 4, 2]}
                                            primColor1={"#244CB1"}
                                            secColor1={"#244CB130"}
                                            y2_values={[1, 1, 3, 4, 6, 5, 3, 1]}
                                            primColor2={"#D64242"}
                                            secColor2={"#D6424230"}
                                        />
                                    </div>
                                </div>
                                <div className='data-issue-r3'>
                                    <p>{"Data drift is detected when the underlying patterns, distributions of the current data changes from the distribution of the training data. It can result in the predictive model making incorrect or outdated predictions. Thus, the predictive accuracy decreases due to data drift."}</p>
                                </div>
                            </Panel>) : null}
                        {displayIssue.duplicate ?
                            (<Panel header="Duplicate Data" key="6" extra={selectGen("duplicate")}>
                                <div className='data-issue-r1'>
                                    <span>The training data contains <span style={{ color: "#D64242", fontWeight: 600 }}>{duplicateData.duplicate_score}%</span> duplicate records.</span>
                                </div>
                                <div className='data-issue-r3'>
                                    <p>{"Training a predictive model with duplicate or redundant records add more bias to model, thus, increasing the prediction error. Removing duplicate records from training data can increase the prediction accuracy."}</p>
                                </div>
                            </Panel>) : null}
                    </Collapse>
                </div>
                <div className='config-display-fc-r3'>
                    <div className='config-display-fc-r3-text'>
                        * You can auto correct the selected issues and re-train the model Please note that resolving these issues may or may not improve prediction accuracy.
                    </div>
                    <div className='config-display-fc-r3-item'>
                        <button
                            className="cancel-button"
                            type="submit"
                            onClick={() => { handleCancelButton() }}
                        >
                            Cancel changes
                        </button>
                        <button
                            className="train-button"
                            type="submit"
                            onClick={() => { handleTrainButton()}}
                        >
                            {"Autocorrect and Re-train"}
                        </button>
                    </div>
                </div>
            </>
    );
};