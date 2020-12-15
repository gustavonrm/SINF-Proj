import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = (props) => {
  return (
    <div>
      <Bar
        data={{
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
              data: props.data1,
              backgroundColor: [
                "#AB0000",
                "#AB0000",
                "#AB0000",
                "#AB0000",
                "#AB0000",
                "#AB0000",
                "#AB0000",
                "#AB0000",
                "#AB0000",
                "#AB0000",
                "#AB0000",
                "#AB0000",
              ],
            },
            {
              label: props.title2,
              data: props.data2,
              backgroundColor: [
                "#1800AB",
                "#1800AB",
                "#1800AB",
                "#1800AB",
                "#1800AB",
                "#1800AB",
                "#1800AB",
                "#1800AB",
                "#1800AB",
                "#1800AB",
                "#1800AB",
                "#1800AB",
              ],
            },
            {
              label: props.title3,
              data: props.data3,
              backgroundColor: [
                "#00AB11",
                "#00AB11",
                "#00AB11",
                "#00AB11",
                "#00AB11",
                "#00AB11",
                "#00AB11",
                "#00AB11",
                "#00AB11",
                "#00AB11",
                "#00AB11",
                "#00AB11",
              ],
            },
            {
              label: props.title4,
              data: props.data4,
              backgroundColor: [
                "#ABA400",
                "#ABA400",
                "#ABA400",
                "#ABA400",
                "#ABA400",
                "#ABA400",
                "#ABA400",
                "#ABA400",
                "#ABA400",
                "#ABA400",
                "#ABA400",
                "#ABA400",
                "#ABA400",
              ],
            },
          ],
        }}
        height={280}
        width={700}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        }}
      />
    </div>
  );
};

export default BarChart;
