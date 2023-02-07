import React, { useState } from "react";
import { useRef } from 'react';

const BoxImage = (props) => {
  const [toolPosition, setToolPosition] = useState({ x: 0, y: 0 });
  const [top, bottom, left, right] = props.boundaries;
  const src = props.src
  const imgRef = useRef(null);

  const handleToolDown = (event) => {
      // console.log("打開監聽");
      const initialX = event.clientX;
      const initialY = event.clientY;
      const { x, y } = toolPosition;

      const handleToolMove = (event) => {
        const newX = x + event.clientX - initialX;
        const newY = y + event.clientY - initialY;
        setToolPosition({ x: newX, y: newY });

      };

      const handleToolUp = (e) => {

        if (e.target.getAttribute('id') === imgRef.current.getAttribute('id')) {
          if (left < e.clientX && e.clientX < right &&
            top < e.clientY && e.clientY < bottom) {

            // console.log("偵測複製");
            props.oncopystate(src)
            setToolPosition({ x: 0, y: 0 });
          }
          else {
            // console.log("重置");
            setToolPosition({ x: 0, y: 0 });
          }
          document.removeEventListener("pointermove", handleToolMove);
          document.removeEventListener("pointerup", handleToolUp);
        }
      };

      document.addEventListener("pointermove", handleToolMove);

      document.addEventListener("pointerup", handleToolUp);

      ondragstart = function () {
        return false;
      };

    };
  

  return <div className="grid-item"><img
    src={src}
    id={props.id}
    // className={props.className}
    ref={imgRef}
    style={{
      position: 'absolute',
      zIndex: 0,
      left: toolPosition.x,
      top: toolPosition.y,
      cursor: 'move',
      width: "120px",
      height: "120px",
      margin: "20px",
      zIndex: "1"
    }}
    onPointerDown={handleToolDown}
  />
  </div>
};

export default BoxImage;
