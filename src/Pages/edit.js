import React from "react";
import LogoBar from "../Components/LogoBar";
import "../Styles/edit.css";
import EditZone from "../Components/EditZone";
import { useState } from "react";
import { createContext } from "react";

export const SizeData = createContext();
export const CurrentUser = createContext();

function EDIT() {
  // console.log("EDIT");
  const [currentUser, setCurrentUser] = useState();

  const checkCurrentUser = (currentUser) => {
    setCurrentUser(currentUser);
  };

  return (
    <>
      <CurrentUser.Provider value={currentUser}>
        <LogoBar currentUser={checkCurrentUser} />
        <EditZone />
      </CurrentUser.Provider>
    </>
  );
}

export default EDIT;
