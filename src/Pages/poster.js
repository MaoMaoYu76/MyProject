import React from "react";
import { useState } from "react";
import LogoBar from "../Components/LogoBar";
import Signin from "../Components/Signin";
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import "../Styles/poster.css";
import { useEffect } from "react";
import { storage } from "../firebase";
import { ref } from "firebase/storage";
import { getMetadata } from "firebase/storage";
import { useContext } from "react";
import { getDownloadURL } from "firebase/storage";



function POSTER() {
      const { id } = useParams();
      const [imgRef, setImgRef] = useState(null);
      const [url, setUrl] = useState(null);
      const [initialWidth, setInitialWidth] = useState(0);
      const [initialHeight, setInitialHeight] = useState(0);

      //取得圖片url
      useEffect(() => {
            getDownloadURL(ref(storage, `${id}.jpg`)).then((url) => {
                  console.log(url);
                  setUrl(url)
                  const img = new Image();
                  img.src = url
                  img.onload = () => {
                        setInitialWidth(img.width);
                        setInitialHeight(img.height);
                        //圖片加載完成
                        setImgRef(img);
                        // console.log(id);
                  };
            });
      
      }, []);
      //[]元件渲染到畫面上的時候執行一次，不會再次觸發。

      const [scale, setScale] = useState(100)
      const [height, setHeight] = useState(initialHeight)
      const [width, setWidth] = useState(initialWidth)


      const handleChange = (event) => {
            setScale(event.target.value)
      }

      useEffect(() => {
            if (imgRef) {
                  setHeight(scale * 0.01 * initialHeight)
                  setWidth(scale * 0.01 * initialWidth)
            }
      }, [imgRef, scale]);



      const handleFrame = () => {
            console.log(height, width);
            return {
                  className: "frame",
                  // id: "canvas",
                  style: {
                        height: height,
                        width: width,
                        backgroundColor: "#F2F2F2",
                        margin: "auto auto",
                        flexShrink: "0",
                        boxShadow: "0 2px 8px rgb(14 19 24 / 7%)",
                        overflow: "hidden",
                  }
            }
      }

      const handleCanvas = () => {
            return {
                  className: "result",
                  // id: "canvas",
                  style: {
                        width: initialWidth,
                        height: initialHeight,
                        backgroundColor: "#FFF",
                        transform: `scale(${scale * 0.01})`,
                        transformOrigin: "0 0",
                        overflow: "hidden",
                        // boxShadow: "0 2px 8px rgb(14 19 24 / 7%)"
                  }
            }
      }

      return <>
            <LogoBar />
            <div className="display-zone">
                  <div className="result-container">
                        <div {...handleFrame()}>
                              <img {...handleCanvas()} src={url}></img>
                        </div>
                  </div>
                  <div className="tool-zone">
                        <input className="transform-controller" onChange={handleChange} value={scale} type="range" min="10" max="500"></input>
                        <div className="download" ><img className="downlaodimg" src="/images/download.png" /></div>
                  </div>
            </div>
      </>


}


export default POSTER