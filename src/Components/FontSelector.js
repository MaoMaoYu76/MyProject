import React, { useState, useEffect } from "react";
import "../Styles/FontList.css";
import WebFont from "webfontloader";
import { useRef } from "react";

const FontList = (props) => {
  const [loadedFonts, setLoadedFonts] = useState([]);
  const [fontName, setfontName] = useState();

  const loadFont = (fontName, fontUrl) => {
    const fontFace = new FontFace(fontName, `url(${fontUrl})`);
    fontFace.load().then(() => {
      document.fonts.add(fontFace);
      setLoadedFonts([...loadedFonts, fontName]);
    });
  };

  const handleFontChange = (event) => {
    setfontName(event.target.value);
    const fontUrl = `fonts/${event.target.value}.otf`;
    if (!loadedFonts.includes(event.target.value)) {
      loadFont(event.target.value, fontUrl);
    }
  };

  return (
    <div className="scroll-box">
      <div className="search-box">
        <img
          className="close"
          onClick={() => {
            props.handleShowBox(false);
          }}
          src="/images/close.png"
        />
      </div>
      <ul className="font-items">
        {loadedFonts.map((fontName) => (
          <style key={fontName}>
            {`
          @font-face {
            font-family: "${fontName}";
            src: url("fonts/${fontName}.otf");
          }
        `}
          </style>
        ))}
        <li
          style={{ fontFamily: loadedFonts[loadedFonts.length - 1] }}
          onClick={handleFontChange}
          value="NotoSerifTC-Regular"
        >
          NotoSerifTC
        </li>
        <li
          style={{ fontFamily: loadedFonts[loadedFonts.length - 1] }}
          onClick={handleFontChange}
          value="NotoSansCJKtc-Regular"
        >
          NotoSansCJKtc
        </li>
      </ul>
    </div>
  );
};

export default FontList;
