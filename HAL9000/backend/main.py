from fastapi import FastAPI, Depends, HTTPException
from openai import AsyncOpenAI
from TTS.api import TTS
import sounddevice as sd
import numpy as np
import whisper

app = FastAPI()

async def on_startup():
    app.tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

app.add_event_handler("startup", on_startup)

async def get_tts():
    return app.tts

@app.get("/chatgpt")
async def chatgpt_request(tts: TTS = Depends(get_tts)):
    # client = AsyncOpenAI(api_key="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")
    # completion = await client.chat.completions.create(
    #     messages=[
    #         {
    #             "role": "user",
    #             "content": "Respond with a 'hi'",
    #         }
    #     ],
    #     model="gpt-3.5-turbo",
    # )
    
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)

    # generate speech by cloning a voice using default settings
    audio_data = tts.tts(
                        # text=completion.choices[0].message.content,
                        text='Testing 1,2,3... Does this work?',
                        speaker_wav=["hal9000_sample.mp3"],
                        language="en",
                        split_sentences=False
                        )

    sd.play(audio_data, samplerate=22050)
    status = sd.wait()  # Wait until file is done playing
