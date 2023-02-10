import React from "react";
import CanvasBar from "../Components/CanvasBar";
import "../Components/edit.css";
import EditZone from "../Components/EditZone";
import { useState } from "react";
import { createContext } from "react";

export const SizeData = createContext()

function EDIT() {
    const [size, setSize] = useState([529.1, 396.8, 130]);

    const handleSizeChange = (newSize) => {
        setSize(newSize);
    };

    return <>
        <SizeData.Provider value={size}>
            <CanvasBar onSizeChange={handleSizeChange} />
            <EditZone />
        </SizeData.Provider>
    </>
}

export default EDIT