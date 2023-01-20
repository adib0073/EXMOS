FROM python:3.10.8

COPY ./app /app

WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 8000

ENTRYPOINT ["uvicorn"]

CMD ["main:app", "--host", "0.0.0.0"]