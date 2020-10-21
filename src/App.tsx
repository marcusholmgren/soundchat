import React from 'react';
import logo from './logo.svg';
//import './css/index.css';

interface AppProps {}

function App({}: AppProps) {
  return (
    <div className="App">
      <div className="bg-yellow text-red-600 pt-6 text-left font-medium text-gray-700">
        This is soundchat
      </div>
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
