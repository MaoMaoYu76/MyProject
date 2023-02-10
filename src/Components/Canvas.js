import React from "react";
import "../Components/Canvas.css";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { SizeData } from "../Pages/edit";
import { useLayoutEffect } from "react";
import CanvasImage from "./CanvasImage";
import html2canvas from 'html2canvas';



const Canvas = (props) => {
  const size = useContext(SizeData)
  const [initialWidth, initialHeight, initialScale] = size;
  const [scale, setScale] = useState(initialScale)
  const [height, setHeight] = useState(initialHeight)
  const [width, setWidth] = useState(initialWidth)
  // var proxy = require('html2canvas-proxy');

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
      const id = event.target.children[0].children[0].getAttribute('id');
      console.log(id);
      setCanvasImages(canvasImages.filter((Image) => Image.id !== id));
    }
  };

  //畫框
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

  //畫布
  const handleCanvas = () => {
    return {
      className: "canvas",
      id:"canvas",
      style: {
        width: initialWidth,
        height: initialHeight,
        backgroundColor: "#FFF",
        transform: `scale(${scale * 0.01})`,
        transformOrigin: "0 0",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgb(14 19 24 / 7%)"
      }
    }
  }
  const handleScreenShot = () => {
    // console.log(document.querySelector(".canvas"));
    html2canvas(document.querySelector("#canvas"),{
      useCORS:true
    }) 

    .then(function(canvas) {
      document.body.appendChild(canvas);
    });

  }
  return <>
    <div className="editer-top editer"></div>
    <div className="canvas-container">
      <div {...handleFrame()}>
        <div  {...handleCanvas()}>
          {canvasImages.map((Image, index) => <CanvasImage key={index} src={Image.src} id={Image.id} onKeyDown={handleKeyDown} />)}
          <CanvasImage src="https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/6443634.png?alt=media&amp;token=3f95b586-7a33-4ae3-b266-07f70574d991" id="ODYFuiXhQC" />
          {/* <CanvasImage src="/images/email.png" id="ODYFuiXh1C" /> */}
        </div>
      </div>
    </div>
    <div>
      <div className="editer-bottom editer">
        <input className="transform-controller" onChange={handleChange} value={scale} type="range" min="10" max="500"></input>
        <div className="deploy" onClick={handleScreenShot}><img className="deployimg" src="/images/deploy.png" /><a>發布作品</a></div>
      </div>
    </div>
  </>

}

export default Canvas