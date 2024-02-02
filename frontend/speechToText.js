let recognition;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioQueue = [];
let audioBufferSource;

// Establish WebSocket connection
const socket = new WebSocket('ws://localhost:8000/ws/hal9000');

// Start speech recognition
function startSpeechRecognition() {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.finalTranscript = '';

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };

  recognition.onend = () => {
    console.log('Speech recognition ended.');

    // Send the final result to the server via WebSocket
    const finalTranscript = recognition.finalTranscript.trim();
    if (finalTranscript !== '') {
      console.log("Transcript: " + finalTranscript);
      socket.send(JSON.stringify({ transcript: finalTranscript }));

      // Clear the finalTranscript for the next recognition
      recognition.finalTranscript = '';
    }

    // Restart recognition for continuous listening
    startSpeechRecognition();
  };

  recognition.onresult = (event) => {
    recognition.finalTranscript += event.results[event.results.length - 1][0].transcript;
  };

  recognition.start();
}

// Set up event handler for incoming messages
socket.onmessage = (event) => {
  console.log(event.data);

  // Decode base64 audio data
  const audioData = atob(event.data);
  const arrayBuffer = new ArrayBuffer(audioData.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < audioData.length; i++) {
    view[i] = audioData.charCodeAt(i);
  }

  // Add decoded audio data to the queue
  audioQueue.push(arrayBuffer);

  // If the queue has only one item and audio is not currently playing, start playing
  if (audioQueue.length === 1 && !audioBufferSource) {
    playNextAudio();
  }
};

// Play the next audio in the queue
function playNextAudio() {
  if (audioQueue.length > 0) {
    const arrayBuffer = audioQueue.shift();

    // Decode audio data and create buffer source
    audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      audioBufferSource = audioContext.createBufferSource();
      audioBufferSource.buffer = buffer;

      // Schedule playback of the buffer source
      audioBufferSource.onended = () => {
        audioBufferSource = null; // Reset buffer source after playback ends
        playNextAudio(); // Play the next audio when the current one ends
      };

      audioBufferSource.connect(audioContext.destination);
      audioBufferSource.start(0);
    }, (error) => {
      console.error('Error decoding audio data:', error);
    });
  }
}

// Handle WebSocket connection events
socket.onopen = (event) => {
  console.log('WebSocket connection opened.');
  // Start speech recognition once the WebSocket connection is open
  startSpeechRecognition();
};

socket.onclose = (event) => {
  console.log('WebSocket connection closed.');
};
