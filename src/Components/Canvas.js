import React from "react";
import "../Components/Canvas.css";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { SizeData } from "../Pages/edit";
import { useLayoutEffect } from "react";
import CanvasImage from "./CanvasImage";


const Canvas = (props) => {
  const size = useContext(SizeData)
  const [initialWidth, initialHeight, unit, initialScale] = size;
  const [scale, setScale] = useState(initialScale)
  const [className, setClassName] = useState("canvas-container")
  const [height, setHeight] = useState(initialHeight)
  const [width, setWidth] = useState(initialWidth)

  const [canvasImages, setCanvasImages] = useState([])

  const handleChange = (event) => {
    setScale(event.target.value)
  }

  useLayoutEffect(() => {
    if (props.newCanvasImage) {
      const newSrc = props.newCanvasImage
      const id = props.id
      setCanvasImages([...canvasImages, { id: id, src: newSrc }]);
    }
  }, [props.id]);

  //選擇畫布尺寸
  useEffect(() => {
    setScale(initialScale);
  }, [size]);

  //拉桿與畫布顯示尺寸
  useEffect(() => {
    setHeight(scale * 0.01 * initialHeight + unit)
    setWidth(scale * 0.01 * initialWidth + unit)

    const canvas = document.querySelector(".canvas");
    const container = document.querySelector(`.${className}`);

    if (canvas != null && container != null) {
      const canvasRect = canvas.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      if (canvasRect.x < containerRect.x || canvasRect.y < containerRect.y) {
        setClassName("canvas-container-overflow")
      } else {
        setClassName("canvas-container")
      }
    }

  }, [scale]);


  //偵測工具箱圖案落點用
  useEffect(() => {
    const container = document.querySelector(`.${className}`);
    if (container != null) {
      const containerRect = container.getBoundingClientRect()
      props.boundaries([containerRect.top, containerRect.bottom, containerRect.left, containerRect.right])
    }
  }, [window.innerWidth, props.showBox]);


  const handleKeyDown = (event) => {

    if (event.key === "Backspace") {
      const id = event.target.children[0].getAttribute('id');
      setCanvasImages(canvasImages.filter((Image) => Image.id !== id));
    }
  };

  return <>
    <div className="editer-top editer"></div>
    <div className={className}>
      <div className="canvas"
        style={{
          width: width,
          height: height,
          backgroundColor: "#FFF",
          flexShrink: "0",
          position: "relative"
        }}>
        {canvasImages.map((Image, index) => <CanvasImage key={index} src={Image.src} id={Image.id} onKeyDown={handleKeyDown} />)}
      </div>
    </div>
    <div>
      <div className="editer-bottom editer"> <input className="transform-controller" onChange={handleChange} value={scale} type="range" min="10" max="500"></input></div>
    </div>
  </>

}

export default Canvas