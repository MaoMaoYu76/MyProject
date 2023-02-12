import React, { useEffect } from "react";
import "../Components/EditZone.css";
import { useState } from "react";
import BoxImage from "./BoxImage";
import Canvas from "./Canvas";
import shortid from "shortid";
import { storage } from "../firebase";


const EditZone = () => {
    const [showBox, setShowBox] = useState(false);

    //工具列顯示相關
    const [sideboxStyle, setSideboxStyle] = useState({ display: "grid", gridTemplateColumns: "90px 1fr" });
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);
    const [newCanvasImage, setNewCanvasImage] = useState();
    const threeArea = innerWidth - 490;
    const twoArea = innerWidth - 90;
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
    // console.log(storage);

    const [boundaries, setBoundaries] = useState();
    const [id, setId] = useState();


    const handleBoundaries = (boundaries) => {
        setBoundaries(boundaries);
    };

    //畫面大小偵測
    const callback = () => {
        setInnerWidth(window.innerWidth);
    }
    window.addEventListener("resize", callback)

    useEffect(() => {
        showBox ?
            setSideboxStyle({ display: "grid", gridTemplateColumns: `90px 400px ${threeArea}px` }) :
            setSideboxStyle({ display: "grid", gridTemplateColumns: `90px ${twoArea}px` });
    }, [innerWidth])

    const handleBox = () => {
        setShowBox(!showBox)
        showBox ?
            setSideboxStyle({ display: "grid", gridTemplateColumns: `90px ${twoArea}px` }) :
            setSideboxStyle({ display: "grid", gridTemplateColumns: `90px 400px ${threeArea}px` });
    }

    return <>
        <div style={sideboxStyle}>
            <div className="sidebar">
                <img src="/images/template.png" className="side-icon" onClick={handleBox} />
                <div className="icontext">Template</div>
            </div>
            {showBox && <>
                <div className="side-container">
                    {toolImages.map((toolImage, index) => <BoxImage key={index} src={toolImage} boundaries={boundaries} id={shortid.generate()}
                        oncopystate={(src) => {
                            // console.log("src",src);
                            if (src != undefined) {
                                setNewCanvasImage(src)
                                setId(shortid.generate())
                            }
                        }} />)}
                </div>
            </>}
            <div className="edit-zone">
                <Canvas boundaries={handleBoundaries} showBox={showBox} newCanvasImage={newCanvasImage} id={id} />
            </div>
        </div>
    </>
}

export default EditZone