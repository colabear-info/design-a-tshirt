import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  IMAGE: 'image',
};

const DraggableImage = ({ src, x, y, setPosition }) => {
  const [, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { x, y },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const newX = Math.round(item.x + delta.x);
      const newY = Math.round(item.y + delta.y);
      setPosition({ x: newX, y: newY });
    },
  });

  return (
    <img
      ref={drag}
      src={src}
      alt="Uploaded"
      style={{ position: 'absolute', left: x, top: y, cursor: 'move', width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
    />
  );
};

const ImageCanvas = () => {
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <DndProvider backend={HTML5Backend}>
        <div style={{ position: 'relative', width: '800px', height: '600px', border: '1px solid black', marginTop: '20px' }}>
          {image && <DraggableImage src={image} x={position.x} y={position.y} setPosition={setPosition} />}
        </div>
      </DndProvider>
    </div>
  );
};

export default ImageCanvas;

