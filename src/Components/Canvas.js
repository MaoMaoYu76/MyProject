import React from "react";
import "../Components/Canvas.css";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { SizeData } from "../Pages/edit";
import { useLayoutEffect } from "react";
import { useRef } from "react";


const Canvas = (props) => {
  // const positionRef = useRef({ x: 0, y: 0 });
  const size = useContext(SizeData)
  // console.log("props",props);
  // console.log("size",size);
  const [initialWidth, initialHeight, unit, initialScale] = size;
  const [scale, setScale] = useState(initialScale)
  const [className, setClassName] = useState("canvas-container")
  const [height, setHeight] = useState(initialHeight)
  const [width, setWidth] = useState(initialWidth)
  const [border, setBorder] = useState("0")
  const [canvasImages, setCanvasImages] = useState([])
  // const positionRef = useRef({ x: 0, y: 0 });
  // const [id,setId] =useState()

  // console.log("canvasImages", canvasImages);

  const handleChange = (event) => {
    setScale(event.target.value)
  }

  useLayoutEffect(() => {
    if (props.newCanvasImage) {
      const newSrc = props.newCanvasImage
      const id = props.id
      setCanvasImages([...canvasImages, { id: id, src: newSrc }]);
    }
  }, [props.id]);

  //選擇畫布尺寸
  useEffect(() => {
    setScale(initialScale);
  }, [size]);

  //拉桿與畫布顯示尺寸
  useEffect(() => {
    setHeight(scale * 0.01 * initialHeight + unit)
    setWidth(scale * 0.01 * initialWidth + unit)

    const canvas = document.querySelector(".canvas");
    const container = document.querySelector(`.${className}`);

    if (canvas != null && container != null) {
      const canvasRect = canvas.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()


      if (canvasRect.x < containerRect.x || canvasRect.y < containerRect.y) {
        setClassName("canvas-container-overflow")
      } else {
        setClassName("canvas-container")
      }
    }

  }, [scale]);


  //偵測工具箱圖案落點用
  useEffect(() => {
    const container = document.querySelector(`.${className}`);
    if (container != null) {
      const containerRect = container.getBoundingClientRect()
      props.boundaries([containerRect.top, containerRect.bottom, containerRect.left, containerRect.right])
      // console.log("containerRect", containerRect);
    }
  }, [window.innerWidth, props.showBox]);




  const positionRef = useRef({ x: 0, y: 0 });
  //畫布上的元件製造
  const CanvasImage = (props) => {
    const [position, setPosition] = useState(positionRef.current)

    
   
    console.log("position", position);
    console.log("current", positionRef.current);
    // const canvasImgRef = useRef(null);
    useEffect(() => {
      setPosition(positionRef.current);
    }, []);

    const handlePointerDown = (event) => {
      // console.log("handlePointerDown", event);
      const initialX = event.clientX;
      const initialY = event.clientY;
      const { x, y } = position;
      // const { x, y } = positionRef.current;

      const handlePointerMove = (event) => {
        // console.log(event);
        const newX = x + event.clientX - initialX;
        const newY = y + event.clientY - initialY;
        // setPosition({ x: newX, y: newY });
        setPosition(positionRef.current);
        positionRef.current = { x: newX, y: newY };

        // console.log(newX, newY);

        

      };

      const handlePointerUp = () => {
        document.removeEventListener("pointermove", handlePointerMove);
      };

      document.addEventListener("pointermove", handlePointerMove);

      document.addEventListener("pointerup", handlePointerUp);

      ondragstart = function () {
        return false;
      };

    };


    // setImages([...Images,props.datasrc]);
    // const handlePicked = (e) => {
    //   // console.log(e);


    //   if (!e.target.matches('img')) {
    //     setBorder("0px")
    //   }else{setBorder("5px")}
    // }
    // document.addEventListener("click", handlePicked);

    return <><div onKeyDown={handleKeyDown} tabIndex={0}>
      <img
        src={props.src}
        id={props.id}
        // ref={canvasImgRef}
        style={{
          position: 'absolute',
          zIndex: 0,
          left: position.x,
          top: position.y,
          cursor: 'move',
          zIndex: "1",
          // border: `solid ${border} #FFA99F`
        }}
        onPointerDown={handlePointerDown}
      />
    </div>
    </>

  };


  const handleKeyDown = (event) => {

    if (event.key === "Backspace") {
      const id = event.target.children[0].getAttribute('id');
      // .getAttribute('src')
      // console.log('key',id);
      setCanvasImages(canvasImages.filter((Image) => Image.id !== id));
      // console.log("after",canvasImages);
    }
  };

  return <>
    <div className="editer-top editer"></div>
    <div className={className}>
      <div className="canvas"
        style={{
          width: width,
          height: height,
          backgroundColor: "#FFF",
          flexShrink: "0",
          position: "relative"
        }}>
        {canvasImages.map((Image, index) => <CanvasImage key={index} src={Image.src} id={Image.id} />)}
        {/* <CanvasImage src={props.datasrc}/> */}
      </div>
    </div>
    <div>
      <div className="editer-bottom editer"> <input className="transform-controller" onChange={handleChange} value={scale} type="range" min="10" max="500"></input></div>
    </div>
  </>

}

export default Canvas