import React, { useState } from "react";

const Image = (props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });



  const handlePointerDown = (event) => {
    console.log("handlePointerDown",event)
    
    const initialX = event.clientX;
    const initialY = event.clientY;
    const { x, y } = position;



    const handlePointerMove = (event) => {
      console.log("handlePointerMove",event)
      const newX = x + event.clientX - initialX;
      const newY = y + event.clientY - initialY;

      setPosition({ x: newX, y: newY });
      // document.addEventListener("pointerup", handlePointerUp);

    };

    const handlePointerUp = () => {
      console.log("pointerup")
      document.removeEventListener("pointermove", handlePointerMove);
    };


    document.addEventListener("pointermove", handlePointerMove);

    



    document.addEventListener("pointerup", handlePointerUp);

  };
  const handlePointerMove = (event) => {
    console.log("handlePointerMove",event)
    const newX = x + event.clientX - initialX;
    const newY = y + event.clientY - initialY;

    setPosition({ x: newX, y: newY });
    // document.addEventListener("pointerup", handlePointerUp);

  };
  const handlePointerUp = () => {
    console.log("pointerup")
    document.removeEventListener("pointermove", handlePointerMove);
  };

  return (
    <img
      src={props.src}
      style={{
        position: 'absolute',
        zIndex: 0,
        left: position.x,
        top: position.y,
        cursor: 'move',
        width:"120px",
        height:"120px",
        margin: "20px"
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    />
  );
};

export default Image;
