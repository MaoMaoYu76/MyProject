import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import "../Styles/CanvasImage.css";
import Border from "./border";
import FrameTools from "./FrameTools";

const CanvasImage = (props) => {
  const dotSize = Border(props).dotSize;
  const border = Border(props).border;
  const showFrameTools = Border(props).showFrameTools;
  const { onKeyDown } = props;
  const positionsRef = useRef({ x: 0, y: 0 });
  const rest = props.rest;
  const defaluet = rest ? { x: rest.x, y: rest.y } : { x: 0, y: 0 };

  const [position, setPosition] = useState(
    positionsRef.current[props.id] || defaluet
  );

  const [ImageWidth, setImageWidth] = useState();
  const [ImageHeight, setImageHeight] = useState();
  const [resizing, setResizing] = useState(false);
  const [count, setCount] = useState(0);
  const rotationRef = useRef({});
  const [rotation, setRotation] = useState(rotationRef.current[props.id] || 0);

  //封裝資料
  useEffect(() => {
    const timer = setTimeout(() => {
      let imageData = {};
      imageData = {
        id: props.id,
        src: props.src,
        x: position.x,
        y: position.y,
        height: ImageHeight,
        width: ImageWidth,
        transform: `rotate(${rotation}deg)`,
      };
      props.imageData(imageData);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [count]);

  //讀取預設寬高
  useEffect(() => {
    if (rest) {
      setImageWidth(rest.width);
      setImageHeight(rest.height);
    } else {
      const image = new Image();
      image.src = props.src;
      //先創一個圖象，然後丟進去看看寬高
      image.onload = () => {
        setImageWidth(image.width);
        setImageHeight(image.height);
      };
    }
  }, [props.src, props.rest]);

  //控制大小縮放
  const handleResize = (event) => {
    setResizing(true);

    //cusor position
    const initialX = event.clientX;
    const initialY = event.clientY;

    const id = event.target.id;

    //image size
    let currentWidth = ImageWidth;
    let currentHeight = ImageHeight;

    const onMouseMove = (event) => {
      const deltaX = (event.clientX - initialX) / (props.scale * 0.01);
      const deltaY = (event.clientY - initialY) / (props.scale * 0.01);

      // 判斷位置
      if (id === "top-right") {
        setImageWidth(currentWidth + deltaX);
        setImageHeight(currentHeight - deltaY);

        positionsRef.current[props.id] = {
          ...positionsRef.current[props.id],
          y: position.y + deltaY,
        };
        setPosition(positionsRef.current[props.id]);
      } else if (id === "bottom-right") {
        setImageWidth(currentWidth + deltaX);
        setImageHeight(currentHeight + deltaY);
      } else if (id === "bottom-left") {
        setImageWidth(currentWidth - deltaX);
        setImageHeight(currentHeight + deltaY);

        positionsRef.current[props.id] = {
          ...positionsRef.current[props.id],
          x: position.x + deltaX,
        };
        setPosition(positionsRef.current[props.id]);
      } else if (id === "top-left") {
        setImageWidth(currentWidth - deltaX);
        setImageHeight(currentHeight - deltaY);

        positionsRef.current[props.id] = {
          x: position.x + deltaX,
          y: position.y + deltaY,
        };
        setPosition(positionsRef.current[props.id]);
      }
    };

    document.addEventListener("pointermove", onMouseMove);

    document.addEventListener("pointerup", () => {
      document.removeEventListener("pointermove", onMouseMove);

      setResizing(false);
      setCount(count + 1);
    });

    ondragstart = function () {
      return false;
    };
  };

  const handlePointerDown = (event) => {
    if (event.target === document.getElementById(`${props.id}`)) {
      const initialX = event.clientX;
      const initialY = event.clientY;
      const { x, y } = position;

      const handlePointerMove = (event) => {
        const newX = x + (event.clientX - initialX) / (props.scale * 0.01);
        const newY = y + (event.clientY - initialY) / (props.scale * 0.01);
        if (resizing === false) {
          positionsRef.current[props.id] = { x: newX, y: newY };
          setPosition(positionsRef.current[props.id]);
        }
      };

      const handlePointerUp = () => {
        document.removeEventListener("pointermove", handlePointerMove);
        setCount(count + 1);
      };

      if (resizing === false) {
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);
      }
      ondragstart = function () {
        return false;
      };
    }
  };

  const handleturn = () => {
    const target = document.getElementById(props.id).getBoundingClientRect();
    const centerX = target.x + target.width / 2;
    const centerY = target.y + target.height / 2;
    const handlePointerMove = (event) => {
      const angle =
        (Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180) /
        Math.PI;

      rotationRef.current[props.id] = angle - 90;
      setRotation(rotationRef.current[props.id]);
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      // setCount(count + 1);
    };
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <>
      <div
        tabIndex={0}
        style={{
          width: ImageWidth,
          height: ImageHeight,
          border: `${border} solid #ff719a`,
          position: "relative",
          position: "absolute",
          boxSizing: "content-box",
          zIndex: props.zIndex,
          left: position.x,
          top: position.y,
          margin: `-${border}`,
          userSelect: "none",
          transform: `rotate(${rotation}deg)`,
          overflow: "visible",
        }}
        onPointerDown={handlePointerDown}
        onKeyDown={onKeyDown}
      >
        <div>
          <img
            src={props.src}
            id={props.id}
            style={{
              position: "absolute",

              cursor: "move",
              width: "100%",
              height: "100%",
            }}
            onPointerDown={handlePointerDown}
          />
          {showFrameTools && (
            <>
              <FrameTools
                handleResize={handleResize}
                dotSize={dotSize}
                handleturn={handleturn}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CanvasImage;
