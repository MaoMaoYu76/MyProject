import React, { useState, useEffect } from "react";
import "../Styles/FontList.css";
import WebFont from "webfontloader";
import { useRef } from "react";

const FontList = (props) => {
  const angle = ((25 - 180) * Math.PI) / 180;
  console.log(2.6 * Math.sin(angle));
  // const [loadedFonts, setLoadedFonts] = useState([]);
  // const [fontName, setfontName] = useState("NotoSerifTC-Regular");

  // const loadFont = (fontName, fontUrl) => {
  //   const fontFace = new FontFace(fontName, `url(${fontUrl})`);
  //   fontFace.load().then(() => {
  //     document.fonts.add(fontFace);
  //     setLoadedFonts([...loadedFonts, fontName]);
  //   });
  // };

  // useEffect(() => {
  //   const fontUrl = `fonts/${fontName}.otf`;
  //   if (!loadedFonts.includes(fontName)) {
  //     loadFont(fontName, fontUrl);
  //   }
  // }, []);

  // const handleFontChange = (event, fontName) => {
  //   setfontName(fontName);
  //   const fontUrl = `fonts/${fontName}.otf`;
  //   if (!loadedFonts.includes(fontName)) {
  //     loadFont(fontName, fontUrl);
  //   }
  // };

  // return (
  //   <div className="scroll-box">
  //     <div className="search-box">
  //       <img
  //         className="close"
  //         onClick={() => {
  //           props.handleShowBox(false);
  //         }}
  //         src="/images/close.png"
  //       />
  //     </div>
  //     <ul className="font-items">
  //       {loadedFonts.map((fontName) => (
  //         <style key={fontName}>
  //           {`
  //             @font-face {
  //               font-family: "${fontName}";
  //               src: url("fonts/${fontName}.otf");
  //             }
  //           `}
  //         </style>
  //       ))}
  //       <li
  //         style={{
  //           fontFamily: "NotoSerifTC-Regular",
  //           fontWeight: fontName === "NotoSerifTC-Regular" ? "bold" : "normal",
  //         }}
  //         onClick={(event) => handleFontChange(event, "NotoSerifTC-Regular")}
  //       >
  //         NotoSerifTC
  //       </li>
  //       <li
  //         style={{
  //           fontFamily: "NotoSansCJKtc-Regular",
  //           fontWeight:
  //             fontName === "NotoSansCJKtc-Regular" ? "bold" : "normal",
  //         }}
  //         onClick={(event) => handleFontChange(event, "NotoSansCJKtc-Regular")}
  //       >
  //         NotoSansCJKtc
  //       </li>
  //     </ul>
  //   </div>
  // );
};

export default FontList;
