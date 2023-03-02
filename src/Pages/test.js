import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { SketchPicker } from "react-color";

function TEST() {
  const [fontList, setFontList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredFonts = fontList
    .filter((font) =>
      font.family.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Put selected fonts first
      if (selectedFonts.includes(a.family)) return -1;
      if (selectedFonts.includes(b.family)) return 1;
      // Sort remaining fonts alphabetically
      return a.family.localeCompare(b.family);
    });

  return (
    <div>
      <input
        type="text"
        placeholder="Search fonts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredFonts.map((font) => (
          <li key={font.family}>{font.family}</li>
        ))}
      </ul>
    </div>
  );
}
export default TEST;
