# syntax=docker/dockerfile:1

FROM python:3.10.7-slim-buster

EXPOSE 5000
ENV LISTEN_PORT=5000
ENV OPENAI_API_KEY=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

WORKDIR /chatgpt

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

RUN pip3 install gunicorn
COPY . .

CMD ["gunicorn", "-c", "gunicorn_config.py", "main:app"]
