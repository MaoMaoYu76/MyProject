import { CurrentUser } from "../Pages/edit";
import { useState } from "react";
import React from "react";
import { db } from "../firebase";
import { getDocs } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { useContext } from "react";
import "../Styles/AuthProject.css";
import { useEffect } from "react";
import { updateDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { ref } from "firebase/storage";
import { storage } from "../firebase";
import { deleteObject } from "firebase/storage";

const AuthProject = (props) => {
  const currentUser = useContext(CurrentUser);
  const [type, setType] = useState();
  const [projectName, setProjectName] = useState();
  const [canvasData, setCanvasData] = useState();
  const [showDelete, setShowDelete] = useState(false);
  const [showSetting, setShowSetting] = useState(true);
  const [inputDisplay, setInputDisplay] = useState("none");
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setCanvasData();
    const canvasData = {};
    getDocs(collection(db, `${currentUser.uid}`)).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id === props.id) {
          canvasData[doc.id] = { ...doc.data() };
          setType(canvasData[doc.id].height > 2000 ? "直立式海報" : "橫向卡片");
          setProjectName(
            canvasData[doc.id].name != "" ? canvasData[doc.id].name : "我的專案"
          );
          setCanvasData((prevData) => ({
            ...prevData,
            [doc.id]: canvasData[doc.id],
          }));
        }
      });
    });
  }, [clickCount]);

  const handleclick = () => {
    setCanvasData();
    const canvasData = {};
    getDocs(collection(db, `${currentUser.uid}`)).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id === props.id) {
          canvasData[doc.id] = { ...doc.data() };
          setProjectName(
            canvasData[doc.id].name != "" ? canvasData[doc.id].name : "我的專案"
          );
          setCanvasData((prevData) => ({
            ...prevData,
            [doc.id]: canvasData[doc.id],
          }));
          props.handleCanvasData({ [doc.id]: canvasData[doc.id] });
        }
      });
    });
  };

  return (
    <div
      className="single-project"
      onMouseOver={() => setShowDelete(true)}
      onMouseOut={() => setShowDelete(false)}
      // onClick={() => {
      //   // setClickCount((count) => count + 1);
      //   // console.log(canvasData);
      //   // props.handleCanvasData(canvasData);
      // }}
      onClick={handleclick}
    >
      <div className="more-container">
        {showDelete && (
          <>
            <img
              className="more"
              src="images/delete-w.png"
              onClick={(e) => {
                e.stopPropagation();
                deleteDoc(doc(db, `${currentUser.uid}`, props.id));
                const storageRef = ref(
                  storage,
                  `${currentUser.uid}/Snapshot/${props.id}.jpg`
                );
                deleteObject(storageRef).then(() => {
                  console.log("照片已刪除");
                });
                props.check(props.id);
              }}
            />
          </>
        )}
      </div>
      <div className="preview">
        <img className="previewimg" src={props.src} />
      </div>
      <div
        className="name-container"
        onClick={() => {
          setShowSetting(false);
          setInputDisplay("block");
        }}
      >
        {showSetting && (
          <>
            <div className="project-name">{projectName}</div>
            <img className="edit" src="images/edit.png" />
          </>
        )}
        <input
          style={{
            display: inputDisplay,
          }}
          className="name-input"
          value={projectName}
          onChange={(e) => {
            setProjectName(e.target.value);
          }}
          onFocus={(e) => e.target.select()}
          onBlur={() => {
            setShowSetting(true);
            setInputDisplay("none");
            updateDoc(doc(db, `${currentUser.uid}`, props.id), {
              name: projectName,
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.target.blur();
            }
          }}
        ></input>
      </div>
      <div className="project-type">{type}</div>
    </div>
  );
};

export default AuthProject;
