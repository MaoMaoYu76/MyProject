import React from "react";
import LogoBar from "../Components/LogoBar";
import "../Styles/edit.css";
import EditZone from "../Components/EditZone";
import { useState } from "react";
import { createContext } from "react";

export const SizeData = createContext()
export const CurrentUser = createContext()

function EDIT() {
    const [size, setSize] = useState([529.1, 396.8, 130]);
    const [currentUser, setCurrentUser] = useState();

    const handleSizeChange = (newSize) => {
        setSize(newSize);
    };

    const checkCurrentUser = (currentUser) => {
        setCurrentUser(currentUser);
    }

    return <>
        <SizeData.Provider value={size} >
            <CurrentUser.Provider value={currentUser}>
                <LogoBar onSizeChange={handleSizeChange} currentUser={checkCurrentUser} />
                <EditZone />
            </CurrentUser.Provider>
        </SizeData.Provider>
    </>
}

export default EDIT