import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../ctx/AppContext';

const SpeechRecognition = () => {
  const { audioData, setAudioData } = useAppContext();
  const [recognition, setRecognition] = useState(null);
  const [pauseTimer, setPauseTimer] = useState(null);

  useEffect(() => {
    const initRecognition = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        startRecognition(); // Restart recognition after it ends
      };

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');

        console.log('Transcript:', transcript);

        setAudioData((prevData) => [...prevData, transcript]);

        // Clear the existing pause timer
        clearTimeout(pauseTimer);

        // Set a new pause timer to check for a pause of 3 seconds
        setPauseTimer(setTimeout(() => {
          if (audioData.length > 0) {
            // Send audio data to the server
            sendAudioData();
          }
        }, 3000));
      };

      setRecognition(recognitionInstance);
      startRecognition(); // Start recognition when component mounts
    };

    initRecognition();
  }, [audioData, pauseTimer, setAudioData]);

  const startRecognition = () => {
    if (recognition) {
      setAudioData([]); // Clear existing audio data
      recognition.start();
    }
  };

  const sendAudioData = () => {
    // Make a POST request to someURL with the audio data
    const dataToSend = audioData.join(' ');

    axios.post('https://your-api-endpoint.com', { audio_data: dataToSend })
      .then((response) => {
        console.log('Audio data sent successfully', response.data);

        // Update audioData in the AppContext
        setAudioData(response.data);
      })
      .catch((error) => {
        console.error('Error sending audio data', error);
      });
  };
  return null; // Since there are no buttons, return null or any other UI as needed
};

export default SpeechRecognition;
