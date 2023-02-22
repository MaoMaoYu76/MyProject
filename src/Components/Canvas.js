import React from "react";
import "../Styles/Canvas.css";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { SizeData } from "../Pages/edit";
import { CurrentUser } from "../Pages/edit";
import CanvasImage from "./CanvasImage";
import CanvasText from "./CanvasText";
import domtoimage from "dom-to-image";
import Signin from "./Signin";
import { storage } from "../firebase";
import { ref } from "firebase/storage";
import { uuidv4 } from "@firebase/util";
import { getDownloadURL } from "firebase/storage";
import { uploadBytes } from "firebase/storage";
import { collection } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { saveAs } from "file-saver";
import { setDoc } from "firebase/firestore";
import { db } from "../firebase";

const Canvas = (props) => {
  const size = useContext(SizeData);
  const currentUser = useContext(CurrentUser);
  const [initialWidth, initialHeight, initialScale] = size;
  const [scale, setScale] = useState(initialScale);
  const [height, setHeight] = useState(initialHeight);
  const [width, setWidth] = useState(initialWidth);
  const [canvasID, setCanvasID] = useState(uuidv4());
  const canvasData = props.canvasData;

  const [canvasImages, setCanvasImages] = useState([]);
  const [canvasTexts, setCanvasTexts] = useState([]);
  // console.log("canvasImages",canvasImages);
  const [showSignin, setShowSignin] = useState(false);
  const [showTextTool, setShowTextTool] = useState(false);
  const [alert, setAlert] = useState(null);
  const [imagesData, setImagesData] = useState([]);

  //test
  const [addInput, setAddInput] = useState(false);
  const [fontWeight, setFontWeight] = useState(16);

  const handleChange = (event) => {
    setScale(event.target.value);
  };

  useEffect(() => {
    if (canvasData != undefined) {
      setCanvasID(Object.keys(canvasData)[0]);
      const images = canvasData[Object.keys(canvasData)[0]]["images"];
      for (let i = 0; i < images.length; i++) {
        setCanvasImages((prevState) => [
          ...prevState,
          {
            id: images[i].id,
            src: images[i].src,
            rest: images[i],
          },
        ]);
      }
    }
  }, [canvasData]);

  //偵測新的圖像加入畫布
  useEffect(() => {
    if (props.newCanvasImageSrc) {
      const newSrc = props.newCanvasImageSrc;
      const id = props.Imgid;
      setCanvasImages([...canvasImages, { id: id, src: newSrc }]);
    }
  }, [props.Imgid]);

  useEffect(() => {
    if (props.Textid) {
      const id = props.Textid;
      setCanvasTexts([...canvasTexts, { id: id }]);
    }
  }, [props.Textid]);

  //選擇畫布尺寸
  useEffect(() => {
    setScale(initialScale);
  }, [size]);

  //偵測登入狀態
  useEffect(() => {
    if (currentUser) {
      setShowSignin(false);
    }
  }, [currentUser]);

  //拉桿與畫布顯示尺寸
  useEffect(() => {
    setHeight(scale * 0.01 * initialHeight);
    setWidth(scale * 0.01 * initialWidth);
  }, [scale]);

  //偵測工具箱圖案落點用
  useEffect(() => {
    const container = document.querySelector(".canvas-container");
    if (container != null) {
      const containerRect = container.getBoundingClientRect();
      props.boundaries([
        containerRect.top,
        containerRect.bottom,
        containerRect.left,
        containerRect.right,
      ]);
    }
  }, [window.innerWidth, props.showBox]);

  //按鍵刪除功能
  const handleKeyDown = (event) => {
    console.log(event.target);
    if (event.key === "Backspace") {
      const id = event.target.getAttribute("id");
      setCanvasImages(canvasImages.filter((Image) => Image.id !== id));
      setCanvasTexts(canvasTexts.filter((Text) => Text.id !== id));
    }
  };

  //畫框
  const handleFrame = () => {
    return {
      className: "frame",
      style: {
        height: height,
        width: width,
      },
    };
  };

  //畫布
  const handleCanvas = () => {
    return {
      className: "canvas",
      style: {
        width: initialWidth,
        height: initialHeight,
        transform: `scale(${scale * 0.01})`,
      },
    };
  };

  // console.log(window.location);
  //處理快照
  const handleScreenShot = async () => {
    //讀取會員登入狀態否則跳出登入提示
    if (currentUser) {
      // console.log(currentUser);
      const canvas = document.getElementById("canvas");
      setScale(100);

      //DEMO使用的存儲
      domtoimage.toBlob(canvas).then(function (blob) {
        const storageRef = ref(storage, `${canvas.children[0].id}.jpg`);
        // 測試圖片生成是否正常
        window.saveAs(blob, "my-result.png");

        //將圖片放入storage
        // uploadBytes(storageRef, blob).then((snapshot) => {
        //   console.log(window.location.host+"/poster/"+canvas.children[0].id);
      });
    } else {
      setShowSignin(true);
      setAlert(<div className="alert"> 登入尚可發布作品</div>);

      const handleMask = (event) => {
        // console.log(event.target);

        if (event.target === document.querySelector(".mask")) {
          setShowSignin(false);
        }
      };
      addEventListener("click", handleMask);
    }
  };
  // console.log("imagesData", imagesData);
  useEffect(() => {
    // console.log("imagesData", imagesData);
    const newObj = { images: [] };
    const timer = setTimeout(() => {
      const canvas = document.getElementById("canvas");
      if (currentUser != undefined) {
        // domtoimage.toBlob(canvas).then(function (blob) {
        //   const storageRef = ref(
        //     storage,
        //     `${currentUser.uid}/Snapshot/${canvasID}.jpg`
        //   );
        //   uploadBytes(storageRef, blob)
        //     .then((snapshot) => {})
        //     .catch((error) => {
        //       console.log(error);
        //     });
        // });

        newObj["images"] = imagesData;
        console.log(newObj);
        // setDoc(doc(db, `${currentUser.uid}`, canvasID), newObj);
      }
    }, 10000);

    // 在组件重新渲染或被卸载时，清除计时器
    return () => {
      clearTimeout(timer);
    };
  }, [currentUser, imagesData]);

  const handleimageData = (imageData) => {
    // console.log("imageData", imageData);
    setImagesData((prevImagesData) => {
      const imageIndex = prevImagesData.findIndex(
        (image) => image.id === imageData.id
      );
      if (imageIndex !== -1) {
        // 如果找到相同的 id，就更新對應的資料
        const newImagesData = [...prevImagesData];
        newImagesData[imageIndex] = imageData;
        return newImagesData;
      } else {
        // 如果沒有找到相同的 id，就新增資料
        return [...prevImagesData, imageData];
      }
    });
  };

  const handleTextTool = (value) => {
    setShowTextTool(value);
  };

  return (
    <>
      {showSignin && (
        <>
          <div className="mask"></div>
          <Signin setShowSignin={setShowSignin} alert={alert} />
        </>
      )}
      <div className="editer-top editer">
        <div className="deploy">
          {/* {showTextTool && ( */}
          <>
            <div className="config-box">
              <img
                className="config-button"
                onClick={() => {
                  setFontWeight(fontWeight === 900 ? 500 : 900);
                  console.log(fontWeight);
                }}
                src="/images/b.png"
              />
            </div>
          </>
          {/* )} */}
          <img
            className="deployimg"
            onClick={handleScreenShot}
            src="/images/share.png"
          />
        </div>
      </div>
      <div className="canvas-container">
        <div {...handleFrame()}>
          <div id="canvas">
            <div {...handleCanvas()} id={canvasID}>
              {canvasImages.map((Image, index) => (
                <CanvasImage
                  key={index}
                  src={Image.src}
                  id={Image.id}
                  onKeyDown={handleKeyDown}
                  rest={Image.rest}
                  imageData={handleimageData}
                />
              ))}
              {canvasTexts.map((Text, index) => (
                <CanvasText
                  key={index}
                  id={Text.id}
                  onKeyDown={handleKeyDown}
                  handleTextTool={handleTextTool}
                  fontWeight={fontWeight}
                  // imageData={handleimageData}
                />
              ))}
              {/* <CanvasImage src="https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4392447.png?alt=media&token=a33e8698-b405-427d-b2ed-2a388bd03147" id="ACx123" /> */}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="editer-bottom editer">
          <input
            className="transform-controller"
            onChange={handleChange}
            value={scale}
            type="range"
            min="10"
            max="500"
          ></input>
        </div>
      </div>
    </>
  );
};

export default Canvas;
