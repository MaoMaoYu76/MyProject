import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import "../Styles/CanvasText.css";

const CanvasText = (props) => {
  const [ImageWidth, setImageWidth] = useState(300);
  const [ImageHeight, setImageHeight] = useState(40);
  const [border, setBorder] = useState("0");
  const { onKeyDown } = props;
  const positionsRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState(
    positionsRef.current[props.id] || { x: 0, y: 0 }
  );
  const [resizing, setResizing] = useState(false);
  //   const [moving, setMoving] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const selectingRef = useRef(selecting);
  const movingRef = useRef(false);
  const [newText, setNewText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [textAlign, setTextAlign] = useState("center");
  const [cursor, setCursor] = useState("pointer");

  useEffect(() => {
    document.addEventListener("pointerdown", handleSelect);
    return () => {
      document.removeEventListener("pointerdown", handleSelect);
    };
  }, []);

  useEffect(() => {
    if (selecting) {
      props.handleTextTool(true);
    }
  }, [selecting]);

  const handleSelect = (event) => {
    console.log("handleSelect", event.target);

    if (!selectingRef.current || movingRef.current) {
      event.preventDefault();
    }
    // event.preventDefault();
    const resizeDots = Array.from(
      document.getElementsByClassName("resize-dot")
    );
    //getElementsByClassName沒辦法被檢查，因為他們是HTMLCollection，所以要換成真正的陣列
    if (event.target === document.getElementById(`${props.id}`)) {
      setSelecting(true);
      selectingRef.current = true;
      setBorder("5px");
      setCursor("text");
    } else if (
      resizeDots.includes(event.target) &&
      //inputID
      event.target.parentElement.children[0] ===
        document.getElementById(`${props.id}`)
    ) {
      //如果陣列內包含事件目標
      setSelecting(true);
      selectingRef.current = true;
      setBorder("3px");
      setCursor("text");
    } else if (
      event.target === document.getElementsByClassName("config-button")[0]
    ) {
      setSelecting(true);
      selectingRef.current = true;
      setBorder("3px");
      setCursor("text");
    } else {
      setSelecting(false);
      selectingRef.current = false;
      setBorder("0px");
      setCursor("pointer");
    }
  };

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
    if (event.target === document.getElementById(`${props.id}`)) {
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
    event.target.select();
  };

  return (
    <>
      <div tabIndex={0} onKeyDown={onKeyDown}>
        <div
          className="text-container"
          style={{
            width: ImageWidth,
            height: ImageHeight,
            border: `${border} solid #ff719a`,
            zIndex: 1,
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
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder="輸入文字"
            style={{
              zIndex: 0,
              textAlign: textAlign,
              fontSize: ImageHeight * 0.63,
              fontWeight: props.fontWeight,
              cursor: cursor,
            }}
          ></input>
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CanvasText;
