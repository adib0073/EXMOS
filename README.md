# EXMOS: Explanatory Model Steering Through Multifaceted Explanations and Data Configurations

Explanations in interactive machine-learning systems facilitate debugging and improving prediction models. However, the effectiveness of various global model-centric and data-centric explanations in aiding domain experts to detect and resolve potential data issues for model improvement remains unexplored. This research investigates the influence of data-centric and model-centric global explanations in systems that support healthcare experts in optimising models through automated and manual data configurations. We conducted quantitative (n=70) and qualitative (n=30) studies with healthcare experts to explore the impact of different explanations on trust, understandability and model improvement. Our results reveal the insufficiency of global model-centric explanations for guiding users during data configuration. Although data-centric explanations enhanced understanding of post-configuration system changes, a hybrid fusion of both explanation types demonstrated the highest effectiveness. Based on our study results, we also present design implications for effective explanation-driven interactive machine-learning systems.

<p align="center" width="100%">
<a href="https://www.youtube.com/watch?v=DP1tAejstAg" target="_blank"><img src="https://github.com/adib0073/EXMOS/blob/main/images/XIL%20Systems.jpg" width="650" alt="EXMOS System"/></a>
</p>

## Demo

Please check the demonstration for our EXMOS system:
<br/>
<br/>

[![Demo_Video](https://img.youtube.com/vi/DP1tAejstAg/0.jpg)](https://www.youtube.com/watch?v=DP1tAejstAg)
<br/>
<br/>

## How to Get Started?
The source code for our React.js based front-end web application, FastAPI Python based backend application and deployment-ready docker configurations are available on GitHub: [https://github.com/adib0073/EXMOS](https://github.com/adib0073/EXMOS). 

**Step 1**: Please update necessary constant values, such as, the `Mongo DB connection string`, `collection names` and `application URL` in 
```
EXMOS > app-api > app > constants.py
```
and 

```
EXMOS > app-ui > imports > ui > Constants.jsx
```
The search tag `<update_here>` will help you to find the constants that should be updated.

**Step 2**: Build the docker image. You need to have [Docker](https://www.docker.com) installed for building the docker image. The `docker-compose` and the `Dockerfile` files can be directly used to build the docker application. The build process can take up to 10 minutes to complete.
```
docker-compose build
```

**Step 3**: After the docker image is ready and the build process is successful, then use the following command to run the application:
```
docker-compose up --force-recreate
```


## Citation
If you use EXMOS in your research, please cite us as follows:

Aditya Bhattacharya, Simone Stumpf, Lucija Gosak, Gregor Stiglic, and Katrien Verbert. 2024. EXMOS: Explanatory Model Steering Through Multifaceted Explanations and Data Configurations. In Proceedings of the CHI Conference on Human Factors in Computing Systems (CHI ’24), May 11–16, 2024, Honolulu, HI, USA. [https:
//doi.org/10.1145/3613904.3642106](https://doi.org/10.1145/3613904.3642106)

BibTex:

```
@article{bhattacharya2024exmos,
  author    = {Aditya Bhattacharya and
               Simone Stumpf and
               Lucija Gosak and
               Gregor Stiglic and
               Katrien Verbert},
  title     = {{EXMOS: Explanatory Model Steering Through Multifaceted Explanations and Data Configurations}},
  journal   = {arXiv:2402.00491},
  year      = {2024},
  eprint    = {2402.00491},
  primaryClass  = {cs.AI},
  url       = {https://arxiv.org/abs/2402.00491},
  doi       = {10.48550/arXiv.2402.00491},
}
```
