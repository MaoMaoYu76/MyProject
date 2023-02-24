import React, { useRef } from "react";
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

  // const { canvasImages } = props.canvasImage;
  const [canvasImages, setCanvasImages] = useState([]);
  const [canvasTexts, setCanvasTexts] = useState([]);
  // console.log("canvasImages",canvasImages);
  const [showSignin, setShowSignin] = useState(false);
  const [showTextTool, setShowTextTool] = useState(false);
  const [alert, setAlert] = useState(null);
  const [imagesData, setImagesData] = useState([]);

  //test
  const [addInput, setAddInput] = useState(false);
  const [fontWeight, setFontWeight] = useState(false);
  const [fontSizes, setFontSizes] = useState({});
  const [IsSelected, setIsSelected] = useState();
  const selectedTextIdRef = useRef("");
  const InFocusRef = useRef(false);

  const handleScaleChange = (event) => {
    setScale(event.target.value);
  };

  const handleSizeChange = (event) => {
    setFontSizes((prevFontSizes) => ({
      ...prevFontSizes,
      [selectedTextIdRef.current]: event.target.value,
    }));
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
  // useEffect(() => {
  //   if (props.newCanvasImageSrc) {
  //     const newSrc = props.newCanvasImageSrc;
  //     const id = props.Imgid;
  //     setCanvasImages([...canvasImages, { id: id, src: newSrc }]);
  //   }
  // }, [props.Imgid]);

  // useEffect(() => {
  //   if (props.Textid) {
  //     const id = props.Textid;
  //     setCanvasTexts([...canvasTexts, { id: id }]);
  //   }
  // }, [props.Textid]);

  useEffect(() => {
    if (props.canvasImages) {
      setCanvasImages(props.canvasImages);
    }
  }, [props.canvasImages]);

  useEffect(() => {
    if (props.canvasTexts) {
      setCanvasTexts(props.canvasTexts);
    }
  }, [props.canvasTexts]);
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

  useEffect(() => {
    document.addEventListener("pointerdown", handleSelect);
    return () => {
      document.removeEventListener("pointerdown", handleSelect);
    };
  }, [canvasImages, canvasTexts]);

  const handleSelect = (event) => {
    const isTargetInCanvas =
      canvasImages.some((img) => img.id === event.target.id) ||
      canvasTexts.some((text) => text.id === event.target.id);
    if (isTargetInCanvas) {
      setIsSelected(event.target.id);
    } else {
      // 如果目标不在画布上，执行相关逻辑
      // ...
    }
  };
  // console.log("canvasTexts2", canvasTexts);
  // console.log("props.Textid2", props.Textid);

  useEffect(() => {
    // 在整个文档上添加事件监听器以处理键盘按键
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // 在组件卸载时，移除事件监听器
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvasTexts]);
  // const [selectedTextId, setSelectedTextId] = useState(null);

  // const [InFocus, setInFocus] = useState(false);
  //按鍵刪除功能
  const handleKeyDown = (event) => {
    if (event.key === "Backspace" && !InFocusRef.current) {
      // console.log(selectedTextIdRef.current);
      // const id = event.target.getAttribute("id");
      // console.log("targetID", deleteID);
      setCanvasTexts(
        canvasTexts.filter((Text) => Text.id !== selectedTextIdRef.current)
      );
      // setSelectedTextId(null);
      selectedTextIdRef.current = ""; // 取消選中的 CanvasText
      // setCanvasImages(canvasImages.filter((Image) => Image.id !== id));
      // setCanvasTexts(canvasTexts.filter((Text) => Text.id !== deleteID));
    }
  };
  const handleImgDelete = (event) => {
    if (event.key === "Backspace") {
      const id = event.target.children[0].children[0].getAttribute("id");
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

  const handleTextTool = (id, value) => {
    setShowTextTool(value);
  };

  // const handleTextClick = (id) => {
  //   selectedTextIdRef.current = id;
  //   // setIsSelected(selectedTextIdRef.current);
  // };
  const handleInFocus = (value) => {
    InFocusRef.current = value;
  };

  const handleFontSize = (id, value) => {
    setFontSizes((prevFontSizes) => ({
      ...prevFontSizes,
      [id]: value,
    }));
    // console.log(fontSizes);
  };

  const handleSubmit = (event) => {
    if (event.keyCode === 13) {
      event.target.blur();
    }
  };

  const handleClick = (event) => {
    event.target.select();
  };
  // console.log(selectedTextIdRef.current);
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
              <div className="font-size-container">
                <button className="minus size-config">
                  <img className="config-img config" src="/images/minus.png" />
                </button>
                <input
                  className="font-size config"
                  onChange={handleSizeChange}
                  onKeyDown={handleSubmit}
                  onClick={handleClick}
                  value={fontSizes[selectedTextIdRef.current]}
                ></input>
                <button className="add size-config config">
                  <img className="config-img config" src="/images/add.png" />
                </button>
              </div>
              <img
                className="config-button config"
                onClick={() => {
                  setFontWeight(!fontWeight);
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
                  onKeyDown={handleImgDelete}
                  rest={Image.rest}
                  imageData={handleimageData}
                />
              ))}
              {canvasTexts.map((Text, index) => (
                <CanvasText
                  key={index}
                  id={Text.id}
                  handleTextTool={handleTextTool}
                  fontWeight={fontWeight}
                  // onClick={handleTextClick(Text.id)}
                  onKeyDown={handleKeyDown}
                  // imageData={handleimageData}
                  handleInFocus={handleInFocus}
                  handleFontSize={handleFontSize}
                  fontSize={fontSizes[Text.id] || 25}
                  selected={IsSelected}
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
            onChange={handleScaleChange}
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
