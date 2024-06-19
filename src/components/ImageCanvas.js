import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const ImageCanvas = () => {
  const [canvas, setCanvas] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: 'white',
    });

    fabricCanvas.on('object:added', updateHistory);
    fabricCanvas.on('object:modified', updateHistory);
    fabricCanvas.on('object:removed', updateHistory);

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.off('object:added', updateHistory);
      fabricCanvas.off('object:modified', updateHistory);
      fabricCanvas.off('object:removed', updateHistory);
      fabricCanvas.dispose();
    };
  }, []);

  const updateHistory = () => {
    if (canvas) {
      const json = canvas.toJSON();
      setHistory((prevHistory) => [...prevHistory, json]);
      setRedoStack([]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        fabric.Image.fromURL(event.target.result, (img) => {
          img.set({
            left: 50,
            top: 50,
            angle: 0,
            padding: 10,
            cornersize: 10,
            hasRotatingPoint: true,
          });
          canvas.add(img).renderAll();
          canvas.setActiveObject(img);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      setRedoStack((prevRedoStack) => [...prevRedoStack, canvas.toJSON()]);
      canvas.loadFromJSON(lastState, canvas.renderAll.bind(canvas));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setRedoStack((prevRedoStack) => prevRedoStack.slice(0, -1));
      setHistory((prevHistory) => [...prevHistory, canvas.toJSON()]);
      canvas.loadFromJSON(nextState, canvas.renderAll.bind(canvas));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey && e.key === 'z') {
        handleUndo();
      }
      if (e.metaKey && e.shiftKey && e.key === 'z') {
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [history, redoStack, canvas]);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleUndo}>Undo</button>
      <button onClick={handleRedo}>Redo</button>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ImageCanvas;
