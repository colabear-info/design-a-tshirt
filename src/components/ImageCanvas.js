import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fabric } from 'fabric';

const MAX_HISTORY_LENGTH = 50;

const ImageCanvas = () => {
  const [canvas, setCanvas] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: 'white',
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const saveHistory = useCallback(() => {
    if (canvas && !isUndoRedoAction) {
      const json = canvas.toJSON();
      console.log("Saving history:", json);

      setHistory((prevHistory) => {
        const newHistory = prevHistory.length >= MAX_HISTORY_LENGTH 
          ? prevHistory.slice(1).concat(json)
          : prevHistory.concat(json);
        return newHistory;
      });

      setRedoStack([]); 
    }
  }, [canvas, isUndoRedoAction]);

  useEffect(() => {
    if (canvas) {
      const events = ['object:added', 'object:modified', 'object:removed'];
      events.forEach(event => canvas.on(event, saveHistory));
      
      return () => {
        events.forEach(event => canvas.off(event, saveHistory));
      };
    }
  }, [canvas, saveHistory]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        fabric.Image.fromURL(event.target.result, (img) => {
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();

          // 缩放图像到画布宽度的1/5
          const scaleFactor = (canvasWidth / 5) / img.width;
          img.scale(scaleFactor);

          // 设置图像位置为画布中心
          img.set({
            left: canvasWidth / 2 - (img.getScaledWidth() / 2),
            top: canvasHeight / 2 - (img.getScaledHeight() / 2),
            angle: 0,
            padding: 10,
            cornersize: 10,
            hasRotatingPoint: true,
          });

          canvas.add(img);
          canvas.renderAll();
          canvas.setActiveObject(img);
          saveHistory();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUndo = useCallback(() => {
    if (history.length > 1) {
      setIsUndoRedoAction(true);
      const currentState = history[history.length - 1];
      const prevState = history[history.length - 2];
      console.log("Undoing to state:", prevState);

      setRedoStack((prevRedoStack) => [...prevRedoStack, currentState]);
      setHistory((prevHistory) => prevHistory.slice(0, -1));

      canvas.loadFromJSON(prevState, () => {
        console.log("Canvas state after undo:", canvas.toJSON());
        canvas.renderAll();
        setIsUndoRedoAction(false);
      });
    }
  }, [history, canvas]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      setIsUndoRedoAction(true);
      const nextState = redoStack[redoStack.length - 1];
      console.log("Redoing to state:", nextState);

      setRedoStack((prevRedoStack) => prevRedoStack.slice(0, -1));
      setHistory((prevHistory) => [...prevHistory, nextState]);

      canvas.loadFromJSON(nextState, () => {
        console.log("Canvas state after redo:", canvas.toJSON());
        canvas.renderAll();
        setIsUndoRedoAction(false);
      });
    }
  }, [redoStack, canvas]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
      if (e.metaKey && e.key === 'z' && !isShiftPressed) {
        handleUndo();
      }
      if (e.metaKey && e.key === 'z' && isShiftPressed) {
        handleRedo();
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleUndo, handleRedo, isShiftPressed]);

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
