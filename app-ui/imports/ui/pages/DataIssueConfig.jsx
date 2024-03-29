import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfoLogo } from '../components/Icons/InfoLogo';
import { Collapse, Checkbox, Select, Spin, Tooltip, message } from 'antd';
const { Panel } = Collapse;
const { Option } = Select;
import { ConfigScatter, ConfigScatterCorr } from '../components/ConfigCharts/ConfigScatter';
import {
    BASE_API,
    DATA_SUMMARY_DEFAULT_MODEL,
    DATA_ISSUE_FRIENDLY_NAMES_Eng,
    DATA_ISSUE_FRIENDLY_NAMES_Slo,
    FRIENDLY_NAMES_ENG,
    FRIENDLY_NAMES_SLO,
    FEAT_DESCRIPTIONS_SLO
} from '../Constants.jsx';
import axios from 'axios';
import { DataIssueBar } from '../components/ConfigCharts/DataIssueBar';
import { DataIssueArea, DataDriftArea } from '../components/ConfigCharts/DataIssueArea';
import { tooltipEnglishContent } from '../tooltipContent/tooltipEnglishContent';
import { tooltipSloveneContent } from '../tooltipContent/tooltipSloveneContent';
import { GetConfigData} from './Configuration.jsx';



const PostConfigData = ({ userid, cohort, group, selectedDataIssues, navigate }) => {
    axios.post(BASE_API + '/autocorrectandretrain', {
        UserId: userid,
        Cohort: group,
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
            // Navigate to main dashboard            
            navigate('/dashboard/' + cohort);
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    }).catch(function (error) {
        console.log(error);
    });
};

const PostInteractions = ({ userid, group, interactioData }) => {
    axios.post(BASE_API + '/trackinteractions', {
        UserId: userid,
        Cohort: group,
        JsonData: interactioData
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
        }
    }).then(function (response) {
        //console.log(response.data["OutputJson"]);
        if (response.data["StatusCode"]) {
            // Fire and Forget
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    }).catch(function (error) {
        console.log(error);
    });
};

const RestoreConfigData = ({ userid, group, featureConfig }) => {
    axios.post(BASE_API + '/restoreandretrain', {
        UserId: userid,
        Cohort: group,
        JsonData: featureConfig
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
        }
    }).then(function (response) {
        //console.log(response.data["OutputJson"]);
        if (response.data["StatusCode"]) {
            // Call Get Config Data 
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    }).catch(function (error) {
        console.log(error);
    });
};

