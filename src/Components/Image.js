import React, { useState } from "react";

const Image = (props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handlePointerDown = (event) => {
    console.log(event)
    const initialX = event.clientX;
    const initialY = event.clientY;
    const { x, y } = position;

    const handlePointerMove = (event) => {
      const newX = x + event.clientX - initialX;
      const newY = y + event.clientY - initialY;

      // if (newY < 0) {
      //   newY = 0;
      // }

      // // 限制底部邊界
      // const maxBottom = window.innerHeight - imgHeight;
      // if (newY > maxBottom) {
      //   newY = maxBottom;
      // }

      // // 限制左側邊界
      // if (newX < 0) {
      //   newX = 0;
      // }

      // // 限制右側邊界
      // const maxRight = window.innerWidth - imgWidth;
      // if (newX > maxRight) {
      //   newX = maxRight;
      // }

      setPosition({ x: newX, y: newY });

    };

    const handlePointerUp = () => {
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
