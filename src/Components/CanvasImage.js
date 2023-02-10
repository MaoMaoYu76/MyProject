import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import "../Components/CanvasImage.css";


const CanvasImage = (props) => {
  const [border, setBorder] = useState("0")
  const { onKeyDown } = props;
  const positionsRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState(positionsRef.current[props.id] || { x: 0, y: 0 })
  const [ImageWidth, setImageWidth] = useState()
  const [ImageHeight, setImageHeight] = useState()
  const [resizing, setResizing] = useState(false)
  const [selecting, setSelecting] = useState(false)



  useEffect(() => {
    const image = new Image();
    image.src = props.src;
    //先創一個圖象，然後丟進去看看寬高
    //我能不能直接讀取我的CanvasImage ？
    image.onload = () => {
      setImageWidth(image.width);
      setImageHeight(image.height);
    };

  }, [props.src]);

  useEffect(() => {
    document.addEventListener("pointerdown", handleSelect);
    console.log("監聽啟用");
    return () => {
      document.removeEventListener("pointerdown", handleSelect);
      console.log("監聽關閉");
    };
    //如果Image不存在就不要一直監聽下去，那我是不是應該上移，只保留一個監聽？
  }, []);


  const handleSelect = (event) => {
    console.log("選取目標", event.target.parentElement.children[0]
    );
    const resizeDots = Array.from(document.getElementsByClassName("resize-dot"));
    //getElementsByClassName沒辦法被檢查，因為他們是HTMLCollection，所以要換成真正的陣列
    console.log(resizeDots);
    if (event.target === document.getElementById(`${props.id}`)) {
      setSelecting(true)
      setBorder("5px")
    }else if(resizeDots.includes(event.target) && event.target.parentElement.children[0] === document.getElementById(`${props.id}`)){
      //如果陣列內包含事件目標
      console.log("選取點點");
      setSelecting(true)
      setBorder("5px")
    }
    else {
      setSelecting(false)
      setBorder("0px")
    }
  }

  const handleResizeFrame = () => {
    return {
      style: {
        width: ImageWidth,
        height: ImageHeight,
        border: `${border} solid pink`,
        position: "relative",
        position: "absolute",
        boxSizing: "content-box",
        zIndex: 1,
        left: position.x,
        top: position.y,
        margin: `-${border}`,
        userSelect: "none"
      }
    }
  }

  const handleResize = (event) => {
    setResizing(true)
    // document.removeEventListener("click", handleSelect)
    // event.preventDefault();
    const initialX = event.clientX;
    const initialY = event.clientY;

    let currentWidth = ImageWidth;
    let currentHeight = ImageHeight;

    const onMouseMove = (event) => {
      // if (!event.buttons) return;
      const deltaX = event.clientX - initialX;
      const deltaY = event.clientY - initialY;

      setImageWidth(currentWidth + deltaX);
      setImageHeight(currentHeight + deltaY);
    };

    document.addEventListener("pointermove", onMouseMove);

    document.addEventListener("pointerup", () => {
      document.removeEventListener("pointermove", onMouseMove);

      ondragstart = function () {
        return false;
      };

      setResizing(false)
    });

  }

  const handlePointerDown = (event) => {

    // console.log("位移目標", event.target);
    // console.log("resizing", resizing);
    if (event.target === document.getElementById(`${props.id}`)) {
      // console.log("圖片被點到了");
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
      };

      if (resizing === false) {
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);
      }
      ondragstart = function () {
        return false;
      };
    };
  }


  return <>
    <div tabIndex={0} onKeyDown={onKeyDown} >
      <div {...handleResizeFrame()} onPointerDown={handlePointerDown}>
        <img
          src={props.src}
          id={props.id}
          // corssorigin={anonymous}
          style={{
            position: 'absolute',
            zIndex: 0,
            cursor: 'move',
            zIndex: "1",
            width: "100%",
            height: "100%",
            // margin:`${border}`
            // clipPath: `inset(${border} )`,
          }}
          onPointerDown={handlePointerDown}
        />
        {selecting && <><div className="resize-dot" tabIndex={0} onPointerDown={handleResize}
          style={{
            right: "-8px",
            bottom: "-8px",
            cursor: "nwse-resize",
          }} />
          <div className="resize-dot" onPointerDown={handleResize}
            style={{
              right: "-8px",
              top: "-8px",
              cursor: "ne-resize",
            }} />
          <div className="resize-dot"
            style={{
              left: "-8px",
              bottom: "-8px",
              cursor: "ne-resize"
            }}></div>
          <div className="resize-dot"
            style={{
              left: "-8px",
              top: "-8px",
              cursor: "nwse-resize"
            }} /></>}
      </div>
    </div>
  </>
};

export default CanvasImage