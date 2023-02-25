import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import "../Styles/CanvasText.css";
import { useLayoutEffect } from "react";

const CanvasText = (props) => {
  const { onKeyDown } = props;
  const [ImageWidth, setImageWidth] = useState(300);
  const [ImageHeight, setImageHeight] = useState(40);
  const [border, setBorder] = useState("0");
  const positionsRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState(
    positionsRef.current[props.id] || { x: 0, y: 0 }
  );
  const [resizing, setResizing] = useState(false);
  const [selecting, setSelecting] = useState(false);
  //避免選取中位移
  const [InFocus, setInFocus] = useState(false);
  const firstpickRef = useRef(false);
  const movingRef = useRef(false);
  const [newText, setNewText] = useState("請輸入你的文字");
  const [fontSize, setFontSize] = useState(25);
  const [textAlign, setTextAlign] = useState("center");
  const [cursor, setCursor] = useState("pointer");
  const [fontWeight, setFontWeight] = useState(500);

  //test
  const [zIndex, setzIndex] = useState(3);

  useEffect(() => {
    if (selecting) {
      props.handleTextTool(props.id, true);
    }
  }, [selecting]);

  useEffect(() => {
    // console.log("props", props.fontSize, "fontSize", fontSize);
    if (props.fontSize) {
      setFontSize(props.fontSize);
      setImageHeight(Math.floor(props.fontSize / 0.63));
    }
  }, [props.fontSize]);

  useEffect(() => {
    setFontSize(ImageHeight * 0.63);
    props.handleFontSize(props.id, fontSize);
  }, [ImageHeight]);

  useEffect(() => {
    if (props.selected === props.id && props.cancel === false) {
      setSelecting(true);
      setBorder("3px");
      if (props.fontWeight === true) {
        setFontWeight(900);
      } else {
        setFontWeight(500);
      }
    } else {
      setSelecting(false);
      setBorder("0px");
      setCursor("default");
      setInFocus(false);
      props.handleInFocus(false);
      firstpickRef.current = false;
    }
  }, [props.selected, props.fontWeight, props.cancel]);

  const lastTargetRef = useRef(null);

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
      //   setCount(count + 1);
    });

    ondragstart = function () {
      return false;
    };
  };

  const handlePointerDown = (event) => {
    if (event.target === document.getElementById(`${props.id}`) && !InFocus) {
      // if(event.target)
      const initialX = event.clientX;
      const initialY = event.clientY;
      const { x, y } = position;

      const handlePointerMove = (event) => {
        movingRef.current = true;
        const newX = x + event.clientX - initialX;
        const newY = y + event.clientY - initialY;
        if (resizing === false) {
          positionsRef.current[props.id] = { x: newX, y: newY };
          setPosition(positionsRef.current[props.id]);
        }
      };

      const handlePointerUp = () => {
        document.removeEventListener("pointermove", handlePointerMove);
        movingRef.current = false;
        // setCount(count + 1);
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

  const handleFocus = (event) => {
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

  const handleForward = () => {
    if (0 < zIndex < props.maxLayer) {
      setzIndex(zIndex + 1);
    }
  };

  const handleBackward = () => {
    if (0 < zIndex < props.maxLayer) {
      setzIndex(zIndex - 1);
      console.log(zIndex);
    }
  };
  // console.log(zIndex, props.maxLayer);

  return (
    <>
      <div tabIndex={0} onKeyDown={onKeyDown(props.id)}>
        <div
          className="text-container"
          style={{
            width: ImageWidth,
            height: ImageHeight,
            border: `${border} solid #ff719a`,
            zIndex: zIndex,
            left: position.x,
            top: position.y,
            margin: `-${border}`,
          }}
          onPointerDown={handlePointerDown}
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
            }}
          ></input>
          {selecting && (
            <div>
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
              <img className="trun" src="/images/refresh.png" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CanvasText;
