import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import "../Styles/CanvasImage.css";
import { useLayoutEffect } from "react";

const CanvasImage = (props) => {
  const [border, setBorder] = useState("0");
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
  const [selecting, setSelecting] = useState(false);
  const [ImgData, setImgData] = useState({});
  const [count, setCount] = useState(0);

  //test
  const [zIndex, setzIndex] = useState(1);

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
      };
      props.imageData(imageData);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [count]);

  useEffect(() => {
    if (rest) {
      setImageWidth(rest.width);
      setImageHeight(rest.height);
    } else {
      const image = new Image();
      image.src = props.src;
      //先創一個圖象，然後丟進去看看寬高
      //我能不能直接讀取我的CanvasImage ？
      image.onload = () => {
        setImageWidth(image.width);
        setImageHeight(image.height);
      };
    }
  }, [props.src]);
  console.log();
  useEffect(() => {
    if (props.selected === props.id) {
      setSelecting(true);
      setBorder("3px");
    } else {
      setSelecting(false);
      setBorder("0px");
    }
  }, [props.selected, props.fontWeight]);

  //控制大小
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
      const deltaX = event.clientX - initialX;
      const deltaY = event.clientY - initialY;

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
    // console.log("event.target", event.target.id);
    // console.log("getElementById", document.getElementById(`${props.id}`));
    if (event.target === document.getElementById(`${props.id}`)) {
      // if (event.target.id === props.id) {
      // if(event.target)
      const initialX = event.clientX;
      const initialY = event.clientY;
      const { x, y } = position;

      const handlePointerMove = (event) => {
        const newX = x + event.clientX - initialX;
        const newY = y + event.clientY - initialY;
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

  const handleForward = () => {
    console.log("向前", zIndex, props.maxLayer);
    if (zIndex > 0 && zIndex < props.maxLayer) {
      setzIndex(zIndex + 1);
      console.log(zIndex);
    }
  };

  const handleBackward = () => {
    console.log("向後", zIndex, props.maxLayer);
    if (zIndex > 0 && zIndex < props.maxLayer) {
      setzIndex(zIndex - 1);
      console.log(zIndex);
    }
  };
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [rotation, setRotation] = useState(0);

  console.log("startX", startX, "rotation", rotation);
  const handleturn = (event) => {
    setStartX(event.clientX);
    setStartY(event.clientY);

    const handlePointerMove = (event) => {
      const diffX = startX - event.clientX;
      const diffY = startY - event.clientY;
      const angle = Math.atan2(diffY, diffX) * (180 / Math.PI);
      const newRotation = angle + 90;
      setRotation(newRotation);
      // const diffX = startX - (event.clientX - event.clientY) / 5;
      // const newRotation = rotation + diffX;
      // const limitedRotation = Math.max(Math.min(newRotation, 180), -180);
      // setRotation(limitedRotation);

      setStartX(event.clientX);
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
      <div tabIndex={0} onKeyDown={onKeyDown}>
        <div
          style={{
            width: ImageWidth,
            height: ImageHeight,
            border: `${border} solid #ff719a`,
            position: "relative",
            position: "absolute",
            boxSizing: "content-box",
            zIndex: zIndex,
            left: position.x,
            top: position.y,
            margin: `-${border}`,
            userSelect: "none",
            transform: `rotate(${rotation}deg)`,
          }}
          onPointerDown={handlePointerDown}
        >
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
          {selecting && (
            <>
              <div
                className="resize-dot"
                onPointerDown={handleResize}
                id="bottom-right"
                style={{
                  right: "-8px",
                  bottom: "-8px",
                  cursor: "nwse-resize",
                }}
              />
              <div
                className="resize-dot"
                onPointerDown={handleResize}
                id="top-right"
                style={{
                  right: "-8px",
                  top: "-8px",
                  cursor: "ne-resize",
                }}
              />
              <div
                className="resize-dot"
                onPointerDown={handleResize}
                id="bottom-left"
                style={{
                  left: "-8px",
                  bottom: "-8px",
                  cursor: "ne-resize",
                }}
              ></div>
              <div
                className="resize-dot"
                onPointerDown={handleResize}
                id="top-left"
                style={{
                  left: "-8px",
                  top: "-8px",
                  cursor: "nwse-resize",
                }}
              />
              <div className="config-detail">
                <img
                  className="tool"
                  src="/images/forward.png"
                  onClick={handleForward}
                />
                <img className="delete tool" src="/images/delete.png" />
                <img
                  className="tool"
                  src="/images/backward.png"
                  onClick={handleBackward}
                />
              </div>
              <img
                className="trun"
                onPointerDown={handleturn}
                src="/images/refresh.png"
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CanvasImage;
