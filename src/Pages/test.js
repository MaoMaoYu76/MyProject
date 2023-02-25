import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { SketchPicker } from "react-color";

function TEST() {
  const [rotation, setRotation] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e) => {
    setMouseDown(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (mouseDown) {
      const diffX = startX - e.clientX;
      const newRotation = rotation - diffX;
      setRotation(newRotation);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <img src="/images/posters.png" alt="" />
    </div>
  );
}
export default TEST;
