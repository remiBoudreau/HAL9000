# syntax=docker/dockerfile:1

FROM python:3.10.7-slim-buster

EXPOSE 5000
ENV LISTEN_PORT=8000
ENV OPENAI_API_KEY=your_openai_api_key
ENV ELEVENLABS_API_KEY=your_elevenlabs_api_key
ENV ELEVENLABS_URI=wss://api.elevenlabs.io/v1/text-to-speech/LYp1XfKJNswUTe0f9ayG/stream-input?model_id=eleven_turbo_v2

WORKDIR /hal9000

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

RUN pip3 install gunicorn
COPY . .

CMD ["gunicorn", "-c", "gunicorn_config.py", "main:app"]
