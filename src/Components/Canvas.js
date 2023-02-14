import React from "react";
import "../Components/Canvas.css";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { SizeData } from "../Pages/edit";
import { CurrentUser } from "../Pages/edit";
import { useLayoutEffect } from "react";
import CanvasImage from "./CanvasImage";
import domtoimage from 'dom-to-image';
import Signin from "./Signin"
import { uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { storage } from "../firebase";
import { ref } from "firebase/storage";
import { uploadString } from "firebase/storage";
import { saveAs } from "file-saver";





const Canvas = (props) => {
  const size = useContext(SizeData)
  const currentUser = useContext(CurrentUser)
  const [initialWidth, initialHeight, initialScale] = size;
  const [scale, setScale] = useState(initialScale)
  const [height, setHeight] = useState(initialHeight)
  const [width, setWidth] = useState(initialWidth)
  // var proxy = require('html2canvas-proxy');

  const [canvasImages, setCanvasImages] = useState([])
  const [showSignin, setShowSignin] = useState(false)


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

  useEffect(() => {
    if(currentUser){
      setShowSignin(false)
    }
  }, [currentUser]);

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
      // console.log(id);
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
        boxShadow: "0 2px 8px rgb(14 19 24 / 7%)"
      }
    }
  }

  //畫布
  const handleCanvas = () => {
    return {
      className: "canvas",
      id: "canvas",
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

  //處理快照
  const handleScreenShot = async () => {
    // setScale(100);
    if (currentUser) {
      const canvas = document.getElementById('canvas');
      // console.log(node.getBoundingClientRect());

      //   canvas.toBlob(function(blob) {
      //     saveAs(blob, "pretty image.png");
      // });
      domtoimage.toBlob(canvas)
        .then(function (blob) {
          window.saveAs(blob, 'my-result.png');
        });
      // document.getElementById('ODYFuiXhQC').style.left="90px",
      // document.getElementById('ODYFuiXhQC').style.top="160px",
      //讀取會員登入狀態否則跳出登入提示

      //將圖片放入storage取得url
      //html2位移情況很嚴重，可以再試著用absolute定義為至
      //   html2canvas(node,{useCORS: true,allowTaint:true,}).then(function(canvas) {
      //     document.body.appendChild(canvas);
      // });
      //也許可以試著修剪圖片
      // domtoimage.toPng(node,
      //   // { style: { 
      //   //   height:397,
      //   //   // width:initialWidth 
      //   // } }
      // )
      //   .then(function (dataUrl) {
      //     // console.log(dataUrl);
      //     const img = new Image();
      //     img.src = dataUrl;
      //     const storageRef = ref(storage, 'post/project.jpg');

      //     // img.height =397;
      //     // console.log(initialHeight);
      //     // img.width =initialWidth;
      //     // document.body.appendChild(img);
      //     const message4 = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
      //     uploadString(storageRef, message4, dataUrl).then((snapshot) => {
      //       console.log('Uploaded a data_url string!');
      //       // });
      //     })
      //       .catch(function (error) {
      //         console.error('oops, something went wrong!', error);
      //       })
      //   })


      //   // 'file' comes from the Blob or File API



      //放入firestore並把doc.id放進會員中
    } else {
      setShowSignin(true)
      const handleMask = (event) => {
        // console.log(event.target);
        if(event.target === document.querySelector(".mask")){
          setShowSignin(false)
        }
      }
      addEventListener("click", handleMask)
    }
  }

  return <>
    {showSignin && <>
      <div className="mask"></div>
      <div className="singin">
        <p className="alert">Login to download your post!</p>
        <Signin />
      </div>

    </>}
    <div className="editer-top editer">
      <div className="deploy" onClick={handleScreenShot}><img className="deployimg" src="/images/download.png" /><a></a></div>
    </div>
    <div className="canvas-container" id="test">
      <div {...handleFrame()}>
        <div  {...handleCanvas()}>
          {canvasImages.map((Image, index) => <CanvasImage key={index} src={Image.src} id={Image.id} onKeyDown={handleKeyDown} />)}
        </div>
      </div>
    </div>
    <div>
      <div className="editer-bottom editer">
        <input className="transform-controller" onChange={handleChange} value={scale} type="range" min="10" max="500"></input>

      </div>
    </div>
  </>

}

export default Canvas