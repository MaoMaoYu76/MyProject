import React, { useState } from "react";

const Image = (props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handlePointerDown = (event) => {
    const initialX = event.clientX;
    const initialY = event.clientY;
    const { x, y } = position;

    const handlePointerMove = (event) => {
      const newX = x + event.clientX - initialX;
      const newY = y + event.clientY - initialY;

      setPosition({ x: newX, y: newY });

    };

    const handlePointerUp = () => {
      // if(鼠標拖曳X.Y在canvas的範圍內){
      //   複製圖片
      // }
      document.removeEventListener("pointermove", handlePointerMove);
    };

    document.addEventListener("pointermove", handlePointerMove);

    document.addEventListener("pointerup", handlePointerUp);

    ondragstart = function () {
      return false;
    };

  };

  return <img
    src={props.src}
    style={{
      position: 'absolute',
      zIndex: 0,
      left: position.x,
      top: position.y,
      cursor: 'move',
      width: "120px",
      height: "120px",
      margin: "20px",
      zIndex: "1"
    }}
    onPointerDown={handlePointerDown}
  />
    ;
};

export default Image;
