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
import FontList from "./FontList";
import { uuidv4 } from "@firebase/util";
import { SketchPicker } from "react-color";
import { getDownloadURL } from "firebase/storage";
import { uploadBytes } from "firebase/storage";
import { collection } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { saveAs } from "file-saver";
import { setDoc } from "firebase/firestore";
import { db } from "../firebase";
// import html2canvas from "html2canvas";
// import domtoimage from "dom-to-image-google-font-issue";
// import * as htmlToImage from "html-to-image";
// import { toBlob } from "html-to-image";

const Canvas = (props) => {
  // const size = useContext(SizeData);
  const currentUser = useContext(CurrentUser);
  // const [initialWidth, initialHeight, initialScale] = size;
  const [initialWidth, setInitialWidth] = useState(props.size[0]);
  const [initialHeight, setInitialHeight] = useState(props.size[1]);
  const [scale, setScale] = useState(props.size[2]);
  const [height, setHeight] = useState(initialHeight);
  const [width, setWidth] = useState(initialWidth);
  const [canvasID, setCanvasID] = useState(uuidv4());
  const canvasData = props.canvasData;
  // const { canvasImages } = props.canvasImage;
  const [canvasImages, setCanvasImages] = useState([]);
  const [canvasTexts, setCanvasTexts] = useState([]);
  const [canvasShapes, setCanvasShapes] = useState([]);
  // console.log("canvasImages",canvasImages);
  const [showSignin, setShowSignin] = useState(false);
  const [showImageTool, setShowImageTool] = useState(false);
  const [showTextTool, setShowTextTool] = useState(false);
  const [showCanvasTool, setShowCanvasTool] = useState(false);
  const [IsSetting, setIsSetting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [imagesData, setImagesData] = useState([]);
  const [textsData, setTextsData] = useState([]);
  const [cancel, setCancel] = useState(false);
  const [fontWeight, setFontWeight] = useState(false);
  const [fontSizes, setFontSizes] = useState({});
  const [fontSizesText, setFontSizesText] = useState();
  const [IsSelected, setIsSelected] = useState();
  const selectedIdRef = useRef("");
  const InFocusRef = useRef(false);
  const IsSettingRef = useRef(false);
  const [TextColor, setTextColor] = useState({});
  const [CanvasColor, setCanvasColor] = useState("#FFFFFF");
  const [ShowTextPicker, setShowTextPicker] = useState(false);
  const [ShowCanvasPicker, setShowCanvasPicker] = useState(false);
  const [selectedFont, setSelectedFont] = useState({});
  //test
  const [maxLayer, setMaxlayer] = useState(0);
  const [zIndex, setzIndex] = useState({});
  const [url, seturl] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [ShowBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState({});
  const [projectName, setProjectName] = useState("");
  const scaleRef = useRef("");

  const handleScaleChange = (event) => {
    setScale(event.target.value);
  };
  const handleSizeChange = (event) => {
    // console.log("event.target.value", event.target.value);
    setIsSetting(true);
    setFontSizesText(event.target.value);
  };
  const handleSubmit = (event) => {
    if (event.keyCode === 13) {
      setFontSizes((prevFontSizes) => ({
        ...prevFontSizes,
        [selectedIdRef.current]: fontSizesText,
      }));
      event.target.blur();
      setIsSetting(false);
    }
  };

  useEffect(() => {
    // console.log(props.size);
    console.log(canvasData);
    setCanvasImages([]);
    setCanvasTexts([]);
    setInitialWidth(props.size[0]);
    setInitialHeight(props.size[1]);
    setScale(props.size[2]);
    setCanvasColor("#FFFFFF");
    if (canvasData != undefined) {
      setCanvasID(Object.keys(canvasData)[0]);
      console.log("backgroundColor", Object.keys(canvasData)[0]);
      setCanvasColor(canvasData[Object.keys(canvasData)[0]].backgroundColor);
      if (canvasData[Object.keys(canvasData)[0]]["images"] != []) {
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
          setzIndex((prevzIndex) => ({
            ...prevzIndex,
            [images[i].id]: images[i].zIndex,
          }));
        }
      }
      if (canvasData[Object.keys(canvasData)[0]]["texts"] != []) {
        const texts = canvasData[Object.keys(canvasData)[0]]["texts"];
        for (let i = 0; i < texts.length; i++) {
          setCanvasTexts((prevState) => [
            ...prevState,
            {
              id: texts[i].id,
              rest: texts[i],
            },
          ]);
          setFontWeight((prevFontWeight) => ({
            ...prevFontWeight,
            [texts[i].id]: texts[i].fontWeight === 900 ? true : false,
          }));
          setFontSizes((prevFontSizes) => ({
            ...prevFontSizes,
            [texts[i].id]: texts[i].fontSize,
          }));
          setSelectedFont((prevSelect) => ({
            ...prevSelect,
            [texts[i].id]: texts[i].fontFamily,
          }));
          setTextColor((prevTextColor) => ({
            ...prevTextColor,
            [texts[i].id]: texts[i].color,
          }));
          setzIndex((prevzIndex) => ({
            ...prevzIndex,
            [texts[i].id]: texts[i].zIndex,
          }));
          setBackgroundColor((prevBackgroundColor) => ({
            ...prevBackgroundColor,
            [texts[i].id]: texts[i].backgroundColor,
          }));
        }
      }
    } else {
      setCanvasID(uuidv4());
    }
  }, [canvasData, props.size]);

  useEffect(() => {
    if (props.newCanvasImageSrc) {
      const newSrc = props.newCanvasImageSrc;
      const id = props.Imgid;
      setCanvasImages([...canvasImages, { id: id, src: newSrc }]);
      setCancel(false);
      setIsSelected(props.Imgid);
      setShowImageTool(true);
      setShowCanvasTool(false);
      setShowMessage(false);
      selectedIdRef.current = props.Imgid;
      setzIndex((prevzIndex) => ({
        ...prevzIndex,
        [props.Imgid]: 1,
      }));
    }
  }, [props.Imgid]);

  useEffect(() => {
    if (props.Textid) {
      setCanvasTexts([...canvasTexts, { id: props.Textid }]);
      setCancel(false);
      setIsSelected(props.Textid);
      setShowTextTool(true);
      setShowCanvasTool(false);
      setShowMessage(false);
      selectedIdRef.current = props.Textid;
      setzIndex((prevzIndex) => ({
        ...prevzIndex,
        [props.Textid]: 1,
      }));
    }
  }, [props.Textid]);

  // useEffect(() => {
  //   if (props.Shapesid) {
  //     setCanvasTexts([...canvasShapes, { id: props.Shapesid }]);
  //     setCancel(false);
  //     setIsSelected(props.Shapesid);
  //     selectedIdRef.current = props.Textid;
  //   }
  // }, [props.Shapesid]);
  // console.log(IsSelected);
  //選擇畫布尺寸

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

  //物件選取
  useEffect(() => {
    document.addEventListener("pointerdown", handleSelect);
    setMaxlayer(canvasImages.length + canvasTexts.length + 1);
    return () => {
      document.removeEventListener("pointerdown", handleSelect);
    };
  }, [
    canvasImages,
    canvasTexts,
    ShowTextPicker,
    ShowCanvasPicker,
    ShowBackgroundPicker,
  ]);

  const handleSelect = (event) => {
    // console.log("event.target", event.target);

    const isImageInCanvas = canvasImages.some(
      (img) => img.id === event.target.id
    );
    const isTextInCanvas = canvasTexts.some(
      (text) => text.id === event.target.id
    );
    if (isImageInCanvas || isTextInCanvas) {
      setShowCanvasTool(false);
      setCancel(false);
      setShowMessage(false);
      setIsSelected(event.target.id);
      selectedIdRef.current = event.target.id;
      if (isImageInCanvas) {
        setShowImageTool(true);
        setShowTextTool(false);
        props.handleShowBox(false);
      } else {
        setShowTextTool(true);
        setShowImageTool(false);
      }
    } else if (
      event.target.closest(".config-box") != null ||
      event.target.className === "resize-dot" ||
      event.target.closest(".config-detail") != null ||
      event.target.className === "turn" ||
      event.target.closest(".side-icons") != null ||
      event.target.closest(".scroll-box") != null
    ) {
      console.log("1");
      setCancel(false);
    } else if (ShowTextPicker && event.target.closest(".picker") === null) {
      console.log("2");
      setCancel(false);
      setShowTextPicker(false);
    } else if (
      ShowCanvasPicker &&
      event.target.closest(".canvas-picker") === null
    ) {
      console.log("3");
      setCancel(false);
      setShowCanvasPicker(false);
    } else if (
      ShowBackgroundPicker &&
      event.target.closest(".picker-position") === null
    ) {
      console.log("5");
      setCancel(false);
      setShowBackgroundPicker(false);
    } else {
      console.log("4", ShowBackgroundPicker);
      setCancel(true);
      setShowTextTool(false);
      props.handleShowBox(false);
      setShowImageTool(false);
      selectedIdRef.current = "";
      setIsSelected("");
    }
  };

  //Backspace刪除
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    canvasTexts,
    props.searching,
    canvasImages,
    InFocusRef.current,
    selectedIdRef.current,
  ]);

  const handleKeyDown = (event) => {
    // console.log("selectedIdRef.current", canvasTexts);
    if (event.key === "Backspace" && !InFocusRef.current && !props.searching) {
      // console.log(canvasTexts);
      setCanvasTexts(
        canvasTexts.filter((Text) => Text.id !== selectedIdRef.current)
      );
      selectedIdRef.current = ""; // 取消選中的 CanvasText
    }
  };

  const handleImgDelete = (event) => {
    // console.log("wong");
    if (event.key === "Backspace") {
      const id = selectedIdRef.current;
      // const id = event.target.children[0].children[0].getAttribute("id");
      setCanvasImages(canvasImages.filter((Image) => Image.id !== id));
    }
  };

  // console.log(window.location);
  //處理快照
  const handleScreenShot = async () => {
    setCancel(true);
    setShowTextTool(false);
    setShowImageTool(false);
    setShowCanvasTool(false);
    //讀取會員登入狀態否則跳出登入提示
    if (currentUser) {
      // console.log(currentUser);
      const canvas = document.getElementById("canvas");
      scaleRef.current = scale;
      setScale(100);

      // html2canvas(canvas, { allowTaint: true }).then((canvas) => {
      //   document.body.appendChild(canvas);
      // });
      domtoimage
        .toBlob(canvas, { crossOrigin: "anonymous" })
        .then(function (blob) {
          // 測試圖片生成是否正常
          // document.body.appendChild(canvas);
          const storageRef = ref(storage, `${canvas.children[0].id}.jpg`);
          // window.saveAs(blob, "my-result.png");

          // 將圖片放入storage
          uploadBytes(storageRef, blob).then((snapshot) => {
            navigator.clipboard.writeText(
              window.location.host + "/poster/" + canvas.children[0].id
            );
            seturl(window.location.host + "/poster/" + canvas.children[0].id);
            setShowMessage(true);
          });
        });
      setScale(scaleRef.current);
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

  const handleSave = () => {
    if (currentUser) {
      setSaving(true);
      setCancel(true);
      setShowTextTool(false);
      setShowImageTool(false);
      selectedIdRef.current = "";
      setIsSelected("");

      const canvas = document.getElementById("canvas");

      scaleRef.current = scale;
      setScale(100);

      domtoimage
        .toBlob(canvas, { crossOrigin: "anonymous" })
        .then(function (blob) {
          // document.body.appendChild(canvas);
          const storageRef = ref(
            storage,
            `${currentUser.uid}/Snapshot/${canvasID}.jpg`
          );
          uploadBytes(storageRef, blob).then((snapshot) => {
            setScale(scaleRef.current);
          });
        });

      const newObj = {
        images: [],
        texts: [],
        width: initialWidth,
        height: initialHeight,
        backgroundColor: CanvasColor,
        name: projectName,
      };

      newObj["images"] = imagesData;
      newObj["texts"] = textsData;

      setDoc(doc(db, `${currentUser.uid}`, canvasID), newObj);
      console.log("savedData", newObj);
      setTimeout(() => {
        setSaving(false);
        props.check(canvasID);
      }, 1500);
    } else {
      setShowSignin(true);
      setAlert(<div className="alert"> 登入尚可儲存專案</div>);

      const handleMask = (event) => {
        // console.log(event.target);

        if (event.target === document.querySelector(".mask")) {
          setShowSignin(false);
        }
      };
      addEventListener("click", handleMask);
    }
  };

  //即時存儲
  useEffect(() => {
    // console.log("imagesData", imagesData);
    const newObj = {
      images: [],
      texts: [],
      width: initialWidth,
      height: initialHeight,
      backgroundColor: CanvasColor,
      name: projectName,
    };
    const timer = setTimeout(() => {
      // const canvas = document.getElementById("canvas");
      // // scaleRef.current = 25;
      // // setScale(100);
      // domtoimage
      //   .toBlob(canvas, { crossOrigin: "anonymous" })
      //   .then(function (blob) {
      //     // 測試圖片生成是否正常
      //     // document.body.appendChild(canvas);
      //     const storageRef = ref(
      //       storage,
      //       `${currentUser.uid}/Snapshot/${canvasID}.jpg`
      //     );
      //     // window.saveAs(blob, "my-result.png");

      //     // 將圖片放入storage
      //     uploadBytes(storageRef, blob).then((snapshot) => {
      //       // setScale(scaleRef.current);
      //     });
      //   });

      newObj["images"] = imagesData;
      newObj["texts"] = textsData;
      // console.log(newObj);
      // console.log("canvasID", canvasID);
      // setDoc(doc(db, `${currentUser.uid}`, canvasID), newObj);
    }, 10000);

    // 在组件重新渲染或被卸载时，清除计时器
    return () => {
      clearTimeout(timer);
    };
  }, [currentUser, imagesData, textsData, CanvasColor, canvasID]);

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

  const handletextData = (textData) => {
    // console.log("imageData", imageData);
    setTextsData((prevTextsData) => {
      const textIndex = prevTextsData.findIndex(
        (text) => text.id === textData.id
      );
      if (textIndex !== -1) {
        // 如果找到相同的 id，就更新對應的資料
        const newTextsData = [...prevTextsData];
        newTextsData[textIndex] = textData;
        return newTextsData;
      } else {
        // 如果沒有找到相同的 id，就新增資料
        return [...prevTextsData, textData];
      }
    });
  };

  // const handleTextTool = (value) => {
  //   setShowTextTool(value);
  // };

  const handleCanvasTool = () => {
    if (cancel) {
      setShowCanvasTool(true);
      setShowMessage(false);
    }
  };

  //文字編輯才不會觸發刪除
  const handleInFocus = (value) => {
    InFocusRef.current = value;
  };

  useEffect(() => {
    IsSettingRef.current = IsSetting;
  }, [IsSetting]);

  useEffect(() => {
    setFontSizesText(fontSizes[selectedIdRef.current]);
  }, [selectedIdRef.current]);

  const handleFontSize = (id, value) => {
    // console.log("IsSetting", IsSettingRef.current, "FontSizes", fontSizes);
    if (!IsSettingRef.current) {
      setFontSizes((prevFontSizes) => ({
        ...prevFontSizes,
        [id]: value,
      }));
      setFontSizesText(fontSizes[selectedIdRef.current]);
    }
  };

  const handleClick = (event) => {
    event.target.select();
  };

  const handleTextColorChange = (newColor) => {
    setTextColor((prevTextColor) => ({
      ...prevTextColor,
      [selectedIdRef.current]: newColor.hex,
    }));
  };

  const handleBackgroundChange = (newColor) => {
    setBackgroundColor((prevBackgroundColor) => ({
      ...prevBackgroundColor,
      [selectedIdRef.current]: newColor.hex,
    }));
  };

  const handleCanvasColorChange = (newColor) => {
    setCanvasColor(newColor.hex);
  };

  useEffect(() => {
    if (props.font) {
      setSelectedFont((prevSelect) => ({
        ...prevSelect,
        [selectedIdRef.current]: props.font,
      }));
      const font = props.font;
      WebFont.load({
        google: {
          families: [font],
        },
      });
    }
  }, [props.font]);
  // const handleFontChange = (event) => {
  //   setSelectedFont((prevSelect) => ({
  //     ...prevSelect,
  //     [selectedIdRef.current]: event.target.value,
  //   }));
  //   const font = event.target.value;
  //   WebFont.load({
  //     google: {
  //       families: [font],
  //     },
  //   });
  // };
  const handleForward = () => {
    // console.log("向前", zIndex[selectedIdRef.current], maxLayer, zIndex);
    if (
      zIndex[selectedIdRef.current] >= 0 &&
      zIndex[selectedIdRef.current] < maxLayer
    ) {
      setzIndex((prevzIndex) => ({
        ...prevzIndex,
        [selectedIdRef.current]: zIndex[selectedIdRef.current] + 1,
      }));
      // console.log(zIndex);
    }
  };

  const handleBackward = () => {
    // console.log("向後", zIndex[selectedIdRef.current], maxLayer, zIndex);
    if (
      zIndex[selectedIdRef.current] > 0 &&
      zIndex[selectedIdRef.current] <= maxLayer
    ) {
      setzIndex((prevzIndex) => ({
        ...prevzIndex,
        [selectedIdRef.current]: zIndex[selectedIdRef.current] - 1,
      }));
      // console.log(zIndex);
    }
  };
  // const fontNames = fontList.map((font) => font.family);
  // console.log(selectedFont);

  return (
    <>
      {showSignin && (
        <>
          <div className="mask"></div>
          <Signin alert={alert} />
        </>
      )}
      <div className="editer-top editer">
        <div className="deploy">
          {showCanvasTool && (
            <>
              <div
                className="canvasColor-preview"
                onClick={() => {
                  setShowCanvasPicker(true);
                }}
                style={{
                  backgroundColor: CanvasColor || "#FFFFFF",
                }}
              >
                {ShowCanvasPicker && (
                  <>
                    <SketchPicker
                      className="canvas-picker"
                      color={CanvasColor}
                      onChange={handleCanvasColorChange}
                    />
                  </>
                )}
              </div>
            </>
          )}
          {showImageTool && (
            <div className="config-box">
              <img
                className="config-button2"
                src="/images/forward.png"
                onClick={handleForward}
              />
              <img
                className="config-button2"
                onClick={() => {
                  setCanvasImages(
                    canvasImages.filter(
                      (Image) => Image.id !== selectedIdRef.current
                    )
                  );
                }}
                src="/images/delete.png"
              />
              <img
                className="config-button2"
                src="/images/backward.png"
                onClick={handleBackward}
              />
            </div>
          )}

          {showTextTool && (
            <>
              <div className="config-box">
                <div
                  className="fontselect"
                  onClick={() => {
                    props.handleShowBox(true);
                  }}
                >
                  <div className="fontselect-content">
                    {selectedFont[selectedIdRef.current] || "Noto Sans"}
                  </div>
                  <img src="/images/down.png" />
                </div>
                <div className="font-size-container">
                  <button
                    onClick={() => {
                      setIsSetting(true);
                      setFontSizes((prevFontSizes) => ({
                        ...prevFontSizes,
                        [selectedIdRef.current]: fontSizesText - 1,
                      }));
                      setIsSetting(false);
                    }}
                    className="minus size-config"
                  >
                    <img className="config-img" src="/images/minus.png" />
                  </button>
                  <input
                    className="font-size"
                    onChange={handleSizeChange}
                    onKeyDown={handleSubmit}
                    onClick={handleClick}
                    value={fontSizesText || 25}
                  ></input>
                  <button
                    onClick={() => {
                      setIsSetting(true);
                      setFontSizes((prevFontSizes) => ({
                        ...prevFontSizes,
                        [selectedIdRef.current]: fontSizesText + 1,
                      }));
                      setIsSetting(false);
                    }}
                    className="add size-config"
                  >
                    <img className="config-img" src="/images/add.png" />
                  </button>
                </div>
                <img
                  className="config-button"
                  onClick={() => {
                    setFontWeight((prevFontWeight) => ({
                      ...prevFontWeight,
                      [selectedIdRef.current]: !fontWeight,
                    }));
                  }}
                  src="/images/b.png"
                />
                <div id="picker-position">
                  <img
                    className="config-button"
                    onClick={() => {
                      setShowBackgroundPicker(true);
                      if (ShowTextPicker) {
                        setShowTextPicker(false);
                      }
                    }}
                    style={{
                      backgroundColor:
                        backgroundColor[selectedIdRef.current] || "#FFA99F",
                    }}
                    src="/images/a.png"
                  />
                  {ShowBackgroundPicker && (
                    <>
                      <SketchPicker
                        className="background-picker"
                        color={backgroundColor}
                        onChange={handleBackgroundChange}
                      />
                    </>
                  )}
                </div>
                <div
                  className="textcolor"
                  onClick={() => {
                    setShowTextPicker(true);
                    if (ShowBackgroundPicker) {
                      setShowBackgroundPicker(false);
                    }
                  }}
                >
                  <img src="/images/a.png" />
                  <div
                    className="textColor-preview"
                    style={{
                      backgroundColor:
                        TextColor[selectedIdRef.current] || "#000000",
                    }}
                  ></div>
                  {ShowTextPicker && (
                    <>
                      <SketchPicker
                        className="picker"
                        color={TextColor[selectedIdRef.current]}
                        onChange={handleTextColorChange}
                      />
                    </>
                  )}
                </div>
                <img
                  className="config-button2"
                  src="/images/forward.png"
                  onClick={handleForward}
                />
                <img
                  className="config-button2"
                  onClick={() => {
                    setCanvasTexts(
                      canvasTexts.filter(
                        (Text) => Text.id !== selectedIdRef.current
                      )
                    );
                  }}
                  src="/images/delete.png"
                />
                <img
                  className="config-button2"
                  src="/images/backward.png"
                  onClick={handleBackward}
                />
              </div>
            </>
          )}
          <img
            className="deployimg"
            onClick={handleScreenShot}
            src="/images/share.png"
          />
          {showMessage && (
            <>
              <div className="url">{url}</div>
              <div className="message">已複製分享連結</div>
            </>
          )}
        </div>
      </div>
      <div className="canvas-container">
        <div
          className="frame"
          style={{
            height: height,
            width: width,
          }}
        >
          <div id="canvas">
            <div
              className="outer-canvas"
              style={{
                width: initialWidth,
                height: initialHeight,
                transform: `scale(${scale * 0.01})`,
                backgroundColor: CanvasColor,
              }}
              onClick={handleCanvasTool}
              id={canvasID}
            >
              {canvasImages.map((Image) => (
                <CanvasImage
                  key={Image.id}
                  src={Image.src}
                  id={Image.id}
                  onKeyDown={handleImgDelete}
                  rest={Image.rest}
                  imageData={handleimageData}
                  selected={IsSelected}
                  zIndex={zIndex[Image.id] || 1}
                  scale={scale}
                  cancel={cancel}
                  // maxLayer={maxLayer}
                />
              ))}
              {canvasTexts.map((Text) => (
                <CanvasText
                  key={Text.id}
                  id={Text.id}
                  rest={Text.rest}
                  // handleTextTool={handleTextTool}
                  fontWeight={fontWeight[Text.id]}
                  // onClick={handleTextClick(Text.id)}
                  onKeyDown={handleKeyDown}
                  textData={handletextData}
                  handleInFocus={handleInFocus}
                  handleFontSize={handleFontSize}
                  fontSize={fontSizes[Text.id] || 25}
                  selected={IsSelected}
                  cancel={cancel}
                  fontFamily={selectedFont[Text.id] || "Noto Sans"}
                  color={TextColor[Text.id] || "#000000"}
                  // maxLayer={maxLayer}
                  zIndex={zIndex[Text.id] || 1}
                  scale={scale}
                  backgroundColor={backgroundColor[Text.id] || "transparent"}
                />
              ))}
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
          {saving && (
            <>
              <div className="saving">
                <div className="loading"></div>
                　Saving
              </div>
              <div className="mask"></div>
            </>
          )}
          <img
            className="saveimg"
            onClick={handleSave}
            src="/images/save.png"
          />
        </div>
      </div>
    </>
  );
};

export default Canvas;
