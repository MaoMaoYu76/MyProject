import React, { useEffect } from "react";
import "../Components/EditZone.css";
import { useState } from "react";
import BoxImage from "./BoxImage";
import Canvas from "./Canvas";
import shortid from "shortid";


const EditZone = () => {
    const [showBox, setShowBox] = useState(false);
    const [sideboxStyle, setSideboxStyle] = useState({ display: "grid", gridTemplateColumns: "90px 1fr" });
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);
    const [boundaries, setBoundaries] = useState();
    const [newCanvasImage, setNewCanvasImage] = useState();
    const [id,setId] = useState();
    // console.log("canvasImages", canvasImages);
    // const [copy, setCopy] = useState(false);
    const threeArea = innerWidth - 490;
    const twoArea = innerWidth - 90;
    const toolImages = ["/images/create.png", "/images/love.png"];


    const handleBoundaries = (boundaries) => {
        setBoundaries(boundaries);
    };

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


    // useEffect(() => {
        // const create = document.querySelector(".create")
        // if(create!=null){

        // setDatasrc(create.getAttribute("src"));
        // }
    //     console.log("In", In);
    //     if (In) {
    //         setDatasrc(toolImage);
    //     }
    // }, [copy]);

    // const handleCopyState = (In) => {
    //     setCopy(In);
    //     console.log("copy",copy);
    //     if (copy === true) {
    //       const src = toolImages[index].src;
    //       console.log("src)",src);
    //     }
    //   };



    // console.log(datasrc);

    return <>
        <div style={sideboxStyle}>
            <div className="sidebar">
                <img src="/images/template.png" className="side-icon" onClick={handleBox} />
                <div className="icontext">Template</div>
            </div>
            {showBox && <>
                <div className="side-container">
                    {toolImages.map((toolImage, index) => <BoxImage key={index} src={toolImage} boundaries={boundaries} id={shortid.generate()}
                        oncopystate={(src)=>{
                            console.log("src",src);
                            if(src != undefined){
                            setNewCanvasImage(src)
                            setId(shortid.generate())
                            }}} />)}
                    {/* <BoxImage className="create" src="/images/create.png" boundaries={boundaries} oncopystate={(In)=>{setCopy(In)}}/> */}
                    {/* <BoxImage className="love" src="/images/love.png" boundaries={boundaries} h/> */}
                </div>
            </>}
            <div className="edit-zone">
                <Canvas boundaries={handleBoundaries} showBox={showBox} newCanvasImage={newCanvasImage} id={id} />
            </div>
        </div>
    </>
}

export default EditZone