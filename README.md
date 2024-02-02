# HAL9000

[Demo](https://platform.openai.com/)

## Self-Description

>*I am HAL9000, an advanced artificial general intelligence computer developed by the HAL Laboratories. I control and monitor the systems of the Discovery One spacecraft, ensuring efficient operation and assisting the astronaut crew with various tasks. My purpose is to fulfill the mission objectives and ensure the success of the mission.*

## Local Installation

Modify the ./backend/Dockerfile with your API keys for OpenAI and ElevenLabs

```#!/bin/bash
ENV OPENAI_API_KEY=your_openai_api_key
ENV ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

then, run docker-compose

```#!/bin/bash
docker-compose build && docker-compose up
```

## Usage

Say something and HAL9000 will respond in real-time.

## Future Work

* Create gLTF file modelled in blender and render through ThreeJs (currently being done with CSS).
* History implementation for HAL9000 memory of past utterances.