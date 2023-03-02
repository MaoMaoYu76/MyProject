import React, { useState, useEffect } from "react";
import "../Styles/FontList.css";
import WebFont from "webfontloader";
import { useRef } from "react";

const FontList = () => {
  const [fontList, setFontList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);

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
  }, []);

  const selectedFontsList = fontList
    .filter((font) => selectedFonts.includes(font.family))
    .sort(
      (a, b) =>
        selectedFonts.indexOf(a.family) - selectedFonts.indexOf(b.family)
    );

  const remainingFontsList = fontList
    .filter((font) => !selectedFonts.includes(font.family))
    .sort((a, b) => a.family.localeCompare(b.family));

  //   const filteredFonts = fontList
  //     .filter((font) =>
  //       font.family.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //     .sort((a, b) => {
  //       // Put selected fonts first
  //       if (selectedFonts.includes(a.family)) return -1;
  //       if (selectedFonts.includes(b.family)) return 1;
  //       // Sort remaining fonts alphabetically
  //       return a.family.localeCompare(b.family);
  //     });

  //   const fontNames = fontList.map((font) => font.family);
  //   console.log(fontNames);

  const loadFonts = async (fontFamilies) => {
    const chunkSize = 5; // 每次加載的字型數量
    let startIndex = 0; // 起始索引
    while (startIndex < fontFamilies.length) {
      const chunkFamilies = fontFamilies.slice(
        startIndex,
        startIndex + chunkSize
      );
      // await new Promise((resolve) => {
      //   WebFont.load({
      //     google: {
      //       families: chunkFamilies,
      //     },
      //     active: resolve,
      //   });
      // });
      startIndex += chunkSize;
    }
  };

  // 傳入所有需要加載的字型
  loadFonts(fontList.map((font) => font.family));

  //   useEffect(() => {
  //     // 取得畫面中使用的字型選項

  //     const fontFamilies = filteredFonts.map((font) => font.family);

  //     const chunkSize = 13;
  //     let startIndex = 0;

  //     // 建立 IntersectionObserver 實例，監聽 search-box
  //     observerRef.current = new IntersectionObserver(
  //       (entries) => {
  //         entries.forEach((entry) => {
  //           console.log(entry);
  //           // 當 search-box 的內容區塊捲動時，預載下一批字型
  //           if (
  //             entry.target.scrollTop + entry.target.clientHeight >=
  //               entry.target.scrollHeight &&
  //             startIndex < fontFamilies.length
  //           ) {
  //             const chunkFamilies = fontFamilies.slice(
  //               startIndex,
  //               startIndex + chunkSize
  //             );
  //             //   setIsLoading(true);
  //             //   WebFont.load({
  //             //     google: {
  //             //       families: chunkFamilies,
  //             //     },
  //             //     active: () => {
  //             //       // 字型預載完成後，更新起始索引，並設定 isLoading 為 false
  //             //       startIndex += chunkSize;
  //             //       setIsLoading(false);
  //             //     },
  //             //   });
  //           }
  //         });
  //       },
  //       {
  //         root: document.querySelector(".font-items"),
  //         rootMargin: "0px",
  //         threshold: 1.0,
  //       }
  //     );

  //     // 監聽 search-box 的內容區塊
  //     observerRef.current.observe(
  //       document.getElementsByClassName("font-item")[12]
  //     );

  //     // 返回 cleanup 函式，解除 IntersectionObserver 的監聽
  //     return () => {
  //       observerRef.current.disconnect();
  //     };
  //   }, [filteredFonts]);

  return (
    <div className="scroll-box">
      <div className="search-box">
        <input
          className="font-search"
          type="text"
          placeholder="Search fonts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img className="close" src="/images/close.png" />
      </div>
      <div className="ch">中文適用</div>
      <ul className="font-items">
        {selectedFontsList.map((font) => (
          <li
            className="font-item"
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
        <div className="ch"></div>
        {remainingFontsList.map((font) => (
          <li
            className="font-item"
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
