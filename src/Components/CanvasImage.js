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

  const [FrameWidth, setFrameWidth] = useState();
  const [FrameHeight, setFrameHeight] = useState();
  const [ImageWidth, setImageWidth] = useState();
  const [ImageHeight, setImageHeight] = useState();
  const [angle, setAngle] = useState(0);
  const [resizing, setResizing] = useState(false);
  const [count, setCount] = useState(0);
  const rotationRef = useRef({});
  const [rotation, setRotation] = useState(rotationRef.current[props.id] || 0);

  useEffect(() => {
    if (rotation === 0) {
      setImageWidth(FrameWidth);
      setImageHeight(FrameHeight);
    } else {
    }
  }, [rotation, FrameWidth, FrameHeight]);

  //封裝資料
  useEffect(() => {
    const timer = setTimeout(() => {
      let imageData = {};
      imageData = {
        id: props.id,
        src: props.src,
        x: position.x,
        y: position.y,
        height: FrameHeight,
        width: FrameWidth,
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
      setFrameWidth(rest.width);
      setFrameHeight(rest.height);
    } else {
      const image = new Image();
      image.src = props.src;
      //先創一個圖象，然後丟進去看看寬高
      image.onload = () => {
        setFrameWidth(image.width);
        setFrameHeight(image.height);
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

    let currentWidth = FrameWidth;
    let currentHeight = FrameHeight;
    const onMouseMove = (event) => {
      const angle = ((rotation - 180) * Math.PI) / 180;
      // console.log("resize", angle);

      const deltaX = (event.clientX - initialX) / (props.scale * 0.01);
      const deltaY = (event.clientY - initialY) / (props.scale * 0.01);
      // console.log("deltaY", deltaY, "deltaX", deltaX);
      // const newX = deltaX / Math.cos(angle);
      // const newY = deltaY / Math.cos(angle);
      // console.log("newX", newX, "newY", newY);

      // 判斷位置
      if (id === "top-right") {
        // console.log(rotation);

        setFrameWidth(currentWidth + deltaX);
        setFrameHeight(currentHeight - deltaY);

        positionsRef.current[props.id] = {
          ...positionsRef.current[props.id],
          x: position.x,
          y: position.y + deltaY,
        };

        setPosition(positionsRef.current[props.id]);
      } else if (id === "bottom-right") {
        if (
          (rotation >= 67.5 && rotation < 112.5) ||
          (rotation >= 247.5 && rotation < 292.5)
        ) {
          setImageWidth(ImageWidth + deltaY);
          setImageHeight(ImageHeight + deltaX);
          setFrameWidth(currentWidth + deltaX);
          setFrameHeight(currentHeight + deltaY);
        } else if (
          (rotation >= 112.5 && rotation < 157.5) ||
          (rotation >= 292.5 && rotation < 337.5)
        ) {
          setImageWidth(ImageWidth + deltaX);
          setImageHeight(ImageHeight + deltaY);

          setFrameHeight(
            Math.abs((ImageHeight + deltaY) * Math.cos(angle)) +
              Math.abs((ImageWidth + deltaX) * Math.sin(angle))
          );
          setFrameWidth(
            Math.abs((ImageHeight + deltaY) * Math.sin(angle)) +
              Math.abs((ImageWidth + deltaX) * Math.cos(angle))
          );
        } else if (
          (rotation >= 202.5 && rotation < 247.5) ||
          (rotation >= 22.5 && rotation < 67.5)
        ) {
          setImageWidth(ImageWidth + deltaY);
          setImageHeight(ImageHeight + deltaX);

          setFrameHeight(
            Math.abs((ImageHeight + deltaX) * Math.cos(angle)) +
              Math.abs((ImageWidth + deltaY) * Math.sin(angle))
          );
          setFrameWidth(
            Math.abs((ImageHeight + deltaX) * Math.sin(angle)) +
              Math.abs((ImageWidth + deltaY) * Math.cos(angle))
          );
        } else {
          setImageWidth(ImageWidth + deltaX);
          setImageHeight(ImageHeight + deltaY);
          setFrameWidth(currentWidth + deltaX);
          setFrameHeight(currentHeight + deltaY);
        }
      } else if (id === "bottom-left") {
        setFrameWidth(currentWidth - deltaX);
        setFrameHeight(currentHeight + deltaY);

        positionsRef.current[props.id] = {
          ...positionsRef.current[props.id],
          x: position.x + deltaX,
          y: position.y,
        };
        setPosition(positionsRef.current[props.id]);
      } else if (id === "top-left") {
        setFrameWidth(currentWidth - deltaX);
        setFrameHeight(currentHeight - deltaY);

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
      const angle = Math.atan2(
        event.clientX - centerX,
        centerY - event.clientY
      );
      // console.log("turn", angle);
      rotationRef.current[props.id] = (angle * 180) / Math.PI + 180;
      setRotation(rotationRef.current[props.id]);

      setFrameHeight(
        Math.abs(ImageHeight * Math.cos(angle)) +
          Math.abs(ImageWidth * Math.sin(angle))
      );
      setFrameWidth(
        Math.abs(ImageHeight * Math.sin(angle)) +
          Math.abs(ImageWidth * Math.cos(angle))
      );
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      // setCount(count + 1);
    };
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };
  // console.log(rotation);

  return (
    <>
      <div
        tabIndex={0}
        style={{
          width: FrameWidth,
          height: FrameHeight,
          border: `${border} solid #ff719a`,
          position: "relative",
          position: "absolute",
          boxSizing: "content-box",
          zIndex: props.zIndex,
          left: position.x,
          top: position.y,
          margin: `-${border}`,
          userSelect: "none",
          // transform: `rotate(${rotation}deg)`,
          overflow: "visible",
        }}
        onPointerDown={handlePointerDown}
        onKeyDown={onKeyDown}
      >
        <div
          className="canvas-image-container"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <img
            src={props.src}
            id={props.id}
            className="canvas-image"
            onPointerDown={handlePointerDown}
            style={{
              width: ImageWidth,
              height: ImageHeight,
            }}
          />
          {showFrameTools && (
            <img
              className="turn"
              onPointerDown={handleturn}
              src="/images/refresh.png"
            />
          )}
        </div>
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
    </>
  );
};

export default CanvasImage;
