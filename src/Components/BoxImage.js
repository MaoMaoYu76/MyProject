import React, { useState } from "react";
import { useRef } from "react";
import "../Styles/SideImages.css";

const BoxImage = (props) => {
  const [toolPosition, setToolPosition] = useState({ x: 0, y: 0 });
  const [top, bottom, left, right] = props.boundaries;
  const [opacity, setOpacity] = useState(1);
  const [zIndex, setzIndex] = useState(1);
  const src = props.src;
  const imgRef = useRef(null);

  // const handleToolDown = (event) => {
  //   setzIndex(2);
  //   setOpacity(0.6);
  //   // console.log("打開監聽");
  //   const initialX = event.clientX;
  //   const initialY = event.clientY;
  //   const { x, y } = toolPosition;

  //   const handleToolMove = (event) => {
  //     const newX = x + event.clientX - initialX;
  //     const newY = y + event.clientY - initialY;
  //     setToolPosition({ x: newX, y: newY });
  //   };

  //   //控制左鍵放開事件
  //   const handleToolUp = (e) => {
  //     setzIndex(0);
  //     setOpacity(1);
  //     if (e.target.getAttribute("id") === imgRef.current.getAttribute("id")) {
  //       if (
  //         left < e.clientX &&
  //         e.clientX < right &&
  //         top < e.clientY &&
  //         e.clientY < bottom
  //       ) {
  //         // console.log("偵測複製");
  //         props.oncopystate(src);
  //         setToolPosition({ x: 0, y: 0 });
  //       } else {
  //         // console.log("重置");
  //         setToolPosition({ x: 0, y: 0 });
  //       }
  //       document.removeEventListener("pointermove", handleToolMove);
  //       document.removeEventListener("pointerup", handleToolUp);
  //     }
  //   };

  //   document.addEventListener("pointermove", handleToolMove);

  //   document.addEventListener("pointerup", handleToolUp);

  //   ondragstart = function () {
  //     return false;
  //   };
  // };

  return (
    <div className="grid-item">
      <img
        className="box-images"
        draggable="false"
        src={src}
        id={props.id}
        ref={imgRef}
        style={{
          zIndex: zIndex,
          left: toolPosition.x,
          top: toolPosition.y,
          opacity: opacity,
        }}
        // onPointerDown={handleToolDown}
        onClick={() => props.oncopystate(src)}
      />
    </div>
  );
};

export default BoxImage;
