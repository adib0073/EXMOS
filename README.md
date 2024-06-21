# EXMOS: Explanatory Model Steering System

With the increasing adoption of Artificial Intelligence (AI) systems in high-stake domains, such as healthcare, effective collaboration between domain experts and AI is imperative. To facilitate effective collaboration between domain experts and AI systems, we introduce an Explanatory Model Steering system that allows domain experts to steer prediction models using their domain knowledge. The system includes an explanation dashboard that combines different types of data-centric and model-centric explanations and allows prediction models to be steered through manual and automated data configuration approaches. It allows domain experts to apply their prior knowledge for configuring the underlying training data and refining prediction models. Additionally, our model steering system has been evaluated for a healthcare-focused scenario with 174 healthcare experts through three extensive user studies. Our findings highlight the importance of involving domain experts during model steering, ultimately leading to improved human-AI collaboration.

<p align="center" width="100%">
<a href="https://www.youtube.com/watch?v=-9itqTkyQ6s" target="_blank"><img src="https://github.com/adib0073/EXMOS/blob/main/images/XIL%20Systems.jpg" width="650" alt="EXMOS System"/></a>
</p>

## Demo

Please check the demonstration for our EXMOS system:
<br/>
<br/>

[![Demo_Video](https://img.youtube.com/vi/DP1tAejstAg/0.jpg)](https://www.youtube.com/watch?v=-9itqTkyQ6s)
<br/>
<br/>

## How to Get Started?
The source code for our React.js based front-end web application, FastAPI Python based backend application and deployment-ready docker configurations are available on GitHub: [https://github.com/adib0073/EXMOS](https://github.com/adib0073/EXMOS). You will also need to have docker and docker-compose installed in your system to seamlessly run the application.

**Step 1**: Since this application relies on MongoDB cloud for the backend data interaction. Please create your own MongoDB project to obtain the connection string and create the necessary databases and collections. Please refer this document for more information: [Getting started with MongoDB cloud](https://www.mongodb.com/docs/guides/atlas/connection-string/)

**Step 2**: Clone this repository and then update necessary constant values, such as, the `Mongo DB connection string`, `collection names` and `application URL` in 
```
EXMOS > app-api > app > constants.py
```
and 

```
EXMOS > app-ui > imports > ui > Constants.jsx
```
The search tag `<update_here>` will help you to find the constants that should be updated.

**Step 3**: Build the docker image. You need to have [Docker](https://www.docker.com) installed for building the docker image. The `docker-compose` and the `Dockerfile` files can be directly used to build the docker application. The build process can take up to 10 minutes to complete. Navigate to the location where you have `Dockerfile` and `docker-compose` using terminal or CLI tools and then use the command:
```
docker-compose build
```

**Step 4**: After the docker image is ready and the build process is successful, then use the following command to run the application:
```
docker-compose up --force-recreate
```
After the app is running successfully, you can open the base url of the app as mentioned in your configuration files to launch it in your web browser.

## Citation
If you use EXMOS in your research, please cite us and all our related work as follows:

#### 1. From ACM CHI 2024

` ACM reference format `

Aditya Bhattacharya, Simone Stumpf, Lucija Gosak, Gregor Stiglic, and Katrien Verbert. 2024. EXMOS: Explanatory Model Steering through Multifaceted Explanations and Data Configurations. In Proceedings of the CHI Conference on Human Factors in Computing Systems (CHI '24). Association for Computing Machinery, New York, NY, USA, Article 314, 1–27. [https:
//doi.org/10.1145/3613904.3642106](https://doi.org/10.1145/3613904.3642106)

BibTex:

```
@inproceedings{bhattacharya_chi_exmos_2024,
author = {Bhattacharya, Aditya and Stumpf, Simone and Gosak, Lucija and Stiglic, Gregor and Verbert, Katrien},
title = {EXMOS: Explanatory Model Steering through Multifaceted Explanations and Data Configurations},
year = {2024},
isbn = {9798400703300},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
url = {https://doi.org/10.1145/3613904.3642106},
doi = {10.1145/3613904.3642106},
booktitle = {Proceedings of the CHI Conference on Human Factors in Computing Systems},
articleno = {314},
numpages = {27},
keywords = {Explainable AI, Explanatory Interactive Learning, Human-centered AI, IML, Interactive Machine Learning, Interpretable AI, Model Steering, Responsible AI, XAI},
location = {<conf-loc>, <city>Honolulu</city>, <state>HI</state>, <country>USA</country>, </conf-loc>},
series = {CHI '24}
}
```

#### 2. From ACM UMAP 2024

` ACM reference format `

Aditya Bhattacharya, Simone Stumpf, and Katrien Verbert. 2024. An Explanatory Model Steering System for Collaboration between Domain Experts and AI. In Adjunct Proceedings of the 32nd ACM Conference on User Modeling, Adaptation and Personalization (UMAP Adjunct ’24), July 1–4, 2024, Cagliari,Italy. ACM, New York, NY, USA, 5 pages. [https://doi.org/10.1145/3631700.3664886](https://doi.org/10.1145/3631700.3664886)

BibTex:

```
@inproceedings{BhattacharyaUMAP2024,
  author = {Aditya Bhattacharya and Simone Stumpf and Katrien Verbert},
  title = {An Explanatory Model Steering System for Collaboration between Domain Experts and AI},
  booktitle = {Adjunct Proceedings of the 32nd ACM Conference on User Modeling, Adaptation and Personalization (UMAP Adjunct '24)},
  year = {2024},
  location = {Cagliari, Italy},
  publisher = {ACM},
  address = {New York, NY, USA},
  pages = {5},
  doi = {10.1145/3631700.3664886},
  url = {https://doi.org/10.1145/3631700.3664886}
}
```

