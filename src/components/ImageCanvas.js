import React, { useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';

const MAX_HISTORY_LENGTH = 50;

const ImageCanvas = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false);

  const addBackground = useCallback(() => {
    if (!editor || !fabric) {
      console.log('Editor or fabric not loaded'); // then return
      return; 
    }

    console.log('Adding background');
    fabric.Image.fromURL('/white_t.jpg', (image) => {
      if (!image) {
        console.log('Image not loaded');
        return;
      }
      console.log('Image loaded successfully');
      // Optionally, scale the background image to fit the canvas
      image.scaleToWidth(editor.canvas.getWidth());
      image.scaleToHeight(editor.canvas.getHeight());

      editor.canvas.setBackgroundImage(image, editor.canvas.renderAll.bind(editor.canvas));
    // Optionally, you can check the background image setting
      const bgImage = editor.canvas.backgroundImage;
      if (bgImage) {
        console.log('Background image is correctly set');
      } else {
        console.log('Background image is not set');
      }

      editor.canvas.renderAll();
    });
  }, [editor]);

  useEffect(() => {
    if (editor) {
      // editor.canvas.setHeight(500);
      // editor.canvas.setWidth(500);
      addBackground();

      const saveHistory = () => {
        if (!isUndoRedoAction) {
          const json = editor.canvas.toJSON();
          setHistory((prevHistory) => {
            const newHistory = prevHistory.length >= MAX_HISTORY_LENGTH 
              ? prevHistory.slice(1).concat(json)
              : prevHistory.concat(json);
            return newHistory;
          });
          setRedoStack([]);
        }
      };

      const events = ['object:added', 'object:modified', 'object:removed'];
      events.forEach((event) => editor.canvas.on(event, saveHistory));

      return () => {
        events.forEach((event) => editor.canvas.off(event, saveHistory));
      };
    }
  }, [editor, addBackground, isUndoRedoAction]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        fabric.Image.fromURL(event.target.result, (img) => {
          const canvasWidth = editor.canvas.getWidth();
          const canvasHeight = editor.canvas.getHeight();
          const scaleFactor = (canvasWidth / 5) / img.width;
          img.scale(scaleFactor);
          img.set({
            left: canvasWidth / 2 - (img.getScaledWidth() / 2),
            top: canvasHeight / 2 - (img.getScaledHeight() / 2),
          });

          editor.canvas.add(img);
          editor.canvas.renderAll();
          editor.canvas.setActiveObject(img);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUndo = useCallback(() => {
    if (history.length > 1) {
      setIsUndoRedoAction(true);
      const prevState = history[history.length - 2];
      setRedoStack((prevRedoStack) => [...prevRedoStack, history[history.length - 1]]);
      setHistory((prevHistory) => prevHistory.slice(0, -1));

      editor.canvas.loadFromJSON(prevState, () => {
        editor.canvas.renderAll();
        setIsUndoRedoAction(false);
      });
    }
  }, [history, editor]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      setIsUndoRedoAction(true);
      const nextState = redoStack[redoStack.length - 1];
      setRedoStack((prevRedoStack) => prevRedoStack.slice(0, -1));
      setHistory((prevHistory) => [...prevHistory, nextState]);

      editor.canvas.loadFromJSON(nextState, () => {
        editor.canvas.renderAll();
        setIsUndoRedoAction(false);
      });
    }
  }, [redoStack, editor]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey && e.key === 'z' && !e.shiftKey) {
        handleUndo();
      } else if (e.metaKey && e.key === 'z' && e.shiftKey) {
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
      <FabricJSCanvas className="sample-canvas" onReady={onReady} />
    </div>
  );
};

export default ImageCanvas;
