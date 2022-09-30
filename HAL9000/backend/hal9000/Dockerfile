# syntax=docker/dockerfile:1

FROM python:3.10.7-slim-buster

EXPOSE 5000
ENV LISTEN_PORT=5000
ENV TTS_API=http://speechbrain:8000/api/tts

WORKDIR /python-docker

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt && pip3 install torchaudio -f https://download.pytorch.org/whl/torch_stable.html

RUN pip3 install gunicorn
COPY . .
#CMD ["python", "-m", "flask", "run"]

CMD ["gunicorn", "-c", "gunicorn_config.py", "wsgi:app"]
