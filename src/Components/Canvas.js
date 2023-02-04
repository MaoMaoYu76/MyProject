import React from "react";
import "../Components/Canvas.css";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { SizeData } from "../Pages/edit"


const Canvas = () => {
  // const Canvas = (props) => {
  const size = useContext(SizeData)
  // console.log("size",size);
  // const { size } = props;
  const [initialWidth, initialHeight, unit, initialScale] = size;
  const [scale, setScale] = useState(initialScale)
  const [className, setClassName] = useState("canvas-container")
  const [height,setHeight] = useState(initialHeight)
  const [width,setWidth] = useState(initialWidth)
  const [canvasArea, setcanvasArea] = useState()
  
  console.log(height,width);
  // console.log("scale",scale);
  const handleChange = (event) => {
    setScale(event.target.value)
  }

  useEffect(() => {
    setScale(initialScale);
  }, [size]);


  useEffect(() => {
    setHeight(scale*0.01*initialHeight+unit)
    setWidth(scale*0.01*initialWidth+unit)

    const canvas = document.querySelector(".canvas");
    const container = document.querySelector(`.${className}`);

    if (canvas!= null && container!=null) {
      const canvasRect = canvas.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      if (canvasRect.x < containerRect.x || canvasRect.y < containerRect.y) {
        setClassName("canvas-container-overflow")
      } else {
        setClassName("canvas-container")
      }
    }

  }, [scale]);


  return <>
    <div className="editer-top editer"></div>
    <div className={className}>
      <div className="canvas"
        style={{
          width: width,
          height: height,
          backgroundColor: "#FFA99F",
          flexShrink: "0"
        }}>
      </div>
    </div>
    <div>
      <div className="editer-bottom editer"> <input className="transform-controller" onChange={handleChange} value={scale} type="range" min="10" max="500"></input></div>
    </div>
  </>

}

export default Canvas