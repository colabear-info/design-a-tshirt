import React from 'react';
import './App.css';
import ImageCanvas from './components/ImageCanvas';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Upload and Drag with Fabric.js</h1>
        <ImageCanvas />
      </header>
    </div>
  );
};

export default App;

