import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const Border = (props) => {
  const [border, setBorder] = useState("3px");
  const [dotSize, setDotSize] = useState(15);
  const [showFrameTools, setShowFrameTools] = useState(false);
  useEffect(() => {
    if (props.selected === props.id) {
      if (props.scale < 40) {
        setBorder("15px");
        setDotSize(60);
      } else if (props.scale < 60) {
        setBorder("10px");
        setDotSize(40);
      } else if (props.scale > 200) {
        setBorder("1px");
        setDotSize(10);
      } else if (props.scale > 60 && props.scale < 200) {
        setBorder("3px");
        setDotSize(15);
      }
      setShowFrameTools(true);
    } else {
      setShowFrameTools(false);
      setBorder("0px");
    }
  }, [props.selected, props.fontWeight, props.scale]);
  return { border, dotSize, showFrameTools };
};

export default Border;
