import React, { useEffect } from "react";
import "../Components/EditZone.css";
import { useState } from "react";
import Image from "./Image";
import Canvas from "./Canvas";


const EditZone = () => {
    const [showBox, setShowBox] = useState(false);
    const [sideboxStyle, setSideboxStyle] = useState({display: "grid",gridTemplateColumns:"90px 1fr"});
    const [innerWidth,setInnerWidth] = useState(window.innerWidth)
    const threeArea = innerWidth-490;
    const twoArea = innerWidth-90;


    const callback=()=>{
        setInnerWidth(window.innerWidth);
    }
    window.addEventListener("resize", callback)

    useEffect(()=>{
        showBox ? 
        setSideboxStyle({display: "grid",gridTemplateColumns:`90px 400px ${threeArea}px`}):
        setSideboxStyle({display: "grid",gridTemplateColumns:`90px ${twoArea}px`});
    },[innerWidth])

    const handleBox=()=>{
        setShowBox(!showBox)
        showBox ? 
        setSideboxStyle({display: "grid",gridTemplateColumns:`90px ${twoArea}px`}) :  
        setSideboxStyle({display: "grid",gridTemplateColumns:`90px 400px ${threeArea}px`});
    }


    return <>
        <div style={sideboxStyle}>
            <div className="sidebar">
                <img src="/images/template.png" className="side-icon" onClick={handleBox} />
                <div className="icontext">Template</div>
            </div>
            {showBox && <>
                <div className="side-container">
                    <Image src="/images/create.png" />
                </div>
            </>}
            <div className="edit-zone">
                <Canvas />
            </div>
        </div>
    </>
}

export default EditZone