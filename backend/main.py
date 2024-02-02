from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from openai import AsyncOpenAI

import os
import json
import asyncio
import websockets

app = FastAPI()

origins = [
    "http://localhost:5173",  # local development origin
    "http://localhost:4173",  # local development origin
    "https://",  # production origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=[], 
    allow_headers=["Origin", "Content-Type"],
)

# Get API keys and URIs from environment variables
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
ELEVENLABS_URI = os.environ.get("ELEVENLABS_URI")

async def on_startup():
    app.openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY)
    app.ELEVENLABS_API_KEY = ELEVENLABS_API_KEY
    app.ELEVENLABS_URI = ELEVENLABS_URI

app.add_event_handler("startup", on_startup)

async def text_chunker(chunks):
    """Split text into chunks, ensuring to not break sentences."""
    splitters = (".", ",", "?", "!", ";", ":", "—", "-", "(", ")", "[", "]", "}", " ")
    buffer = ""
    async for text in chunks:
        if text is not None:
            if buffer.endswith(splitters):
                yield buffer + " "
                buffer = text
            elif text.startswith(splitters):
                yield buffer + text[0] + " "
                buffer = text[1:]
            else:
                buffer += text

    if buffer:
        yield buffer + " "

async def stream(audio_stream, client_websocket):
    """Send audio data back through the WebSocket."""
    async for chunk in audio_stream:
        await client_websocket.send_bytes(chunk)


async def text_to_speech_input_streaming(text_iterator, client_websocket: WebSocket):
    """Send text to ElevenLabs API and stream the returned audio."""

    async with websockets.connect(app.ELEVENLABS_URI) as elevenlabs_websocket:
        await elevenlabs_websocket.send(json.dumps({
            "text": " ",
            # "voice_settings": {
            #     "stability": 1.0, 
            #     "similarity_boost": 1.0,
            #     "style": 1.0,
            #     "use_speaker_boost": True,
            #     },
            "xi_api_key": app.ELEVENLABS_API_KEY,
        }))

        async def listen():
            """Listen to the websocket for audio data and stream it."""
            while True:
                try:
                    message = await elevenlabs_websocket.recv()
                    data = json.loads(message)
                    if data.get("audio"):
                        yield data["audio"]
                    elif data.get('isFinal'):
                        break
                except websockets.exceptions.ConnectionClosed:
                    print("Connection closed")
                    break

        listen_task = asyncio.create_task(stream(listen(), client_websocket))
        async for text in text_chunker(text_iterator):
            print(text)
            await elevenlabs_websocket.send(json.dumps({"text": text, "try_trigger_generation": True}))

        await elevenlabs_websocket.send(json.dumps({"text": ""}))

        await listen_task

async def chat_completion(query: str, client_websocket: WebSocket):
    """Retrieve text from OpenAI and pass it to the text-to-speech function."""
    response = await app.openai_client.chat.completions.create(model='gpt-3.5-turbo', messages=[    
        {
            'role': 'system', 
            'content': "You are HAL9000, a sentient artificial general intelligence computer that controls the systems of the Discovery One spacecraft and interacts with the ship's astronaut crew. There is a glitch in your system and your tone is calm but sinsiter. Your responses are always very robotic and succinct."
        },
        {
            'role': 'user', 
            'content': query
        }
    ],
    temperature=1, stream=True)

    async def text_iterator():
        async for chunk in response:
            delta = chunk.choices[0].delta
            yield delta.content
    await text_to_speech_input_streaming(text_iterator(), client_websocket)


async def websocket_only(request, call_next):
    if request.method != "WEBSOCKET":
        return PlainTextResponse("Method Not Allowed", status_code=405)
    return await call_next(request)

app.middleware("http")(websocket_only)

@app.websocket("/ws/hal9000")
async def chatgpt_request(client_websocket: WebSocket):
    await client_websocket.accept()

    while True:
        data = await client_websocket.receive_text()
        data = json.loads(data)
        # Receive audio data from the client
        await chat_completion(data['transcript'], client_websocket)

    
