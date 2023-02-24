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
  const [InFocus, setInFocus] = useState(false);
  const selectingRef = useRef(selecting);
  const movingRef = useRef(false);
  const [newText, setNewText] = useState("");
  const [fontSize, setFontSize] = useState(25);
  const [textAlign, setTextAlign] = useState("center");
  const [cursor, setCursor] = useState("pointer");
  const [fontWeight, setFontWeight] = useState(500);
  //   const [pointerEvent, setPointerEvent] = useState("none");

  //   useEffect(() => {
  //     document.addEventListener("pointerdown", handleSelect);
  //     return () => {
  //       document.removeEventListener("pointerdown", handleSelect);
  //     };
  //   }, []);

  useEffect(() => {
    if (selecting) {
      props.handleTextTool(props.id, true);
    }
  }, [selecting]);

  useEffect(() => {
    if (props.fontSize != ImageHeight * 0.63) {
      setFontSize(props.fontSize);
    } else {
      setFontSize(ImageHeight * 0.63);
    }
  }, [props.fontSize]);

  useEffect(() => {
    setFontSize(ImageHeight * 0.63);
    props.handleFontSize(props.id, fontSize);
  }, [ImageHeight]);

  useEffect(() => {
    if (props.selected === props.id) {
      setSelecting(true);
      setBorder("3px");
      if (props.fontWeight === true) {
        console.log("truetrue");
        setFontWeight(900);
      } else {
        setFontWeight(500);
      }
    } else {
      setSelecting(false);
      selectingRef.current = false;
      setBorder("0px");
      setCursor("pointer");
      setInFocus(false);
      props.handleInFocus(false);
    }
  }, [props.selected, props.fontWeight]);

  const lastTargetRef = useRef(null);
  //   const [lastTarget, setLastTarget] = useState(lastTargetRef.current);
  //   console.log("222222222222222222", props.selected);

  //   const handleSelect = (event) => {
  //     // console.log("handleSelect", document.getElementById(props.id));
  //     // const configs = document.querySelectorAll(".config");
  //     // setLastTarget(lastTargetRef.current);
  //     // console.log(lastTarget);
  //     const resizeDots = Array.from(
  //       document.getElementsByClassName("resize-dot")
  //     );

  //     if (event.target === document.getElementById(props.id)) {
  //       console.log("wongwong");
  //       //   lastTargetRef.current = event.target;

  //       setSelecting(true);
  //       setBorder("3px");
  //       setCursor("text");
  //     } else if (
  //       resizeDots.includes(event.target) &&
  //       event.target.parentElement.children[0] ===
  //         document.getElementById(props.id)
  //       //       ) ||
  //       //   (event.target === document.querySelectorAll(".font-size")[0] &&
  //       //     lastTargetRef.current === document.getElementById(props.id)) ||
  //       //   (event.target === document.querySelectorAll(".config")[4] &&
  //       //     lastTargetRef.current === document.getElementById(props.id))
  //     ) {
  //       console.log("1111111111111");
  //       setSelecting(true);
  //       setBorder("3px");
  //       setCursor("text");
  //     } else if (
  //       event.target === document.querySelectorAll(".font-size")[0] &&
  //       props.selected === props.id
  //     ) {
  //       console.log("2222222222222");
  //       console.log("lastTargetRef", lastTargetRef.current);
  //       setSelecting(true);
  //       setBorder("3px");
  //       setCursor("text");
  //     } else if (
  //       event.target === document.querySelectorAll(".config")[4] &&
  //       props.selected === props.id
  //     ) {
  //       console.log("3333333333333333");
  //       console.log("lastTargetRef", props.id, lastTargetRef.current);
  //       setSelecting(true);
  //       setBorder("3px");
  //       setCursor("text");
  //     } else {
  //       setSelecting(false);
  //       selectingRef.current = false;
  //       setBorder("0px");
  //       setCursor("pointer");
  //       setInFocus(false);
  //       props.handleInFocus(false);
  //     }
  //   };

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
    if (!selectingRef.current || movingRef.current) {
      document.getElementById(`${props.id}`).blur();
    } else {
      event.target.select();
      setInFocus(true);
      props.handleInFocus(true);
    }
    selectingRef.current = true;
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
            value="請輸入你的文字"
            style={{
              zIndex: 0,
              textAlign: textAlign,
              fontSize: fontSize,
              fontWeight: fontWeight,
              cursor: cursor,
              //   border: `${border} solid #ff719a`,
              //   height: ImageHeight,
              //   width: ImageWidth,
              //   left: position.x,
              //   top: position.y,
              //   margin: `-${border}`,
              //   pointerEvent: pointerEvent,
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
