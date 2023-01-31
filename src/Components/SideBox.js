import React from "react";
import "../Components/SideBox.css";
import { useState } from "react";
import Image from "../Components/Image";


const SideBox = () => {
    const [showBox, setShowBox] = useState(false);

    return <>
        <div className="sidebox">
            <div className="sidebar">
                <img src="/images/template.png" className="side-icon" onClick={() => setShowBox(!showBox)} />
                <div className="icontext">Template</div>
            </div>
            {showBox && <>
                <div className="side-container">
                    <Image src="/images/create.png" />
                </div>
            </>}
        </div>
    </>
}

export default SideBox