import React, { useEffect, useRef, useState } from "react";
import "./canvas.css";
import * as d3 from "d3";

const Canvas = () => {
  const [data, setData] = useState([]);
  const canvasRef = useRef();
  const [drawed, setDrawed] = useState(false);

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
    if (data.length && !drawed) {
      setDrawed(true);
      const canvasWidth = canvasRef.current.getBoundingClientRect().width;
      const canvasHeight = canvasRef.current.getBoundingClientRect().height;
      const padding = 100;
      const xScale = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => Number(d[0].match(/\d{4}/)[0])),
          d3.max(data, (d) => Number(d[0].match(/\d{4}/)[0])),
        ])
        .range([padding, canvasWidth - padding]);
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[1])])
        .range([canvasHeight - padding, padding]);

      const svg = d3.select("#canvas");

      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", (canvasWidth - padding) / data.length)
        .attr("height", (d) => {
          console.log(yScale(d[1]), d[1]);
          return canvasHeight - yScale(d[1]) - padding;
        })
        .attr("fill", "navy")
        .attr(
          "x",
          (d, i) => i * ((canvasWidth - padding * 2) / data.length) + padding
        )
        .attr("y", (d) => yScale(d[1]));

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg
        .append("g")
        .style("transform", `translateY(${canvasHeight - padding + 10}px)`)
        .call(xAxis);
      svg
        .append("g")
        .style("transform", `translateX(${padding - 10}px)`)
        .call(yAxis);
    }
  }, [data, drawed]);

  return <svg id="canvas" ref={canvasRef}></svg>;
};

export default Canvas;
