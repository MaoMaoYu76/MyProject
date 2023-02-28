import React from "react";

const FrameTools = (props) => {
  const dotSize = props.dotSize;
  const { handleResize } = props;
  const { handleturn } = props;

  return (
    <>
      <div
        className="resize-dot"
        onPointerDown={handleResize}
        id="bottom-right"
        style={{
          right: `-${dotSize / 2}px`,
          bottom: `-${dotSize / 2}px`,
          cursor: "nwse-resize",
          width: dotSize,
          height: dotSize,
        }}
      />
      <div
        className="resize-dot"
        onPointerDown={handleResize}
        id="top-right"
        style={{
          right: `-${dotSize / 2}px`,
          top: `-${dotSize / 2}px`,
          cursor: "ne-resize",
          width: dotSize,
          height: dotSize,
        }}
      />
      <div
        className="resize-dot"
        onPointerDown={handleResize}
        id="bottom-left"
        style={{
          left: `-${dotSize / 2}px`,
          bottom: `-${dotSize / 2}px`,
          cursor: "ne-resize",
          width: dotSize,
          height: dotSize,
        }}
      ></div>
      <div
        className="resize-dot"
        onPointerDown={handleResize}
        id="top-left"
        style={{
          left: `-${dotSize / 2}px`,
          top: `-${dotSize / 2}px`,
          cursor: "nwse-resize",
          width: dotSize,
          height: dotSize,
        }}
      />
      <img
        className="trun"
        onPointerDown={handleturn}
        src="/images/refresh.png"
      />
    </>
  );
};
export default FrameTools;
