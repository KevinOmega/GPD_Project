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
      setData(
        json.data.map((d) => {
          const year = Number(d[0].substring(0, 4));
          const month = d[0].substring(5, 7);
          let quarter = "Q1";
          if (month === "04") {
            quarter = "Q2";
          } else if (month === "07") {
            quarter = "Q3";
          } else if (month === "10") {
            quarter = "Q4";
          }

          return [year, d[1], quarter];
        })
      );
    };
  }, []);

  useEffect(() => {
    if (data.length && !drawed) {
      console.log(data);
      setDrawed(true);
      const canvasWidth = canvasRef.current.getBoundingClientRect().width;
      const canvasHeight = canvasRef.current.getBoundingClientRect().height;
      const padding = 70;
      const barWidth = (canvasWidth - padding) / data.length;

      const xScale = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => Number(d[0])),
          d3.max(data, (d) => Number(d[0])),
        ])
        .range([padding, canvasWidth - padding]);
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[1])])
        .range([canvasHeight - padding, padding]);

      const svg = d3.select("#canvas");

      const tooltip = d3
        .select("#canvas-container")
        .append("div")
        .attr("id", "tooltip");
      // .style("opacity", 0);
      console.log(tooltip);
      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gpd", (d) => d[1])
        .attr("width", barWidth)
        .attr("height", (d) => {
          return canvasHeight - yScale(d[1]) - padding;
        })
        .attr("fill", "navy")
        .attr(
          "x",
          (d, i) => i * ((canvasWidth - padding * 2) / data.length) + padding
        )
        .attr("y", (d) => yScale(d[1]))
        .on("mouseover", (e, d) => {
          tooltip
            .html(
              d[0] +
                "<br>" +
                "$" +
                d[1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
                " Billion"
            )
            .attr("data-date", d[0])
            .style("left", data.indexOf(d) * barWidth + padding  + "px")
            .style("transform", "translateX(60px)");
        });

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg
        .append("g")
        .style("transform", `translateY(${canvasHeight - padding + 10}px)`)
        .attr("id", "x-axis")
        .attr("class", "tick")
        .call(xAxis);
      svg
        .append("g")
        .style("transform", `translateX(${padding - 10}px)`)
        .attr("id", "y-axis")
        .attr("class", "tick")
        .call(yAxis);
    }
  }, [data, drawed]);

  return (
    <div id="canvas-container">
      <svg id="canvas" ref={canvasRef}></svg>
    </div>
  );
};

export default Canvas;
