import React, { useState } from "react";
import "../Styles/SideImages.css";
import { db } from "../firebase";
import { getDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { doc } from "firebase/firestore";

const Template = (props) => {
  const src = props.src;

  const docRef = doc(collection(db, "public"), props.id);
  const handleclick = () => {
    const canvasData = {};
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        canvasData[doc.id] = { ...doc.data() };
        props.handleCanvasData({ [doc.id]: canvasData[doc.id] });
        // console.log({ [doc.id]: canvasData[doc.id] });
      }
    });
  };

  return (
    <div className="grid-item">
      <img
        className="box-template"
        draggable="false"
        src={src}
        id={props.id}
        style={{}}
        onClick={handleclick}
      />
    </div>
  );
};

export default Template;