export const DataIssueConfig = ({ userid, cohort, group, language,
    outlierData, setOutlierData,
    duplicateData, setDuplicateData,
    imblanceData, setImbalanceData,
    driftData, setDriftData,
    skewData, setSkewData,
    correlationData, setCorrelationData,
    displayIssue, setDisplayIssue,
    outlierMapData, setOutlierMapData,
    selectedDataIssues, setSelectedDataIssues,
    waitFlag, setWaitFlag,
    setActiveTab
}) => {

    const navigate = useNavigate();

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
                title={isDisabled
                    ?
                    language == "ENG"
                        ? "Unfortunately, this issue cannot be auto-corrected"
                        : "Žal te težave ni mogoče samodejno popraviti"
                    :
                    language == "ENG"
                        ? "Select to auto-correct"
                        : "Izberite za samodejno popravljanje"
                }
                overlayStyle={{ maxWidth: '400px' }}
            >
                <Checkbox checked={selectedDataIssues[issueName]} disabled={isDisabled} onChange={() => { handleTickClick(issueName) }} />
            </Tooltip>
        </>
    );





    /* Methods */
    const handleTickClick = (feature) => {
        setSelectedDataIssues({
            ...selectedDataIssues,
            [feature]: !selectedDataIssues[feature]
        });

        /*
        let interactioData = {
            "viz": "autoCorrect",
            "eventType": "click",
            "description": feature,
            "timestamp": Date().toString(),
            "duration": 0
        }
        */

        //PostInteractions({ userid, group, interactioData }); // disabling logs
    };

    // Hover time for interaction data
    var startTime, endTime;
    const handleMouseIn = () => {
        startTime = new Date();
    };
    const handleMouseOut = (viz, feature) => {
        /* 
        // Do nothing -- disabling logs
        endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds
        var duration = Math.round(timeDiff % 60);

        let interactioData = {
            "viz": viz,
            "eventType": "hover",
            "description": feature,
            "timestamp": Date().toString(),
            "duration": duration
        }
        */

        // PostInteractions({ userid, group, interactioData }); // disabling logs
    };

    const loadingIndicator = (
        <>
            <Spin tip=
                {
                    (language == "ENG")
                        ? "Fetching current data issues ..."
                        : "Pridobivanje trenutnih težav s podatki ..."
                }
                size="large" />
        </>
    );

    // Handle cancel button
    const handleCancelButton = () => {
        if (window.confirm(
            language == "ENG"
                ? "Do you want to revert all your changes?"
                : "Ali želite razveljaviti vse svoje spremembe?"
        )) {
            setActiveTab("tab2");
            window.location.reload();
        }
    };

    // Handle retrain button
    const handleTrainButton = () => {
        setActiveTab("tab2");
        if (window.confirm(
            language == "ENG"
                ? 'Do you want to auto-correct and re-train the machine learning model?'
                : 'Ali želite samodejno popraviti in znova usposobiti model strojnega učenja?'
        )) {
            PostConfigData({ userid, cohort, group, selectedDataIssues, navigate });
            setWaitFlag(true);
            setTimeout(function () {
                message.success(
                    language == "ENG"
                        ? "Model is successfully re-trained with latest changes."
                        : "Model je uspešno ponovno usposobljen z najnovejšimi spremembami."
                    , 3);
                setWaitFlag(false);
            }, 4000);

        }
    };

    // handle reset button
    const handleResetButton = () => {
        GetConfigData({ userid, DATA_SUMMARY_DEFAULT_MODEL });
        if (window.confirm(
            language == "ENG"
                ? "Do you want to reset to default values?"
                : "Ali želite ponastaviti na privzete vrednosti?"
        )) {            
            RestoreConfigData({ userid, group, DATA_SUMMARY_DEFAULT_MODEL });
            setWaitFlag(true);
            setTimeout(function () {
                message.success("Default model is restored. Redirecting to dashboard ...", 3);
                setWaitFlag(false);
                navigate('/dashboard/' + cohort);
            }, 3000);
        }
    };

    // Language variable
    const lang = (language == 'ENG') ? tooltipEnglishContent : tooltipSloveneContent;
    const DATA_ISSUE_FRIENDLY_NAMEs = (language == 'ENG') ? DATA_ISSUE_FRIENDLY_NAMES_Eng : DATA_ISSUE_FRIENDLY_NAMES_Slo;
    const FRIENDLY_NAMES = (language == "ENG") ? FRIENDLY_NAMES_ENG : FRIENDLY_NAMES_SLO;

    return (
        waitFlag ? loadingIndicator :
            <>
                <div className='config-display-fc-r1'>
                    <div className='config-display-fc-r1-text'>
                        The following data quality issues have been observed in the training data:
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
                        <Panel header={DATA_ISSUE_FRIENDLY_NAMEs["outlier"]} key="1" extra={selectGen("outlier")} >
                            <div className='data-issue-r1' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "outlier") }}>
                                <span>
                                    Potential outliers have been found in the training dataset.
                                </span>
                                <Select
                                    defaultValue={
                                        (language == "ENG")
                                            ? "Please select:"
                                            : "Prosim izberite"
                                    }
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
                            <div className='data-issue-r2' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "outlier") }}>
                                <div className='di-graph-left'>
                                    {
                                        (language == "ENG")
                                            ? "Before Correction"
                                            : "Pred popravkom"
                                    }
                                    <ConfigScatter x_values={outlierMapData.actuals.x_val} y_values={outlierMapData.actuals.y_val} outlierLimit={[outlierMapData.lower, outlierMapData.upper]} />
                                </div>
                                <div className='di-graph-middle'>
                                    {"---->"}
                                </div>
                                <div className='di-graph-right'>
                                    {
                                        (language == "ENG")
                                            ? "After Correction"
                                            : "Po popravku"
                                    }
                                    <ConfigScatter x_values={outlierMapData.corrected.x_val} y_values={outlierMapData.corrected.y_val} outlierLimit={[outlierMapData.lower, outlierMapData.upper]} />
                                </div>
                            </div>
                            <div className='data-issue-r3' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "outlier") }}>
                                <p>
                                    {
                                        (language == "ENG")
                                            ? "An outlier is data point which is significantly different from majority of the data points and does not follow the general patterns present in the data. Removing outliers can improve the prediction accuracy."
                                            : "Izstopajoča vrednost je podatkovna točka, ki se bistveno razlikuje od večine podatkovnih točk in ne sledi splošnim vzorcem, prisotnim v podatkih. Z odstranitvijo izstopajočih vrednosti se lahko izboljša točnost napovedi."
                                    }
                                </p>
                            </div>
                        </Panel>
                        <Panel header={DATA_ISSUE_FRIENDLY_NAMEs["correlation"]} key="2" extra={selectGen("correlation")}>
                            <div className='data-issue-r1' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "correlation") }}>
                                <span>
                                    {
                                        (language == "ENG")
                                            ? "Feature correlation is detected in the training data with a correlation score of "
                                            : "Korelacija značilnosti je zaznana v podatkih o usposabljanju s korelacijsko oceno "
                                    }
                                    <span style={{ color: "#D64242", fontWeight: 600 }}>{correlationData.corrScore}%</span>
                                    {
                                        (language == "ENG")
                                            ? ". The following plots show example representations of correlation."
                                            : ". Naslednji diagrami prikazujejo primere predstavitev korelacije."
                                    }
                                </span>
                            </div>
                            <div className='data-issue-r2' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "correlation") }}>
                                <div className='di-graph-left'>
                                    {
                                        (language == "ENG")
                                            ? "Positive Correlation"
                                            : "Pozitivna korelacija"
                                    }
                                    <ConfigScatterCorr x_values={[1, 2, 3, 4, 5, 6, 7, 8]} y_values={[1, 3, 4, 5, 8, 6, 10, 12]} outlierLimit={[0, 0]} />
                                </div>
                                <div className='di-graph-left'>
                                    {
                                        (language == "ENG")
                                            ? "Negative Correlation"
                                            : "Negativna korelacija"
                                    }
                                    <ConfigScatterCorr x_values={[1, 2, 3, 4, 5, 6, 7, 8]} y_values={[14, 11, 10, 6, 5, 3, 2, 1]} outlierLimit={[0, 0]} />
                                </div>
                                <div className='di-graph-middle'>
                                    {"---->"}
                                </div>
                                <div className='di-graph-right'>
                                    {
                                        (language == "ENG")
                                            ? "No Correlation"
                                            : "Brez korelacije"
                                    }
                                    <ConfigScatterCorr x_values={[1, 2, 3, 4, 5, 6, 7, 8]} y_values={[1, 12, 6, 8, 4, 14, 5, 8]} outlierLimit={[0, 20]} />
                                </div>
                            </div>
                            <div className='data-issue-r3' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "correlation") }}>
                                <p>
                                    {
                                        (language == "ENG")
                                            ? "Correlated features degrade the predictive power as they do not add new information to the model. Dropping highly correlated features is recommended during the training process to obtain a better prediction accuracy."
                                            : "Korelirani elementi zmanjšujejo napovedno moč, saj modelu ne dodajajo novih informacij. Za doseganje boljše natančnosti napovedovanja je med postopkom usposabljanja priporočljivo opustiti zelo korelirane značilnosti."
                                    }
                                </p>
                            </div>
                        </Panel>
                        <Panel header={DATA_ISSUE_FRIENDLY_NAMEs["skew"]} key="3" extra={selectGen("skew", true)}>
                            <div className='data-issue-r1' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "skew") }}>
                                <span>
                                    {
                                        (language == "ENG")
                                            ? "Skewness is detected in the training data with a skewness score of "
                                            : "Asimetrija je zaznana v podatkih o vadbi z oceno asimetrije "
                                    }
                                    <span style={{ color: "#D64242", fontWeight: 600 }}>{skewData.skew_score}%</span>
                                    {
                                        (language == "ENG")
                                            ? ". The following plots show example representations of skewness."
                                            : ". Naslednji diagrami prikazujejo primere prikazov poševnosti/asimtrije."
                                    }
                                </span>
                            </div>
                            <div className='data-issue-r2' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "skew") }}>
                                <div className='di-graph-left'>
                                    {
                                        (language == "ENG")
                                            ? "Example: Left Skewed"
                                            : "Primer: levo asimetrija"
                                    }
                                    <DataIssueArea x_values={[1, 2, 3, 4, 5, 6, 7, 8]} y_values={[1, 2, 3, 3, 3, 3, 15, 1]} color1={"#D64242"} color2={"#D6424230"} />
                                </div>
                                <div className='di-graph-left'>
                                    {
                                        (language == "ENG")
                                            ? "Example: Right Skewed"
                                            : "Primer: desno asimetrija"
                                    }
                                    <DataIssueArea x_values={[1, 2, 3, 4, 5, 6, 7, 8]} y_values={[1, 15, 5, 4, 3, 3, 2, 1]} color1={"#D64242"} color2={"#D6424230"} />
                                </div>
                                <div className='di-graph-middle'>
                                    {"---->"}
                                </div>
                                <div className='di-graph-right'>
                                    {
                                        (language == "ENG")
                                            ? "Symmetrical Distribution"
                                            : "Simetrična porazdelitev"
                                    }
                                    <DataIssueArea x_values={[1, 2, 3, 4, 5, 6, 7, 8]} y_values={[1, 2, 5, 12, 12, 4, 1, 1]} color1={"#491d8b"} color2={"#491d8b30"} />
                                </div>
                            </div>
                            <div className='data-issue-r3' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "skew") }}>
                                <p>
                                    {
                                        (language == "ENG")
                                            ? "Data is considered to be skewed when the data distribution is asymmetrical. Predictive models trained on skewed data are more prone towards giving incorrect predictions. This issue cannot be auto-corrected. Please use configure features to manually adjust the data range to reduce skewness."
                                            : "Za podatke velja, da so poševni, kadar je porazdelitev podatkov asimetrična. Napovedni modeli, usposobljeni na poševnih podatkih, so bolj nagnjeni k dajanju napačnih napovedi."
                                    }
                                </p>
                            </div>
                        </Panel>
                        <Panel header={DATA_ISSUE_FRIENDLY_NAMEs["imbalance"]} key="4" extra={selectGen("imbalance")}>
                            <div className='data-issue-r1' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "imbalance") }}>
                                {
                                    (language == "ENG")
                                        ? <span>The training data is imbalanced with {imblanceData.majority_pct}% {imblanceData.majority} patients and {imblanceData.minority_pct}% {imblanceData.minority} patients.</span>
                                        : <span>Podatki za učenje so neuravnoteženi, saj je {imblanceData.majority_pct}% pacientov brez sladkorne bolezni in {imblanceData.minority_pct}% pacientov s sladkorno boleznijo.</span>
                                }
                            </div>
                            <div className='data-issue-r2' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "imbalance") }}>
                                <div className='di-graph-left'>
                                    {
                                        (language == "ENG")
                                            ? "Before Correction"
                                            : "Pred popravkom"
                                    }
                                    <DataIssueBar x_values={[imblanceData.majority, imblanceData.minority]} y_values={[imblanceData.majority_pct, imblanceData.minority_pct]} />
                                </div>
                                <div className='di-graph-middle'>
                                    {"---->"}
                                </div>
                                <div className='di-graph-right'>
                                    {
                                        (language == "ENG")
                                            ? "After Correction"
                                            : "Po popravku"
                                    }
                                    <DataIssueBar x_values={[imblanceData.majority, imblanceData.minority]} y_values={[50, 50]} />
                                </div>
                            </div>
                            <div className='data-issue-r3' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "imbalance") }}>
                                <p>
                                    {
                                        (language == "ENG")
                                            ? "Class imbalance is an issue in which the predictive model has a higher tendency to generate biased and unfair results towards the majority class. Correcting class imbalance can improve the overall prediction accuracy."
                                            : "Neuravnoteženost razredov je težava, pri kateri je napovedni model bolj nagnjen k ustvarjanju pristranskih in nepravičnih rezultatov za večinski razred. S popravljanjem neuravnoteženosti razredov se lahko izboljša splošna natančnost napovedovanja."
                                    }
                                </p>
                            </div>
                        </Panel>
                        <Panel header={DATA_ISSUE_FRIENDLY_NAMEs["drift"]} key="5" extra={selectGen("drift", true)}>
                            <div className='data-issue-r1' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "drift") }}>
                                {
                                    (language == "ENG")
                                        ? <span>Data drift is detected in the training data with a drift score of <span style={{ color: "#D64242", fontWeight: 600 }}>{driftData.overall.drift_score}%</span>. The following plots show example representations of data drift.</span>
                                        : <span> Odstopanje podatkov je zaznano v podatkih za učenje z oceno odstopanja <span style={{ color: "#D64242", fontWeight: 600 }}>{driftData.overall.drift_score}%</span>. Naslednji diagrami prikazujejo primere prikazov premikanja podatkov. </span>
                                }
                            </div>
                            <div className='data-issue-r2' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "drift") }}>
                                <div className='di-graph-left'>
                                    {
                                        (language == "ENG")
                                            ? "With Data Drift"
                                            : "Z odstopanjem podatkov"
                                    }
                                    <DataDriftArea
                                        x_values={[1, 2, 3, 4, 5, 6, 7, 8]}
                                        y1_values={[1, 8, 15, 6, 1, 1, 2, 1]}
                                        primColor1={"#491d8b"}
                                        secColor1={"#491d8b30"}
                                        y2_values={[1, 2, 2, 1, 2, 5, 9, 3]}
                                        primColor2={"#D64242"}
                                        secColor2={"#D6424230"}
                                    />
                                </div>
                                <div className='di-graph-middle'>
                                    {"---->"}
                                </div>
                                <div className='di-graph-right'>
                                    {
                                        (language == "ENG")
                                            ? "Without Data Drift"
                                            : "Brez odstopanja podatkov"
                                    }
                                    <DataDriftArea
                                        x_values={[1, 2, 3, 4, 5, 6, 7, 8]}
                                        y1_values={[1, 2, 3, 6, 8, 6, 4, 2]}
                                        primColor1={"#491d8b"}
                                        secColor1={"#491d8b30"}
                                        y2_values={[1, 1, 3, 4, 6, 5, 3, 1]}
                                        primColor2={"#D64242"}
                                        secColor2={"#D6424230"}
                                    />
                                </div>
                            </div>
                            <div className='data-issue-r3' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "drift") }}>
                                <p>
                                    {
                                        (language == "ENG")
                                            ? "Data drift is detected when the underlying patterns, distributions of the current data changes from the distribution of the training data. It can result in the predictive model making incorrect or outdated predictions. Thus, the predictive accuracy decreases due to data drift."
                                            : "Odstopanje podatkov se zazna, ko se spremenijo osnovni vzorci in porazdelitve podatkov. Zaradi tega lahko napovedni model pripravi napačne ali zastarele napovedi."
                                    }
                                </p>
                            </div>
                        </Panel>
                        <Panel header={DATA_ISSUE_FRIENDLY_NAMEs["duplicate"]} key="6" extra={selectGen("duplicate")}>
                            <div className='data-issue-r1' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "duplicate") }}>
                                {
                                    (language == "ENG")
                                        ? <span>The training data contains <span style={{ color: "#D64242", fontWeight: 600 }}>{duplicateData.duplicate_score}%</span> duplicate records.</span>
                                        : <span> Podatki za usposabljanje vsebujejo <span style={{ color: "#D64242", fontWeight: 600 }}>{duplicateData.duplicate_score}%</span> podvojenih zapisov. </span>
                                }
                            </div>
                            <div className='data-issue-r3' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("autoCorrect", "duplicate") }}>
                                <p>
                                    {
                                        (language == "ENG")
                                            ? "Training a predictive model with duplicate or redundant records add more bias to model, thus, increasing the prediction error. Removing duplicate records from training data can increase the prediction accuracy."
                                            : "Usposabljanje napovednega modela s podvojenimi ali odvečnimi zapisi doda več pristranskosti modelu in tako poveča napako napovedi. Z odstranitvijo podvojenih zapisov iz podatkov za učenje lahko povečate natančnost napovedovanja."
                                    }
                                </p>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
                <div className='config-display-fc-r3'>
                    <div className='config-display-fc-r3-text'>
                        {
                            (language == "ENG")
                                ? "* You can auto correct the selected issues and re-train the model. Please note that resolving these issues may or may not improve prediction accuracy."
                                : "* Izbrane težave lahko samodejno popravite in ponovno usposobite model. Upoštevajte, da reševanje teh težav lahko izboljša točnost napovedi ali pa tudi ne."
                        }
                    </div>
                    <div className='config-display-fc-r3-item'>
                        <button
                            className="reset-button"
                            type="submit"
                            onClick={() => { handleResetButton() }}
                        >
                            {
                                language == "ENG"
                                    ? "Reset to defaults"
                                    : "Ponastavi na privzeto"
                            }
                        </button>
                        <button
                            className="cancel-button"
                            type="submit"
                            onClick={() => { handleCancelButton() }}
                        >
                            {
                                (language == "ENG")
                                    ? "Cancel changes"
                                    : "Prekliči spremembe"
                            }
                        </button>
                        <button
                            className="train-button"
                            type="submit"
                            onClick={() => { handleTrainButton() }}
                        >
                            {
                                (language == "ENG")
                                    ? "Autocorrect and Re-train"
                                    : "Samodejni popravek"
                            }
                        </button>
                    </div>
                </div>
            </>
    );
};