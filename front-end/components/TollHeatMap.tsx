"use client";

import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";

// Register the chart components
Chart.register(...registerables, MatrixController, MatrixElement);

export default function TollHeatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // If there's already a chart instance, destroy it before creating a new one
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const data = [
      { x: "Toll 1", y: "Monday", v: 10 },
      { x: "Toll 1", y: "Tuesday", v: 15 },
      { x: "Toll 1", y: "Wednesday", v: 12 },
      { x: "Toll 1", y: "Thursday", v: 8 },
      { x: "Toll 1", y: "Friday", v: 20 },
      { x: "Toll 2", y: "Monday", v: 5 },
      { x: "Toll 2", y: "Tuesday", v: 8 },
      { x: "Toll 2", y: "Wednesday", v: 6 },
      { x: "Toll 2", y: "Thursday", v: 10 },
      { x: "Toll 2", y: "Friday", v: 12 },
    ];

    const config: ChartConfiguration = {
      type: "matrix",
      data: {
        datasets: [
          {
            label: "Toll Usage",
            data: data,
            backgroundColor(context) {
              const value = context.dataset.data[context.dataIndex].v;
              const alpha = value / 20; // Normalize based on max value
              return `rgba(0, 0, 255, ${alpha})`;
            },
            borderColor: "#ffffff",
            borderWidth: 1,
            width: ({ chart }) => (chart.chartArea?.width ?? 0) / 2 - 1,
            height: ({ chart }) => (chart.chartArea?.height ?? 0) / 5 - 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => `${items[0].raw.x} - ${items[0].raw.y}`,
              label: (item) => `Usage: ${item.raw.v}`,
            },
          },
        },
        scales: {
          x: {
            type: "category",
            labels: ["Toll 1", "Toll 2"],
            title: { display: true, text: "Toll Locations" },
          },
          y: {
            type: "category",
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            title: { display: true, text: "Days" },
          },
        },
      },
    };

    // Create and store the chart instance
    chartInstanceRef.current = new Chart(ctx, config);

    // Cleanup: destroy chart instance on unmount or next re-render
    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, []);

  return (
      <div style={{ width: "100%", height: "400px" }}>
        <canvas ref={canvasRef} />
      </div>
  );
}
