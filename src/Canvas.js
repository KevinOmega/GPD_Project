import React, { useEffect, useState } from "react";
import "./canvas.css";

const Canvas = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const xml = new XMLHttpRequest();
    xml.open(
      "GET",
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
      true
    );
    xml.send();
    xml.onload = () => {
      const json = JSON.parse(xml.responseText);
      setData(json.data);
    };
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return <div id="canvas"></div>;
};

export default Canvas;
