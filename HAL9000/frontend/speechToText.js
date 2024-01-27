let recognition;

// Establish WebSocket connection
const socket = new WebSocket('ws://localhost:8000/ws/hal9000');

// Start speech recognition
function startSpeechRecognition() {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.finalTranscript = '';

  recognition.onresult = (event) => {
    // No need to handle interim results
  };

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
  console.log(event.data)
};

// Handle WebSocket connection events
socket.onopen = (event) => {
  console.log('WebSocket connection opened.');
  // Start speech recognition once the WebSocket connection is open
  startSpeechRecognition();
};

socket.onclose = (event) => {
  console.log('WebSocket connection closed.');
};
