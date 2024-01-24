// App.jsx

import React from 'react';
import SpeechRecognitionComponent from './components/SpeechRecognitionComponent';
import AnotherComponent from './components/AnotherComponent';
import { AppProvider } from './ctx/AppContext'; // Adjust the path based on your project structure

const App = () => {
  return (
    <AppProvider>
      <div>
        <h1>Your App</h1>
        <SpeechRecognitionComponent />
        <AnotherComponent />
      </div>
    </AppProvider>
  );
};

export default App;
