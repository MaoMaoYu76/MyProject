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
  const [initialWidth, initialHeight, initialScale] = size;
  const [scale, setScale] = useState(initialScale)
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
    setHeight(scale * 0.01 * initialHeight)
    setWidth(scale * 0.01 * initialWidth)
  }, [scale]);


  //偵測工具箱圖案落點用
  useEffect(() => {
    const container = document.querySelector(".canvas-container");
    if (container != null) {
      const containerRect = container.getBoundingClientRect()
      props.boundaries([containerRect.top, containerRect.bottom, containerRect.left, containerRect.right])
    }
  }, [window.innerWidth, props.showBox]);

  //按鍵刪除功能
  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      const id = event.target.children[0].getAttribute('id');
      setCanvasImages(canvasImages.filter((Image) => Image.id !== id));
    }
  };

  const handleFrame = () => {
    return {
      className: "frame",
      style: {
        height: height,
        width: width,
        backgroundColor: "#F2F2F2",
        margin: "auto auto",
        flexShrink: "0",
      }
    }
  }

  const handleCanvas = () => {
    return {
      className: "canvas",
      style: {
        width: initialWidth,
        height: initialHeight,
        backgroundColor: "#FFF",
        transform: `scale(${scale * 0.01})`,
        transformOrigin: "0 0",
        overflow:"hidden"
      }
    }
  }

  return <>
    <div className="editer-top editer"></div>
    <div className="canvas-container">
      <div {...handleFrame()}>
        <div {...handleCanvas()}>
          {canvasImages.map((Image, index) => <CanvasImage key={index} src={Image.src} id={Image.id} onKeyDown={handleKeyDown} />)}
        </div>
      </div>
    </div>
    <div>
      <div className="editer-bottom editer"> <input className="transform-controller" onChange={handleChange} value={scale} type="range" min="10" max="500"></input>{scale}</div>
    </div>
  </>

}

export default Canvas