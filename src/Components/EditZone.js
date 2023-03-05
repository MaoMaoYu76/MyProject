import React, { useEffect } from "react";
// import { useLayoutEffect } from "react";
import "../Styles/EditZone.css";
import { useState } from "react";
import BoxImage from "./BoxImage";
import UploadImage from "./UploadImage";
import AuthProject from "./AuthProject";
import Canvas from "./Canvas";
import shortid from "shortid";
import { debounce } from "lodash";
import { uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { ref } from "firebase/storage";
import { useContext } from "react";
import { CurrentUser } from "../Pages/edit";
import { getDownloadURL } from "firebase/storage";
import { listAll } from "firebase/storage";
import { db } from "../firebase";
import { getDocs } from "firebase/firestore";
import { collection } from "firebase/firestore";
import FontList from "./FontList";
import Signin from "./Signin";

const EditZone = (props) => {
  console.log("EditZone");
  const currentUser = useContext(CurrentUser);
  const [alert, setAlert] = useState(null);

  //切版相關
  const [sideboxStyle, setSideboxStyle] = useState({
    display: "grid",
    gridTemplateColumns: "90px 1fr",
  });
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [newCanvasImageSrc, setNewCanvasImageSrc] = useState();
  const threeArea = innerWidth - 490;
  const twoArea = innerWidth - 90;

  //工具列顯示
  const [showBox, setShowBox] = useState(false);
  const [selectedBox, setSelectedBox] = useState("");
  const [uploadImages, setUploadImages] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [display, setDisplay] = useState("none");
  const toolImages = [
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4193312.png?alt=media&token=c0d409c1-affa-4d4c-97f9-522f99b142ed",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/bear.png?alt=media&token=f6c73a80-0315-47e3-a0cf-2884986403e9",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/5463321.png?alt=media&token=e3ab2628-0ca5-4e40-9fe9-bc59a73368df",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4383887.png?alt=media&token=cd7e1f52-08ec-4003-b094-45d796ee631c",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4383956.png?alt=media&token=8cc0e484-838e-4bcf-a57e-886a5b400ff0",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4383973.png?alt=media&token=f68bfab4-2aba-4cf9-8c4f-c6a19ffdaf59",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4392447.png?alt=media&token=a33e8698-b405-427d-b2ed-2a388bd03147",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4392505.png?alt=media&token=833ecae9-43d7-474e-adc1-d4cb8d15b6c4",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4481010.png?alt=media&token=6ece33ec-0f1b-417d-84ef-0eb1127d5139",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4289412.png?alt=media&token=7cb9dfbe-ee9c-4f3d-9d88-7aa25eafea98",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4289415.png?alt=media&token=9ffd7597-29fd-4e66-9a84-e3cf159aad7b",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4359655.png?alt=media&token=bec9d714-ac4a-4205-90c7-d0862da51204",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4359700.png?alt=media&token=1cb7cf3a-cd3c-427b-93b5-582503a7f5d2",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4383882.png?alt=media&token=490b89c6-02f9-44e9-9b7f-c8593595859c",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4383939.png?alt=media&token=4e774fe9-548a-45a4-bd2c-9b8b34000761",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4825045.png?alt=media&token=2a64388d-8c10-4af2-aac0-fe2141b06912",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4861659.png?alt=media&token=b25d2b11-118a-413f-a86c-5f861e358b1e",
    "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4861742.png?alt=media&token=8764f6ad-48a2-4fa0-9e38-48ed39a147fc",
  ];
  // const shapes = [
  //   "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/circle.png?alt=media&token=39b39960-4510-4f09-bea3-2b9c58e4633b",
  //   "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/square.png?alt=media&token=857156c4-c97b-42eb-b992-23af0ec98c27",
  //   "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/triangle.png?alt=media&token=55bc391c-ce8d-4757-9919-c9f4617db15c",
  // ];
  const [boundaries, setBoundaries] = useState();
  const [Imgid, setImgId] = useState();
  const [Textid, setTextId] = useState();
  const [canvasData, setCanvasData] = useState();
  //test
  const [font, setFont] = useState("Noto Sans");
  const [size, setSize] = useState([529.1, 396.8, 125]);
  const [searching, setSearching] = useState();
  const [creating, setCreating] = useState(false);
  const [showSignin, setShowSignin] = useState(false);

  const handleSearch = (value) => {
    setSearching(value);
  };

  const handleFont = (font) => {
    setFont(font);
  };

  const handleShowBox = (value) => {
    value ? setDisplay("flex") : setDisplay("none");
    if (!showBox && value) {
      setShowBox(value);
    }
    if (!selectedBox && !value && display != "none") {
      setShowBox(value);
    }
  };
  const handleBoundaries = (boundaries) => {
    setBoundaries(boundaries);
  };

  //畫面大小偵測
  useEffect(() => {
    //延遲動作進行，優化效能
    const handleResize = debounce(() => {
      setInnerWidth(window.innerWidth);
    }, 50);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //根據視窗調整版寬，此關係到canvas的overflow在水平方向是否能正常scroll
  useEffect(() => {
    showBox
      ? setSideboxStyle({
          display: "grid",
          gridTemplateColumns: `90px 400px ${threeArea}px`,
        })
      : setSideboxStyle({
          display: "grid",
          gridTemplateColumns: `90px ${twoArea}px`,
        });
  }, [innerWidth, showBox]);

  //開啟工具欄
  const handleBoxOn = (event) => {
    if (
      event.target.id === "Image" ||
      event.target.id === "Text" ||
      currentUser
    ) {
      if (!showBox) {
        setShowBox(true);
        setSideboxStyle({
          display: "grid",
          gridTemplateColumns: `90px 400px ${threeArea}px`,
        });
      } else {
        setDisplay("none");
      }

      if (selectedBox === event.target.id && showBox && display === "flex") {
        setDisplay("none");
      } else if (
        selectedBox === event.target.id &&
        showBox &&
        display === "none"
      ) {
        handleBoxOff();
      } else {
        setSelectedBox(event.target.id);
      }
    } else {
      setShowSignin(true);
      setAlert(<div className="alert"> 登入使用會員專屬功能</div>);

      const handleMask = (event) => {
        // console.log(event.target);

        if (event.target === document.querySelector(".mask")) {
          setShowSignin(false);
        }
      };
      addEventListener("click", handleMask);
    }
  };

  const handleBoxOff = () => {
    setShowBox(false);
    setSideboxStyle({
      display: "grid",
      gridTemplateColumns: `90px ${twoArea}px`,
    });
    setSelectedBox("");
  };

  //黏貼事件
  useEffect(() => {
    const handlePaste = (event) => {
      //呼叫剪貼板內的數據
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        //遍歷後確認是否包含圖像且只取最後一個
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          //給予一個ID
          const imgId = shortid.generate();
          //存入 Firebase Storage
          const storageRef = ref(
            storage,
            `${currentUser.uid}/Upload/${imgId}.jpg`
          );
          uploadBytes(storageRef, file).then((snapshot) => {
            getDownloadURL(storageRef).then((url) => {
              //拿到 url 後加入畫布
              const file = url.split("/").pop();
              const fileName = file.slice(0, -4);
              setUploadImages((prevUploadImages) => [
                ...prevUploadImages,
                { url, fileName },
              ]);

              setNewCanvasImageSrc(url);
              setImgId(imgId);
            });
          });
        }
      }
    };
    document.addEventListener("paste", handlePaste);
    if (currentUser != undefined) {
      const storageRef = ref(storage, `${currentUser.uid}/Upload/`);
      listAll(storageRef).then(function (result) {
        result.items.forEach(function (imageRef) {
          getDownloadURL(ref(storage, imageRef.fullPath)).then((url) => {
            const file = imageRef.fullPath.split("/").pop();
            const fileName = file.slice(0, -4);
            setUploadImages((prevUploadImages) => [
              ...prevUploadImages,
              { url, fileName },
            ]);
          });
        });
      });
    }
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [currentUser]);
  //在currentUser改變後重新執行

  //找出所有專案截圖
  useEffect(() => {
    if (currentUser != undefined) {
      const storageRef = ref(storage, `${currentUser.uid}/Snapshot/`);
      listAll(storageRef).then((result) => {
        result.items.forEach((imageRef) => {
          getDownloadURL(ref(storage, imageRef.fullPath))
            .then((url) => {
              setSnapshots((prevState) => {
                const isExisting = prevState.some(
                  (item) =>
                    item.id === imageRef.name.split(".")[0] && item.src === url
                );
                if (!isExisting) {
                  return [
                    ...prevState,
                    { id: imageRef.name.split(".")[0], src: url },
                  ];
                }
                return prevState;
              });
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    }
  }, [currentUser]);

  // 上傳素材到 Firebase Storage
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const imgId = shortid.generate();
    const storageRef = ref(storage, `${currentUser.uid}/Upload/${imgId}.jpg`);

    await uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(storageRef).then((url) => {
        const file = url.split("/").pop();
        const fileName = file.slice(0, -4);
        setUploadImages((prevUploadImages) => [
          ...prevUploadImages,
          { url, fileName },
        ]);
      });
    });
  };

  return (
    <>
      {showSignin && (
        <>
          <div className="mask"></div>
          <Signin alert={alert} />
        </>
      )}
      {creating && (
        <>
          <div className="create">
            <img
              className="close-create"
              onClick={() => {
                setCreating(false);
              }}
              src="/images/close.png"
            />
            <div className="option">
              <img
                src="images/photo.png"
                onClick={() => {
                  setSize([1587.4, 2245, 25]);
                  setCreating(false);
                  setCanvasData();
                }}
                className="optionimg"
              />
              直立式海報
            </div>
            <div className="option">
              <img
                src="images/card.png"
                onClick={() => {
                  setSize([529.1, 396.8, 125]);
                  setCreating(false);
                  setCanvasData();
                }}
                className="optionimg"
              />
              橫向卡片
            </div>
          </div>
          <div className="mask"></div>
        </>
      )}
      <div style={sideboxStyle}>
        <div className="sidebar">
          <div
            onClick={handleBoxOn}
            className="side-icons"
            style={{
              backgroundColor: selectedBox === "Image" ? "#2e2e2e" : "#1c160a",
            }}
            id="Image"
          >
            <img src="/images/image.png" className="side-icon" id="Image" />
            <div className="icontext" id="Image">
              Images
            </div>
          </div>
          <div
            onClick={handleBoxOn}
            className="side-icons"
            style={{
              backgroundColor: selectedBox === "Text" ? "#2e2e2e" : "#1c160a",
            }}
            id="Text"
          >
            <img src="/images/text.png" className="side-icon" id="Text" />
            <div className="icontext" id="Text">
              Text
            </div>
          </div>
          <div
            onClick={handleBoxOn}
            className="side-icons"
            style={{
              backgroundColor: selectedBox === "Upload" ? "#2e2e2e" : "#1c160a",
            }}
            id="Upload"
          >
            <img src="/images/upload.png" className="side-icon" id="Upload" />
            <div className="icontext" id="Upload">
              Upload
            </div>
          </div>
          <div
            onClick={handleBoxOn}
            className="side-icons"
            style={{
              backgroundColor:
                selectedBox === "Project" ? "#2e2e2e" : "#1c160a",
            }}
            id="Project"
          >
            <img src="/images/folder.png" className="side-icon" id="Project" />
            <div className="icontext" id="Project">
              Projects
            </div>
          </div>
        </div>
        {showBox && (
          <>
            <div className="side-container">
              <div
                className="image-box"
                id="Image"
                style={{
                  display: selectedBox === "Image" ? "grid" : "none",
                  borderRadius: "0 5px 5px 5px",
                }}
              >
                {toolImages.map((toolImage, index) => (
                  <BoxImage
                    key={index}
                    src={toolImage}
                    boundaries={boundaries}
                    id={shortid.generate()}
                    oncopystate={(src) => {
                      // console.log("src",src);
                      if (src != undefined) {
                        setNewCanvasImageSrc(src);
                        setImgId(shortid.generate());
                      }
                    }}
                  />
                ))}
              </div>
              <div
                className="text-box"
                id="Upload"
                style={{ display: selectedBox === "Upload" ? "grid" : "none" }}
              >
                <label className="add-text" htmlFor="image-upload">
                  <img className="addnew" src="/images/button.png" />
                  點擊上傳專屬素材
                </label>
                <input
                  id="image-upload"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {uploadImages.map((toolImage, index) => (
                  <UploadImage
                    index={index}
                    key={toolImage.fileName}
                    src={toolImage.url}
                    boundaries={boundaries}
                    id={toolImage.fileName}
                    reset={(id) => {
                      setUploadImages(
                        uploadImages.filter((item) => item.fileName !== id)
                      );
                    }}
                    oncopystate={(src) => {
                      // console.log("src",src);
                      if (src != undefined) {
                        setNewCanvasImageSrc(src);
                        setImgId(shortid.generate());
                      }
                    }}
                  />
                ))}
              </div>
              <div
                className="project-box"
                id="Project"
                style={{ display: selectedBox === "Project" ? "grid" : "none" }}
              >
                <div
                  className="single-project"
                  onClick={() => {
                    setCreating(true);
                  }}
                >
                  <div className="add-preview">
                    <img className="add-project" src="/images/button.png" />
                  </div>
                  <div className="newproject">點擊新增專案</div>
                </div>
                {snapshots.map((snapshot) => (
                  <AuthProject
                    key={snapshot.id}
                    src={snapshot.src}
                    id={snapshot.id}
                    check={(id) => {
                      setSnapshots(snapshots.filter((item) => item.id !== id));
                    }}
                    handleCanvasData={(data) => {
                      setSize(
                        data[snapshot.id].height > 2000
                          ? [1587.4, 2245, 25]
                          : [529.1, 396.8, 125]
                      );
                      setCanvasData(data);
                    }}
                  />
                ))}
              </div>
              <div
                className="text-box"
                id="Text"
                style={{ display: selectedBox === "Text" ? "grid" : "none" }}
              >
                <div
                  className="add-text"
                  onClick={() => {
                    setTextId(shortid.generate());
                  }}
                >
                  <img className="addnew" src="/images/button.png" />
                  點擊新增文字區塊
                </div>
              </div>

              <div className="close-boxes" onClick={handleBoxOff}>
                <img src="/images/arrow-left.png" className="close-icon" />
              </div>
            </div>
          </>
        )}
        <div
          className="font-container"
          style={{
            display: display,
          }}
        >
          <FontList
            handleShowBox={handleShowBox}
            handleFont={handleFont}
            handleSearch={handleSearch}
          />
        </div>
        <div className="edit-zone">
          <Canvas
            showBox={showBox}
            size={size}
            newCanvasImageSrc={newCanvasImageSrc}
            Imgid={Imgid}
            canvasData={canvasData}
            Textid={Textid}
            font={font}
            searching={searching}
            boundaries={handleBoundaries}
            handleShowBox={handleShowBox}
            check={(canvasID) => {
              const storageRef = ref(
                storage,
                `${currentUser.uid}/Snapshot/${canvasID}.jpg`
              );
              getDownloadURL(storageRef).then((url) => {
                setSnapshots((prevState) => {
                  const existingIndex = prevState.findIndex(
                    (item) => item.id === canvasID
                  );
                  if (existingIndex !== -1) {
                    return prevState.map((item, index) => {
                      if (index === existingIndex) {
                        return {
                          ...item,
                          src: url,
                        };
                      }
                      return item;
                    });
                  }
                  return [...prevState, { id: canvasID, src: url }];
                });
              });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default EditZone;
