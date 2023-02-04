import React from "react";
// import Canvas from "../Components/Canvas";
import CanvasBar from "../Components/CanvasBar";
import "../Components/edit.css";
import EditZone from "../Components/EditZone";
import { useState } from "react";
// import { useContext } from "react";
import { createContext } from "react";

export const SizeData = createContext()

function EDIT() {
    const [size, setSize] = useState([14, 10.5,"cm",170]);
    // const [initialScale, setInitialScale] = useState(175);

    const handleSizeChange = (newSize) => {
        setSize(newSize);
        // setInitialScale(initialScale);
    };
    // console.log(onSizeChange)
    // console.log(size)

    return <>
        <SizeData.Provider value={size}>
            <CanvasBar onSizeChange={handleSizeChange} />
            <EditZone />
            {/* <EditZone size={size} initialScale={initialScale} /> */}
        </SizeData.Provider>
    </>
}

export default EDIT