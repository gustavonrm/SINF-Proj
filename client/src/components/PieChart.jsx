import React from "react";
import { Pie } from "react-chartjs-2";

const PieChart = () => {
  const data = {
    labels: ["Red", "Blue", "Yellow", "Red", "Blue", "Yellow"],
    datasets: [
      {
        data: [60, 60, 60, 60, 60, 60],
        backgroundColor: [
          "rgba(1,9,116,1)",
          "rgba(51,28,255,1)",
          "rgba(36,0,189,1)",
          "rgba(51,170,249,1)",
          "rgba(126,223,255,1)",
          "rgba(126,223,255,1)",
          "rgba(208,208,208,1)",
        ],
        hoverBackgroundColor: [
          "rgba(1,9,116,1)",
          "rgba(51,28,255,1)",
          "rgba(36,0,189,1)",
          "rgba(51,170,249,1)",
          "rgba(126,223,255,1)",
          "rgba(126,223,255,1)",
          "rgba(208,208,208,1)",
        ],
      },
    ],
  };
  return (
    <div>
      <Pie
        data={data}
        height={250}
        width={350}
        options={{
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default PieChart;
