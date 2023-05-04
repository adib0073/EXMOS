export const tooltipSloveneContent = {
    "dce": {
        "accuracyChart": {
            "title": "Ta vizualni prikaz prikazuje splošno natančnost modela napovedi. Prikazuje tudi velikost nabora podatkov in število značilnosti, ki so prisotne v naboru podatkov. Poleg tega prikazuje razliko v rezultatih med trenutno nastavitvijo in prejšnjo nastavitvijo.",
            "trainingSamples": "Število zapisov, uporabljenih za usposabljanje modela napovedovanja. Priporočljivo je imeti zadostno število vzorcev za usposabljanje, da bi dobili natančne napovedi. Če je vzorcev za usposabljanje manj, je lahko natančnost napovedi nizka.",
            "featuresConsidered": "Število dejavnikov tveganja, izbranih za usposabljanje modela napovedovanja. Priporočljivo je, da se model usposobi na podlagi ustreznih značilnosti. Moteči in nepomembni elementi lahko zmanjšajo natančnost napovedovanja.",
            "upScore": "Zelo dobro! Vaše trenutne nastavitve so povečale točnost napovedi.",
            "downScore": "Poskusite z drugo konfiguracijo, saj so vaše trenutne nastavitve zmanjšale točnost napovedi.",
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
            "skew" : "Za podatke velja, da so poševni, kadar je porazdelitev podatkov asimetrična. Napovedni modeli, usposobljeni na poševnih podatkih, so bolj nagnjeni k dajanju napačnih napovedi.",
            "outlier" : "Izstopajoča vrednost je podatkovna točka, ki se bistveno razlikuje od večine podatkovnih točk in ne sledi splošnim vzorcem, prisotnim v podatkih. Z odstranitvijo izstopajočih vrednosti se lahko izboljša točnost napovedi.",
            "drift" : "Izstopajoča vrednost je podatkovna točka, ki se bistveno razlikuje od večine podatkovnih točk in ne sledi splošnim vzorcem, prisotnim v podatkih. Z odstranitvijo izstopajočih vrednosti se lahko izboljša točnost napovedi.",
            "duplicate" : "Usposabljanje napovednega modela s podvojenimi ali odvečnimi zapisi doda več pristranskosti modelu in tako poveča napako napovedi. Z odstranitvijo podvojenih zapisov iz podatkov za učenje lahko povečate natančnost napovedovanja.",
            "imbalance" : "Neuravnoteženost razredov je težava, pri kateri je napovedni model bolj nagnjen k ustvarjanju pristranskih in nepravičnih rezultatov za večinski razred. S popravljanjem neuravnoteženosti razredov se lahko izboljša splošna natančnost napovedovanja.",
            "correlation" : "Korelirani elementi zmanjšujejo napovedno moč, saj modelu ne dodajajo novih informacij. Za doseganje boljše natančnosti napovedovanja je med postopkom usposabljanja priporočljivo opustiti zelo korelirane značilnosti.",
        }
    },
    "mce": {
        "accuracyChart": {
            "title": "Ta vizualni prikaz prikazuje splošno natančnost modela napovedi. Prikazuje tudi velikost nabora podatkov in število značilnosti, ki so prisotne v naboru podatkov. Poleg tega prikazuje razliko v rezultatih med trenutno nastavitvijo in prejšnjo nastavitvijo.",
            "trainingSamples": "Število zapisov, uporabljenih za usposabljanje modela napovedovanja. Priporočljivo je imeti zadostno število vzorcev za usposabljanje, da bi dobili natančne napovedi. Če je vzorcev za usposabljanje manj, je lahko točnost napovedi nizka.",
            "featuresConsidered": "Število dejavnikov tveganja, izbranih za usposabljanje modela napovedovanja. Priporočljivo je, da se model usposobi na podlagi ustreznih značilnosti. Moteči in nepomembni elementi lahko zmanjšajo natančnost napovedovanja.",
            "upScore": "Zelo dobro! Vaše trenutne nastavitve so povečale točnost napovedi.",
            "downScore": "Poskusite z drugo konfiguracijo, saj so vaše trenutne nastavitve zmanjšale točnost napovedi.",
            "autoCorrectOn" : "Izbrali ste možnost samodejnega odpravljanja težav s podatki. Če želite razveljaviti samodejne spremembe, ponovno vzpostavite privzeti model.",
        },
        "decisionRule": {
            "title": "Ta slika prikazuje najpomembnejše pogoje, ki jih model upošteva za napovedovanje diabetičnih in nediabetičnih stanj. Lahko kliknete gumb za prikaz pravil odločanja za diabetična in nediabetična stanja.",
        },
        "featureImportance": {
            "title": "Ta slika prikazuje pomembne dejavnike tveganja in njihovo pomembnost, kot jih upošteva model napovedi. Značilnosti, ki jih je mogoče uporabiti, so dejavniki tveganja, ki jih lahko pacienti učinkovito nadzorujejo. Medtem ko so funkcije, ki jih ni mogoče uporabiti dejavniki tveganja, ki jih pacienti ne morejo spremeniti, vendar so lahko kljub temu pomembni za postopek odločanja.",
            "actionable": "Akcijske značilnosti so dejavniki tveganja, ki jih pacienti lahko učinkovito nadzorujejo.",
            "nonActionable": "Neakcijske značilnosti so dejavniki tveganja, ki jih pacienti ne morejo učinkovito spremeniti, vendar so lahko kljub temu pomembni za proces odločanja."
        },
    },
    "featureConfig" : {
        "title" : "Na tej strani lahko konfigurirate podatke za usposabljanje. Izberite dejavnike tveganja, za katere menite, da so pomembni za napovedni model. Če opazite neobičajno ali ekstremno vrednost podatkov za katerega koli od dejavnikov tveganja, lahko s krmilnikom drsnika filtrirate podatke in ponovno usposobite model.",
        "diabetesStatus": "Ta slika prikazuje delež diabetičnih in nediabetičnih bolnikov v podatkih o usposabljanju. Za večjo točnost napovedi je priporočljivo, da sta deleža bolnikov s sladkorno boleznijo in bolnikov brez sladkorne bolezni skoraj enaka.",
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
        "title": "Te težave s podatki lahko razširite, če želite izvedeti več o teh težavah s podatki. Izberete lahko tudi težave s podatki, ki jih želite samodejno popraviti in ponovno usposobiti. Upoštevajte, da lahko samodejno popravljanje podatkovnih težav izboljša kakovost podatkov, vendar lahko izboljša točnost napovedi ali pa tudi ne. Prav tako lahko samodejno popravljanje ene podatkovne težave uvede druge težave."
    }
};