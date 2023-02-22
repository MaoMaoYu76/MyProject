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
  // console.log("rest", { x: rest.x, y: rest.y });
  const [position, setPosition] = useState(
    positionsRef.current[props.id] || { x: rest.x, y: rest.y } || { x: 0, y: 0 }
  );

  const [ImageWidth, setImageWidth] = useState(rest.height);
  const [ImageHeight, setImageHeight] = useState(rest.width);
  const [resizing, setResizing] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [ImgData, setImgData] = useState({});

  //test
  const [count, setCount] = useState(0);

  useEffect(() => {
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

  useEffect(() => {
    document.addEventListener("pointerdown", handleSelect);
    // console.log("監聽啟用");
    return () => {
      document.removeEventListener("pointerdown", handleSelect);
      // console.log("監聽關閉");
    };
    //如果Image不存在就不要一直監聽下去，那我是不是應該上移，只保留一個監聽？
  }, []);

  const handleSelect = (event) => {
    // console.log("選取目標", event.target.parentElement.children[0]);
    const resizeDots = Array.from(
      document.getElementsByClassName("resize-dot")
    );
    //getElementsByClassName沒辦法被檢查，因為他們是HTMLCollection，所以要換成真正的陣列
    // console.log(resizeDots);
    if (event.target === document.getElementById(`${props.id}`)) {
      setSelecting(true);
      setBorder("5px");
    } else if (
      resizeDots.includes(event.target) &&
      event.target.parentElement.children[0] ===
        document.getElementById(`${props.id}`)
    ) {
      //如果陣列內包含事件目標
      setSelecting(true);
      setBorder("5px");
    } else {
      setSelecting(false);
      setBorder("0px");
    }
  };

  const handleResizeFrame = () => {
    // console.log("position", position);
    // console.log("Image", ImageWidth, ImageHeight);
    return {
      style: {
        width: ImageWidth,
        height: ImageHeight,
        border: `${border} solid #ff719a`,
        position: "relative",
        position: "absolute",
        boxSizing: "content-box",
        zIndex: 1,
        left: position.x,
        top: position.y,
        margin: `-${border}`,
        userSelect: "none",
      },
    };
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
      setCount(count + 1);
      props.count(count);
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
        props.count(count);
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

  return (
    <>
      <div tabIndex={0} onKeyDown={onKeyDown}>
        <div {...handleResizeFrame()} onPointerDown={handlePointerDown}>
          <img
            src={props.src}
            id={props.id}
            style={{
              position: "absolute",
              zIndex: 0,
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CanvasImage;
