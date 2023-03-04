import React, { useState, useEffect } from "react";
import "../Styles/FontList.css";
import WebFont from "webfontloader";
import { useRef } from "react";

const FontList = (props) => {
  const [fontList, setFontList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSelectedFonts, setShowSelectedFonts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const elementRefs = useRef([]);
  const observerRef = useRef(null);
  const fontListRef = useRef(null);
  const [fonts, setFonts] = useState([]);
  const fontsRef = useRef(null);

  useEffect(() => {
    fontListRef.current = fontList;
  }, [fontList]);

  useEffect(() => {
    fontsRef.current = fonts;
  }, [fonts]);

  const selectedFonts = [
    "Noto Sans Traditional Chinese",
    "Noto Serif Traditional Chinese",
    "Noto Sans Simplified Chinese",
    "Noto Serif Simplified Chinese",
    "ZCOOL XiaoWei",
    "Ma Shan Zheng",
    "ZCOOL QingKe HuangYou",
    "ZCOOL KuaiLe",
    "Zhi Mang Xing",
    "Liu Jian Mao Cao",
    "Long Cang",
  ];

  useEffect(() => {
    const fetchFonts = async () => {
      const response = await fetch(
        "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBWCWoHellq7xHFlfc5YiziHIBOjok9PP4"
      );
      const json = await response.json();
      setFontList(json.items);
    };
    fetchFonts();
    WebFont.load({
      google: {
        families: selectedFonts,
      },
    });
  }, []);

  useEffect(() => {
    if (filteredFonts.length > 0) {
      setFonts(filteredFonts.slice(0, 13));
    }
  }, [filteredFonts]);

  const selectedFontsList = fontList
    .filter((font) => selectedFonts.includes(font.family))
    .sort(
      (a, b) =>
        selectedFonts.indexOf(a.family) - selectedFonts.indexOf(b.family)
    );

  const filteredFonts = fontList.filter((font) =>
    font.family.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: "0px",
      threshold: 1.0,
    });

    setTimeout(() => {
      observerRef.current.observe(elementRefs.current[0]);
    }, 1000);

    return () => observerRef.current.disconnect();
  }, []);

  const handleObserver = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = fontsRef.current.length;
        if (index % 13 === 0) {
          const nextIndex = index + 13;
          const nextTarget = elementRefs.current[nextIndex];
          if (nextTarget) {
            observerRef.current.observe(nextTarget);
          }
          loadMoreFonts();
        }
      }
    });
  };

  const loadMoreFonts = async () => {
    const chunkSize = 13;
    const startIndex = fontsRef.current.length;
    const chunkFamilies = fontListRef.current
      .slice(startIndex, startIndex + chunkSize)
      .map((font) => font.family);
    if (chunkFamilies.length > 0) {
      setIsLoading(true);
      await new Promise((resolve) => {
        WebFont.load({
          google: {
            families: chunkFamilies,
          },
          active: () => {
            setFonts((prevFonts) => [
              ...prevFonts,
              ...fontListRef.current.slice(startIndex, startIndex + chunkSize),
            ]);
            setIsLoading(false);
          },
        });
      });
    }
  };

  return (
    <div className="scroll-box">
      <div className="search-box">
        <input
          className="font-search"
          type="text"
          placeholder="Search fonts..."
          value={searchTerm}
          onFocus={() => {
            setShowSelectedFonts(false);
            props.handleSearch(true);
          }}
          onBlur={() => {
            setShowSelectedFonts(true);
            props.handleSearch(false);
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img
          className="close"
          onClick={() => {
            props.handleShowBox(false);
          }}
          src="/images/close.png"
        />
      </div>
      <ul className="font-items">
        {showSelectedFonts && (
          <>
            <div className="ch">中文適用</div>
            {selectedFontsList.map((font) => (
              <li
                className="font-item"
                onClick={() => {
                  props.handleFont(font.family);
                }}
                style={{
                  fontFamily: font.family,
                  fontWeight: "normal",
                  fontStyle: "normal",
                }}
                key={font.family}
              >
                {font.family}
              </li>
            ))}
            <div className="ch">其他字型</div>
          </>
        )}
        {filteredFonts.map((font, index) => (
          <li
            className="font-item"
            ref={(el) => (elementRefs.current[index] = el)}
            onClick={() => {
              props.handleFont(font.family);
            }}
            style={{
              fontFamily: font.family,
              fontWeight: "normal",
              fontStyle: "normal",
            }}
            key={font.family}
          >
            {font.family}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FontList;
