import React, { useState } from "react";
import { useRef } from "react";
import { ref } from "firebase/storage";
import { storage } from "../firebase";
import { deleteObject } from "firebase/storage";
import { useContext } from "react";
import { CurrentUser } from "../Pages/edit";

const UploadImage = (props) => {
  const [toolPosition, setToolPosition] = useState({ x: 0, y: 0 });
  const [top, bottom, left, right] = props.boundaries;
  const [opacity, setOpacity] = useState(1);
  const [zIndex, setzIndex] = useState(1);
  const src = props.src;
  const imgRef = useRef(null);
  const [showDelete, setShowDelete] = useState(true);
  const currentUser = useContext(CurrentUser);

  const handleToolDown = (event) => {
    setzIndex(2);
    setOpacity(0.6);
    // console.log("打開監聽");
    const initialX = event.clientX;
    const initialY = event.clientY;
    const { x, y } = toolPosition;

    const handleToolMove = (event) => {
      const newX = x + event.clientX - initialX;
      const newY = y + event.clientY - initialY;
      setToolPosition({ x: newX, y: newY });
    };

    //控制左鍵放開事件
    const handleToolUp = (e) => {
      setzIndex(0);
      setOpacity(1);
      if (e.target.getAttribute("id") === imgRef.current.getAttribute("id")) {
        if (
          left < e.clientX &&
          e.clientX < right &&
          top < e.clientY &&
          e.clientY < bottom
        ) {
          // console.log("偵測複製");
          props.oncopystate(src);
          setToolPosition({ x: 0, y: 0 });
        } else {
          // console.log("重置");
          setToolPosition({ x: 0, y: 0 });
        }
        document.removeEventListener("pointermove", handleToolMove);
        document.removeEventListener("pointerup", handleToolUp);
      }
    };

    document.addEventListener("pointermove", handleToolMove);

    document.addEventListener("pointerup", handleToolUp);

    ondragstart = function () {
      return false;
    };
  };
  //   console.log("props.index", props.index);
  return (
    <div
      className="grid-item"
      onMouseOver={() => setShowDelete(false)}
      onMouseOut={() => setShowDelete(true)}
    >
      <img
        className="upload-images"
        src={src}
        id={props.id}
        ref={imgRef}
        style={{
          zIndex: zIndex,
          left: toolPosition.x,
          top: toolPosition.y,
          opacity: opacity,
        }}
        onPointerDown={handleToolDown}
      />
      {showDelete && (
        <img
          className="delete"
          src="images/delete-w.png"
          onClick={() => {
            const storageRef = ref(
              storage,
              `${currentUser.uid}/Upload/${props.id}.jpg`
            );
            deleteObject(storageRef).then(() => {
              console.log("照片已刪除");
              props.reset(props.id);
            });
          }}
        />
      )}
    </div>
  );
};

export default UploadImage;
