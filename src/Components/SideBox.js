import React from "react";
import "../Components/SideBox.css";
import { useState } from "react";
import Image from "../Components/Image";
import Canvas from "../Components/Canvas";


const SideBox = (props) => {
    const [showBox, setShowBox] = useState(false);
    const [sideboxStyle, setSideboxStyle] = useState({display: "grid",gridTemplateColumns:"90px 1fr"});
    const vw = window.innerWidth-490;
    const { size } = props;

    const handleBox=()=>{
        setShowBox(!showBox)
        showBox ? 
        setSideboxStyle({display: "grid",gridTemplateColumns:"90px 1fr"}) :  
        setSideboxStyle({display: "grid",gridTemplateColumns:`90px 400px ${vw}px`});
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
                <Canvas size={size} />
            </div>
        </div>
    </>
}

export default SideBox