import React, { useEffect } from "react";
// import { useLayoutEffect } from "react";
import "../Styles/EditZone.css";
import { useState } from "react";
import BoxImage from "./BoxImage";
// import AuthProject from "./AuthProject";
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


const EditZone = (props) => {
    console.log("EditZone");
    const currentUser = useContext(CurrentUser)

    //切版相關
    const [sideboxStyle, setSideboxStyle] = useState({ display: "grid", gridTemplateColumns: "90px 1fr" });
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);
    const [newCanvasImage, setNewCanvasImage] = useState();
    const threeArea = innerWidth - 490;
    const twoArea = innerWidth - 90;

    //工具列顯示
    const [showBox, setShowBox] = useState(false);
    const [selectedBox, setSelectedBox] = useState("");
    const [uploadImages, setUploadImages] = useState([])
    const [snapshots, setSnapshots] = useState([])
    const toolImages = ["https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4193312.png?alt=media&token=c0d409c1-affa-4d4c-97f9-522f99b142ed",
        "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/bear.png?alt=media&token=f6c73a80-0315-47e3-a0cf-2884986403e9",
        "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/5463321.png?alt=media&token=e3ab2628-0ca5-4e40-9fe9-bc59a73368df",
        "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/5463405.png?alt=media&token=fd4ae01e-db9b-46c5-9009-616cb1f1a4d0",
        "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/6443634.png?alt=media&token=3f95b586-7a33-4ae3-b266-07f70574d991",
        "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4383887.png?alt=media&token=cd7e1f52-08ec-4003-b094-45d796ee631c",
        "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4383956.png?alt=media&token=8cc0e484-838e-4bcf-a57e-886a5b400ff0",
        "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4383973.png?alt=media&token=f68bfab4-2aba-4cf9-8c4f-c6a19ffdaf59",
        "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4392550.png?alt=media&token=22ae07aa-5aa6-4e71-bbe2-52cd480f65dd",
        "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4392447.png?alt=media&token=a33e8698-b405-427d-b2ed-2a388bd03147",
        "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4392505.png?alt=media&token=833ecae9-43d7-474e-adc1-d4cb8d15b6c4",
        "https://firebasestorage.googleapis.com/v0/b/react-project-26a32.appspot.com/o/4481010.png?alt=media&token=6ece33ec-0f1b-417d-84ef-0eb1127d5139"
    ];


    const [boundaries, setBoundaries] = useState();
    const [id, setId] = useState();


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
        showBox ?
            setSideboxStyle({ display: "grid", gridTemplateColumns: `90px 400px ${threeArea}px` }) :
            setSideboxStyle({ display: "grid", gridTemplateColumns: `90px ${twoArea}px` });
    }, [innerWidth])


    //開啟工具欄
    const handleBoxOn = (event) => {
        if (!showBox) {
            setShowBox(true);
            setSideboxStyle({ display: "grid", gridTemplateColumns: `90px 400px ${threeArea}px` });
        }
        if (selectedBox === event.target.id && showBox) {
            handleBoxOff()
        }
        else {
            setSelectedBox(event.target.id);
        }

    }

    const handleBoxOff = () => {
        setShowBox(false)
        setSideboxStyle({ display: "grid", gridTemplateColumns: `90px ${twoArea}px` })
        setSelectedBox("");
    }


    //黏貼事件

    useEffect(() => {
        const handlePaste = (event) => {
            //呼叫剪貼板內的數據
            const items = event.clipboardData.items;
            console.log(items);
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                console.log(item);
                //遍歷後確認是否包含圖像且只取最後一個
                if (item.type.indexOf("image") !== -1) {

                    const file = item.getAsFile();
                    //給予一個ID
                    const imgId = shortid.generate()
                    //存入 Firebase Storage
                    const storageRef = ref(storage, `${currentUser.uid}/Upload/${imgId}.jpg`);
                    uploadBytes(storageRef, file).then((snapshot) => {
                        getDownloadURL(storageRef).then((url) => {
                            //拿到 url 後加入畫布
                            setNewCanvasImage(url)
                            setId(imgId)
                        })
                    })
                }
            }
        }
        //使用 useEffect 控制事件偵測只執行一次
        document.addEventListener("paste", handlePaste);
        if (currentUser != undefined) {
            const storageRef = ref(storage, `${currentUser.uid}/Upload/`);
            const urls = []
            listAll(storageRef).then(function (result) {
                result.items.forEach(function (imageRef) {
                    getDownloadURL(ref(storage, imageRef.fullPath)).then((url) => {
                        urls.push(url)
                        setUploadImages(urls);
                    })
                });
            })
        }
        return () => {
            document.removeEventListener("paste", handlePaste);
        };
    }, [currentUser]);
    //在currentUser改變後重新執行

    useEffect(() => {
        if (currentUser != undefined) {
            // const canvas = document.getElementById('canvas');
            const storageRef = ref(storage, `${currentUser.uid}/Snapshot/`);
            listAll(storageRef).then(function (result) {
                result.items.forEach(function (imageRef) {
                    getDownloadURL(ref(storage, imageRef.fullPath)).then((url) => {
                        setSnapshots(prevState => [...prevState, { id: imageRef.name.split(".")[0], src: url }])
                        //prevState可以避免覆蓋，否則snapshots只有最後一個內容
                    }).catch((error) => {
                        console.log(error);
                    })
                })
            })
        }
    }, [currentUser]);

    const AuthProject = (props) => {
        return <div className="project-item" onClick={handleLoad}>
            <img
                src={props.src}
                id={props.id}
            />
        </div>
    };

    const handleLoad = (event) => {
        // e.target.id
        console.log(event);
        getDocs(collection(db, `${currentUser.uid}`)).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.id === event.target.id){
                    console.log('Document data:', doc.data());
                }
                
            });
        })
    }

    return <>
        <div style={sideboxStyle}>
            <div className="sidebar">
                <div onClick={handleBoxOn} className="side-icons" style={{ backgroundColor: selectedBox === "Image" ? "#2e2e2e" : "#1c160a" }} id="Image">
                    <img src="/images/image.png" className="side-icon" id="Image" />
                    <div className="icontext" id="Image">Images</div>
                </div>
                <div onClick={handleBoxOn} className="side-icons" style={{ backgroundColor: selectedBox === "Upload" ? "#2e2e2e" : "#1c160a" }} id="Upload">
                    <img src="/images/upload.png" className="side-icon" id="Upload" />
                    <div className="icontext" id="Upload">Upload</div>
                </div>
                <div onClick={handleBoxOn} className="side-icons" style={{ backgroundColor: selectedBox === "Project" ? "#2e2e2e" : "#1c160a" }} id="Project">
                    <img src="/images/folder.png" className="side-icon" id="Project" />
                    <div className="icontext" id="Project">Projects</div>
                </div>
            </div>
            {showBox && <>
                <div className="side-container">
                    <div className="side-boxes" id="Image" style={{ display: selectedBox === "Image" ? "grid" : "none", borderRadius: "0 5px 5px 5px" }}>
                        {toolImages.map((toolImage, index) => <BoxImage key={index} src={toolImage} boundaries={boundaries} id={shortid.generate()}
                            oncopystate={(src) => {
                                // console.log("src",src);
                                if (src != undefined) {
                                    setNewCanvasImage(src)
                                    setId(shortid.generate())
                                }
                            }} />)}
                    </div>
                    <div className="side-boxes" id="Upload" style={{ display: selectedBox === "Upload" ? "grid" : "none" }}>
                        {uploadImages.map((toolImage, index) => <BoxImage key={index} src={toolImage} boundaries={boundaries} id={shortid.generate()}
                            oncopystate={(src) => {
                                // console.log("src",src);
                                if (src != undefined) {
                                    setNewCanvasImage(src)
                                    setId(shortid.generate())
                                }
                            }} />)}
                    </div>
                    <div className="side-boxes" id="Project" style={{ display: selectedBox === "Project" ? "grid" : "none" }}>
                        {snapshots.map((snapshot, index) => <AuthProject key={index} src={snapshot.src} id={snapshot.id}  />)}
                    </div>
                    <div className="close-boxes" onClick={handleBoxOff} ><img src="/images/arrow-left.png" className="close-icon" /></div>
                </div>
            </>}

            <div className="edit-zone">
                <Canvas boundaries={handleBoundaries} showBox={showBox} newCanvasImage={newCanvasImage} id={id} />
            </div>
        </div>
    </>
}

export default EditZone