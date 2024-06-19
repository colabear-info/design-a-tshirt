import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fabric } from 'fabric';

const MAX_HISTORY_LENGTH = 50;

const ImageCanvas = () => {
  const [canvas, setCanvas] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false); // 新的状态变量
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
    if (canvas && !isUndoRedoAction) { // 仅在不是 undo/redo 操作时保存历史记录
      const json = canvas.toJSON();
      console.log("Saving history:", json);
      setHistory((prevHistory) => {
        const newHistory = [...prevHistory, json];
        if (newHistory.length > MAX_HISTORY_LENGTH) {
          newHistory.shift(); // 删除最早的一条记录
        }
        return newHistory;
      });
      setRedoStack([]); // 清空 redo 堆栈
    }
  }, [canvas, isUndoRedoAction]);

  useEffect(() => {
    if (canvas) {
      canvas.on('object:added', saveHistory);
      canvas.on('object:modified', saveHistory);
      canvas.on('object:removed', saveHistory);

      return () => {
        canvas.off('object:added', saveHistory);
        canvas.off('object:modified', saveHistory);
        canvas.off('object:removed', saveHistory);
      };
    }
  }, [canvas, saveHistory]);

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
          canvas.add(img);
          canvas.renderAll();
          canvas.setActiveObject(img);
          saveHistory(); // 在上传图像后立即保存历史记录
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
    } else if (history.length === 1) {
      setIsUndoRedoAction(true);
      const currentState = history[0];
      setRedoStack((prevRedoStack) => [...prevRedoStack, currentState]);
      setHistory([]);
      canvas.clear();
      setIsUndoRedoAction(false);
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
  }, [handleUndo, handleRedo]);

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
