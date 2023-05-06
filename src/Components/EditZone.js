import React, { useEffect } from "react";
// import { useLayoutEffect } from "react";
import "../Styles/EditZone.css";
import { useState } from "react";
import BoxImage from "./BoxImage";
import UploadImage from "./UploadImage";
import Template from "./Template";
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
  // console.log("EditZone");
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
  const [ToolImages, setToolImages] = useState([]);
  const [TemplateImages, setTemplateImages] = useState([]);
  const [PosterImages, setPosterImages] = useState([]);
  const [display, setDisplay] = useState("none");
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
      event.target.id === "Template" ||
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
              // console.log(error);
            });
        });
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const storageRef = ref(storage, "/Images");
    listAll(storageRef).then((result) => {
      result.items.forEach((imageRef) => {
        getDownloadURL(ref(storage, imageRef.fullPath)).then((url) => {
          setToolImages((prevState) => {
            if (!prevState.some((image) => image.src === url)) {
              return [...prevState, { id: shortid.generate(), src: url }];
            }
            return prevState;
          });
        });
      });
    });
  }, [ToolImages]);

  //template
  // useEffect(() => {
  //   const storageRef = ref(
  //     storage,
  //     size[0] > 2000 ? "/TemplatePoter" : "/Template"
  //   );
  //   listAll(storageRef).then((result) => {
  //     result.items.forEach((imageRef) => {
  //       getDownloadURL(ref(storage, imageRef.fullPath)).then((url) => {
  //         setTemplateImages((prevState) => {
  //           if (!prevState.some((image) => image.src === url)) {
  //             return [
  //               ...prevState,
  //               { id: imageRef.name.split(".")[0], src: url },
  //             ];
  //           }
  //           return prevState;
  //         });
  //       });
  //     });
  //   });
  // }, [TemplateImages, size]);

  useEffect(() => {
    // setTemplateImages([]);
    const storageRef = ref(storage, "/Template");
    listAll(storageRef).then((result) => {
      const newTemplateImages = [];
      result.items.forEach((imageRef) => {
        getDownloadURL(ref(storage, imageRef.fullPath)).then((url) => {
          if (!newTemplateImages.some((image) => image.src === url)) {
            newTemplateImages.push({
              id: imageRef.name.split(".")[0],
              src: url,
            });
            setTemplateImages(newTemplateImages);
          }
        });
      });
    });
  }, []);

  useEffect(() => {
    const PosterRef = ref(storage, "/TemplatePoster");
    listAll(PosterRef).then((result) => {
      const newTemplateImages = [];
      result.items.forEach((imageRef) => {
        getDownloadURL(ref(storage, imageRef.fullPath)).then((url) => {
          if (!newTemplateImages.some((image) => image.src === url)) {
            newTemplateImages.push({
              id: imageRef.name.split(".")[0],
              src: url,
            });
            setPosterImages(newTemplateImages);
          }
        });
      });
    });
  }, []);

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
              backgroundColor:
                selectedBox === "Template" ? "#2e2e2e" : "#1c160a",
            }}
            id="Template"
          >
            <img
              src="/images/template.png"
              className="side-icon"
              id="Template"
            />
            <div className="icontext" id="Template">
              Template
            </div>
          </div>
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
                className="template-box"
                id="Template"
                style={{
                  display: selectedBox === "Template" ? "grid" : "none",
                  borderRadius: "0 5px 5px 5px",
                }}
              >
                {size[0] > 1500
                  ? PosterImages.map((TemplateImage) => (
                      <Template
                        key={TemplateImage.id}
                        src={TemplateImage.src}
                        id={TemplateImage.id}
                        handleCanvasData={(data) => {
                          setSize(
                            data[TemplateImage.id].height > 2000
                              ? [1587.4, 2245, 25]
                              : [529.1, 396.8, 125]
                          );
                          setCanvasData();
                          setCanvasData(data);
                        }}
                      />
                    ))
                  : TemplateImages.map((TemplateImage) => (
                      <Template
                        key={TemplateImage.id}
                        src={TemplateImage.src}
                        id={TemplateImage.id}
                        handleCanvasData={(data) => {
                          setSize(
                            data[TemplateImage.id].height > 2000
                              ? [1587.4, 2245, 25]
                              : [529.1, 396.8, 125]
                          );
                          setCanvasData();
                          setCanvasData(data);
                        }}
                      />
                    ))}
                {/* {TemplateImages.map((TemplateImage) => (
                  <Template
                    key={TemplateImage.id}
                    src={TemplateImage.src}
                    id={TemplateImage.id}
                    handleCanvasData={(data) => {
                      setSize(
                        data[TemplateImage.id].height > 2000
                          ? [1587.4, 2245, 25]
                          : [529.1, 396.8, 125]
                      );
                      setCanvasData();
                      setCanvasData(data);
                    }}
                  />
                ))} */}
              </div>
              <div
                className="image-box"
                id="Image"
                style={{
                  display: selectedBox === "Image" ? "grid" : "none",
                  borderRadius: "5px",
                }}
              >
                {ToolImages.map((toolImage, index) => (
                  <BoxImage
                    key={toolImage.id}
                    src={toolImage.src}
                    boundaries={boundaries}
                    id={toolImage.id}
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
                      setCanvasData();
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
