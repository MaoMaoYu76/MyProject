import React from "react";
import "../Components/Canvas.css";
import { useState } from "react";


const Canvas = (props) => {
  const { size } = props;
  const [width, height] = size;
  const [scale, setScale] = useState()
  
  const handleChange = (event) => {
    setScale(event.target.value)
  }

  return <>
    <div className="editer-top editer"></div>
    <div className="canvas-container">
      <div className="Canvas"
        style={{
          width: width,
          height: height,
          backgroundColor: "#FFA99F",
          transform: `scale(${scale * 0.01})`
        }}>
      </div>
    </div>
    <div>
      <div className="editer-bottom editer"> <input className="transform-controller" onChange={handleChange} type="range" min="10" max="500"></input></div>
    </div>
  </>

}

export default Canvas