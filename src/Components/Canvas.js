import React from "react";
import "../Styles/Canvas.css";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { SizeData } from "../Pages/edit";
import { CurrentUser } from "../Pages/edit";
import { useLayoutEffect } from "react";
import CanvasImage from "./CanvasImage";
import domtoimage from 'dom-to-image';
import Signin from "./Signin"
import { getDownloadURL } from "firebase/storage";
import { uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { storage } from "../firebase";
import { ref } from "firebase/storage";
import { uploadString } from "firebase/storage";
import { saveAs } from "file-saver";
import { setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { uuidv4 } from "@firebase/util";


const Canvas = (props) => {
  const size = useContext(SizeData);
  const currentUser = useContext(CurrentUser);
  const canvasID = uuidv4()
  const [initialWidth, initialHeight, initialScale] = size;
  const [scale, setScale] = useState(initialScale);
  const [height, setHeight] = useState(initialHeight);
  const [width, setWidth] = useState(initialWidth);
  const [canvasData, setCanvasData] = useState({});

  const [canvasImages, setCanvasImages] = useState([]);
  // console.log("canvasImages",canvasImages);
  const [showSignin, setShowSignin] = useState(false);
  const [alert, setAlert] = useState(null);


  const handleChange = (event) => {
    setScale(event.target.value)
  }
  //自動儲存偵測
  //   useEffect(() => {},[])
  // {
  //   canvasID:{

  //   }
  // }
  useEffect(() => {
    if(Moving === false){
      setTimeout(() => {
        canvasImages.forEach(element => {
          const canvasElement = document.getElementById(element.id);
        console.log("canvas element:", canvasElement.getBoundingClientRect());
        })
      },5000)
    }
  }, [scale])


  //偵測新的圖像加入畫布
  useEffect(() => {
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

  //偵測登入狀態
  useEffect(() => {
    if (currentUser) {
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
      }
    }
  }

  //畫布
  const handleCanvas = () => {
    return {
      className: "canvas",
      style: {
        width: initialWidth,
        height: initialHeight,
        transform: `scale(${scale * 0.01})`,
      }
    }
  }

  // console.log(window.location);
  //處理快照
  const handleScreenShot = async () => {

    //讀取會員登入狀態否則跳出登入提示
    if (currentUser) {
      // console.log(currentUser);
      const canvas = document.getElementById('canvas');
      setScale(100);

      //DEMO使用的存儲
      domtoimage.toBlob(canvas)
        .then(function (blob) {
          const storageRef = ref(storage, `${canvas.children[0].id}.jpg`);
          測試圖片生成是否正常
          window.saveAs(blob, 'my-result.png');

          //將圖片放入storage
          // uploadBytes(storageRef, blob).then((snapshot) => {
          //   console.log(window.location.host+"/poster/"+canvas.children[0].id);


          //   //取得圖片url
          //   // getDownloadURL(ref(storage, `${currentUser.uid}/${canvas.children[0].id}.jpg`)).then((url) => {
          //   //   console.log(url);

          //   // }).then(() => {
          //   //   console.log('已寫入 Firestore');
          //   // }).catch((error) => {
          //   //   console.error(error);
          //   // });
          // });

          // //放入firestore中
          // setDoc(doc(db, `${currentUser.uid}`, "images"), {
          //   name: canvas.children[0].id,
          //   url: url,
          // }).then(() => {
          //   console.log("Document successfully written!");
          // }).catch((error) => {
          //   console.error("Error writing document: ", error);
          // });

        })
      //     window.saveAs(blob, 'my-result.png');

    } else {
      setShowSignin(true)
      setAlert(<div className="alert" > 登入尚可發布作品</div>)

      const handleMask = (event) => {
        // console.log(event.target);

        if (event.target === document.querySelector(".mask")) {
          setShowSignin(false)
        }
      }
      addEventListener("click", handleMask)

    }
  }




  return <>
    {showSignin && <>
      <div className="mask"></div>
      <Signin setShowSignin={setShowSignin} alert={alert} />
    </>}
    <div className="editer-top editer">
      <div className="deploy" onClick={handleScreenShot}><img className="deployimg" src="/images/share.png" /></div>
    </div>
    <div className="canvas-container">
      <div {...handleFrame()}>
        <div id="canvas">
          <div  {...handleCanvas()} id={canvasID}>
            {canvasImages.map((Image, index) => <CanvasImage key={index} src={Image.src} id={Image.id} onKeyDown={handleKeyDown} />)}
            {/* <CanvasImage src="https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4392447.png?alt=media&token=a33e8698-b405-427d-b2ed-2a388bd03147" id="ACx123" /> */}
          </div>
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