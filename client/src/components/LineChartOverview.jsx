import React from "react";
import { Line } from "react-chartjs-2";

const LineChartOverview = (props) => {
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: props.title1,
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(24,0,171,0.4)",
        borderColor: "rgba(24,0,171,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(24,0,171,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(24,0,171,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: props.data1,
      },
      {
        label: props.title2,
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(255,0,0,0.4)",
        borderColor: "rgba(255,0,0,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(255,0,0,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(255,0,0,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: props.data2,
      },
    ],
  };

  return (
    <div>
      <Line
        data={data}
        height={props.height}
        width={props.width}
        options={{
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default LineChartOverview;
