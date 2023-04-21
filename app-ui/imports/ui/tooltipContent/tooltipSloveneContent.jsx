export const tooltipSloveneContent = {
    "dce": {
        "accuracyChart": {
            "title": "Ta vizualni prikaz prikazuje splošno natančnost modela napovedi. Prikazuje tudi velikost nabora podatkov in število značilnosti, ki so prisotne v naboru podatkov. Poleg tega prikazuje razliko v rezultatih med trenutno nastavitvijo in prejšnjo nastavitvijo.",
            "trainingSamples": "Število zapisov, uporabljenih za usposabljanje modela napovedovanja. Priporočljivo je imeti zadostno število vzorcev za usposabljanje, da bi dobili natančne napovedi. Če je vzorcev za usposabljanje manj, je lahko natančnost napovedi nizka.",
            "featuresConsidered": "Število dejavnikov tveganja, izbranih za usposabljanje modela napovedovanja. Priporočljivo je, da se model usposobi na podlagi ustreznih značilnosti. Moteči in nepomembni elementi lahko zmanjšajo natančnost napovedovanja.",
            "upScore": "Zelo dobro! Vaše trenutne nastavitve so povečale natančnost napovedi.",
            "downScore": "Poskusite z drugo konfiguracijo, saj so vaše trenutne nastavitve zmanjšale natančnost napovedi.",
            "autoCorrectOn" : "Izbrali ste možnost samodejnega odpravljanja težav s podatki. Če želite razveljaviti samodejne spremembe, ponovno vzpostavite privzeti model.",
        },
        "keyInsights": {
            "title": "Ta vizualni prikaz prikazuje zanimive informacije o naboru podatkov za usposabljanje in dejavnikih tveganja. Ta vizualni prikaz lahko uporabite za iskanje morebitnih neobičajnih vzorcev v podatkih za usposabljanje.",
        },
        "dataDensity": {
            "title": "Ta vizualni prikaz prikazuje porazdelitev števila pacientov za vsak dejavnik tveganja v naboru podatkov. S tem lahko poiščete povprečno vrednost dejavnika tveganja (prikazano s črno oznako), opazujete grafično porazdelitev podatkov in vidite morebitne nepravilnosti, ki so prisotne v podatkih.",
            "extreme" : "Območje v grafu, ki je prikazano z rožnato barvo, označuje morebitne nenormalne vrednosti v podatkih",
            "nonExtreme" : "Območje v grafu, prikazano z modro barvo, označuje neekstremne vrednosti v podatkih"
        },
        "dataQuality": {
            "title": "Ta vizualni prikaz prikazuje splošno kakovost nabora podatkov. Vidite lahko tudi, ali na nabor podatkov vplivajo kakršne koli težave s podatki.",
            "skew" : "Data is considered to be skewed when the data distribution is asymmetrical. Predictive models trained on skewed data are more prone towards giving incorrect predictions.",
            "outlier" : "An outlier is data point which is significantly different from majority of the data points and does not follow the general patterns present in the data. Removing outliers can improve the prediction accuracy.",
            "drift" : "Data drift is detected when the underlying patterns, distributions of the data changes. It can result in the predictive model making incorrect or outdated predictions.",
            "duplicate" : "Training a predictive model with duplicate or redundant records add more bias to model, thus, increasing the prediction error. Removing duplicate records from training data can increase the prediction accuracy.",
            "imbalance" : "Class imbalance is an issue in which the predictive model has a higher tendency to generate biased and unfair results towards the majority class. Correcting class imbalance can improve the overall prediction accuracy.",
            "correlation" : "Correlated features degrade the predictive power as they do not add new information to the model. Dropping highly correlated features is recommended during the training process to obtain a better prediction accuracy.",
        }
    },
    "mce": {
        "accuracyChart": {
            "title": "Ta vizualni prikaz prikazuje splošno natančnost modela napovedi. Prikazuje tudi velikost nabora podatkov in število značilnosti, ki so prisotne v naboru podatkov. Poleg tega prikazuje razliko v rezultatih med trenutno nastavitvijo in prejšnjo nastavitvijo.",
            "trainingSamples": "Število zapisov, uporabljenih za usposabljanje modela napovedovanja. Priporočljivo je imeti zadostno število vzorcev za usposabljanje, da bi dobili natančne napovedi. Če je vzorcev za usposabljanje manj, je lahko natančnost napovedi nizka.",
            "featuresConsidered": "Število dejavnikov tveganja, izbranih za usposabljanje modela napovedovanja. Priporočljivo je, da se model usposobi na podlagi ustreznih značilnosti. Moteči in nepomembni elementi lahko zmanjšajo natančnost napovedovanja.",
            "upScore": "Zelo dobro! Vaše trenutne nastavitve so povečale natančnost napovedi.",
            "downScore": "Poskusite z drugo konfiguracijo, saj so vaše trenutne nastavitve zmanjšale natančnost napovedi.",
            "autoCorrectOn" : "Izbrali ste možnost samodejnega odpravljanja težav s podatki. Če želite razveljaviti samodejne spremembe, ponovno vzpostavite privzeti model.",
        },
        "decisionRule": {
            "title": "a slika prikazuje najpomembnejše pogoje, ki jih upošteva model za napovedovanje diabetičnih in nediabetičnih stanj. Za prikaz pravil odločanja za diabetična in nediabetična stanja lahko uporabite spodnji upravljalnik preklopa.",
        },
        "featureImportance": {
            "title": "Ta slika prikazuje pomembne dejavnike tveganja in njihovo pomembnost, kot jih upošteva model napovedi. Značilnosti, ki jih je mogoče uporabiti, so dejavniki tveganja, ki jih lahko pacienti učinkovito nadzorujejo. Medtem ko so funkcije, ki jih ni mogoče uporabiti dejavniki tveganja, ki jih pacienti ne morejo spremeniti, vendar so lahko kljub temu pomembni za postopek odločanja.",
            "actionable": "Akcijske značilnosti so dejavniki tveganja, ki jih pacienti lahko učinkovito nadzorujejo.",
            "nonActionable": "Neakcijske značilnosti so dejavniki tveganja, ki jih pacienti ne morejo učinkovito spremeniti, vendar so lahko kljub temu pomembni za proces odločanja."
        },
    },
    "featureConfig" : {
        "title" : "Na tej strani lahko konfigurirate podatke za usposabljanje. Izberite dejavnike tveganja, za katere menite, da so pomembni za napovedni model. Če opazite neobičajno ali ekstremno vrednost podatkov za katerega koli od dejavnikov tveganja, lahko s krmilnikom drsnika filtrirate podatke in ponovno usposobite model.",
        "diabetesStatus": "Ta slika prikazuje delež diabetičnih in nediabetičnih bolnikov v podatkih o usposabljanju. Za večjo natančnost napovedi je priporočljivo, da sta deleža bolnikov s sladkorno boleznijo in bolnikov brez sladkorne bolezni skoraj enaka.",
        "glucose" : "Plazemska koncentracija glukoze v slini po dveh urah po zaužitju hrane pri oralnem tolerančnem testu z glukozo. Meri se v mg/dl",
        "pregnancies" : "Število nosečnosti v preteklosti",
        "pressure": "Diastolični krvni tlak pacientov, izmerjen v mmHg",
        "skinfold" : "Debelina kožne gube tricepsa pri pacientih",
        "insulin" : "Dveurni serumski inzulin, izmerjen v U/ml",
        "bmi" : "Indeks telesne mase pacientov (BMI)",
        "dpf" : "Funkcija rodovnika sladkorne bolezni je funkcija, ki oceni verjetnost sladkorne bolezni na podlagi družinske anamneze",
        "age" : "Starost pacientov v letih"
    },
    "dataConfig" : {
        "title": "Te težave s podatki lahko razširite, če želite izvedeti več o teh težavah s podatki. Izberete lahko tudi težave s podatki, ki jih želite samodejno popraviti in ponovno usposobiti. Upoštevajte, da lahko samodejno popravljanje podatkovnih težav izboljša kakovost podatkov, vendar lahko izboljša natančnost napovedi ali pa tudi ne. Prav tako lahko samodejno popravljanje ene podatkovne težave uvede druge težave."
    }
};