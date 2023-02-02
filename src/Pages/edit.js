import React from "react";
// import Canvas from "../Components/Canvas";
import CanvasBar from "../Components/CanvasBar";
import "../Components/edit.css";
import SideBox from "../Components/SideBox";
import { useState } from "react";

function EDIT() {
    const [size, setSize] = useState(["14cm", "10.5cm"]);

    const handleSizeChange = (newSize) => {
        setSize(newSize);
    };
    // console.log(onSizeChange)

    return <>
            <CanvasBar onSizeChange={handleSizeChange} />
        <div className="canvas-body">
            <SideBox size={size} />
        </div>
    </>
}

export default EDIT