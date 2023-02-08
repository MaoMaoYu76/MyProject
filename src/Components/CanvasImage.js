import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";


const CanvasImage = (props) => {
    const [border, setBorder] = useState("0")
    const { onKeyDown } = props;
    const positionsRef = useRef({ x: 0, y: 0 });
    const [position, setPosition] = useState(positionsRef.current[props.id] || { x: 0, y: 0 })

    useEffect(() => {
      console.log("positionRef", positionsRef)

    }, [position]);

    const handlePointerDown = (event) => {


      const initialX = event.clientX;
      const initialY = event.clientY;
      const { x, y } = position;

      const handlePointerMove = (event) => {

        const newX = x + event.clientX - initialX;
        const newY = y + event.clientY - initialY;

        positionsRef.current[props.id] = { x: newX, y: newY };
        setPosition(positionsRef.current[props.id]);
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


    // setImages([...Images,props.datasrc]);
    // const handlePicked = (e) => {
    //   // console.log(e);


    //   if (!e.target.matches('img')) {
    //     setBorder("0px")
    //   }else{setBorder("5px")}
    // }
    // document.addEventListener("click", handlePicked);

    return <><div  onKeyDown={onKeyDown} tabIndex={0}>
      <img
        src={props.src}
        id={props.id}
        style={{
          position: 'absolute',
          zIndex: 0,
          left: position.x,
          top: position.y,
          cursor: 'move',
          zIndex: "1",
          // border: `solid ${border} #FFA99F`
        }}
        onPointerDown={handlePointerDown}
      />
    </div>
    </>
  };

  export default CanvasImage