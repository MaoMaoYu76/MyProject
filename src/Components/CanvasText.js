import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import "../Styles/CanvasElements.css";
import Border from "./border";
import FrameTools from "./FrameTools";

const CanvasText = (props) => {
  const dotSize = Border(props).dotSize;
  const border = Border(props).border;
  const showFrameTools = Border(props).showFrameTools;
  const { onKeyDown } = props;
  const [ImageWidth, setImageWidth] = useState(300);
  const [ImageHeight, setImageHeight] = useState(40);

  const positionsRef = useRef({ x: 0, y: 0 });
  const rest = props.rest;
  const defaluet = rest ? { x: rest.x, y: rest.y } : { x: 0, y: 0 };

  const [position, setPosition] = useState(
    positionsRef.current[props.id] || defaluet
  );

  const [resizing, setResizing] = useState(false);
  //避免選取中位移
  const [InFocus, setInFocus] = useState(false);
  const firstpickRef = useRef(false);
  const movingRef = useRef(false);
  const [newText, setNewText] = useState("Please enter text");
  const [fontSize, setFontSize] = useState(25);
  const [turnsize, setTurnsize] = useState(25);
  const [textAlign, setTextAlign] = useState("center");
  const [cursor, setCursor] = useState("pointer");
  const [fontWeight, setFontWeight] = useState(500);
  const rotationRef = useRef({});
  const [rotation, setRotation] = useState(rotationRef.current[props.id] || 0);

  //封裝資料
  useEffect(() => {
    let textData = {};
    textData = {
      id: props.id,
      x: position.x,
      y: position.y,
      hight: ImageHeight,
      width: ImageWidth,
      fontSize: fontSize,
      fontWeight: fontWeight,
      rotation: rotation,
      color: props.color,
      fontFamily: props.fontFamily,
      backgroundColor: props.backgroundColor,
      value: newText,
      zIndex: props.zIndex,
    };
    props.textData(textData);
  }, [
    props.id,
    position,
    ImageHeight,
    ImageWidth,
    fontSize,
    fontWeight,
    rotation,
    props.color,
    props.fontFamily,
    props.backgroundColor,
    newText,
    props.zIndex,
  ]);

  useEffect(() => {
    if (props.fontSize) {
      setFontSize(props.fontSize);
      setImageHeight(Math.floor(props.fontSize / 0.63));
    }
  }, [props.fontSize]);

  useEffect(() => {
    setFontSize(Math.round(ImageHeight * 0.63));
    props.handleFontSize(props.id, fontSize);
  }, [ImageHeight]);

  useEffect(() => {
    if (props.selected === props.id && props.cancel === false) {
      if (props.scale < 40) {
        setTurnsize(60);
      } else if (props.scale < 60) {
        setTurnsize(40);
      } else if (props.scale > 200) {
        setTurnsize(20);
      } else if (props.scale > 60 && props.scale < 200) {
        setTurnsize(25);
      }
      if (props.fontWeight === true) {
        setFontWeight(900);
      } else {
        setFontWeight(500);
      }
    } else {
      setCursor("default");
      setInFocus(false);
      props.handleInFocus(false);
      firstpickRef.current = false;
    }
  }, [props.selected, props.fontWeight, props.cancel]);

  useEffect(() => {
    if (rest) {
      setImageHeight(rest.hight);
      setImageWidth(rest.width);
      setRotation(rest.rotation);
      setNewText(rest.value);
    }
  }, [props.rest]);

  //控制大小拖曳
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
    });

    ondragstart = function () {
      return false;
    };
  };

  //控制位移
  const handlePointerDown = (event) => {
    if (event.target === document.getElementById(`${props.id}`) && !InFocus) {
      // if(event.target)
      const initialX = event.clientX;
      const initialY = event.clientY;
      const { x, y } = position;

      const handlePointerMove = (event) => {
        movingRef.current = true;
        const newX = x + (event.clientX - initialX) / (props.scale * 0.01);
        const newY = y + (event.clientY - initialY) / (props.scale * 0.01);
        if (resizing === false) {
          positionsRef.current[props.id] = { x: newX, y: newY };
          setPosition(positionsRef.current[props.id]);
        }
      };

      const handlePointerUp = () => {
        document.removeEventListener("pointermove", handlePointerMove);
        movingRef.current = false;
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

  const handleChange = (event) => {
    setNewText(event.target.value);
  };

  const handleFocus = () => {
    firstpickRef.current = !firstpickRef.current;
    if (firstpickRef.current || movingRef.current) {
      document.getElementById(`${props.id}`).blur();
    }
  };

  const handlePointerUp = (event) => {
    if (!firstpickRef.current) {
      setCursor("text");
      setInFocus(true);
      props.handleInFocus(true);
      event.target.select();
    }
  };

  //控制元素旋轉
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
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
    };
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <>
      <div tabIndex={0} onKeyDown={onKeyDown(props.id)}>
        <div
          className="text-container"
          style={{
            width: ImageWidth,
            height: ImageHeight,
            border: `${border} solid #ff719a`,
            zIndex: props.zIndex,
            left: position.x,
            top: position.y,
            margin: `-${border}`,
          }}
          onPointerDown={handlePointerDown}
        >
          <div
            className="image-container"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          >
            <input
              id={props.id}
              className="canvas-input"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onChange={handleChange}
              onFocus={handleFocus}
              value={newText}
              style={{
                textAlign: textAlign,
                fontSize: fontSize,
                fontWeight: fontWeight,
                cursor: cursor,
                color: props.color,
                fontFamily: props.fontFamily,
                backgroundColor: props.backgroundColor,
              }}
            ></input>
            {showFrameTools && (
              <img
                className="turn"
                onPointerDown={handleturn}
                src="/images/refresh.png"
                style={{
                  width: turnsize,
                  bottom: `-${ImageHeight * 2}px`,
                }}
              />
            )}
          </div>
          {showFrameTools && (
            <>
              <FrameTools
                handleResize={handleResize}
                dotSize={dotSize}
                // handleturn={handleturn}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CanvasText;
