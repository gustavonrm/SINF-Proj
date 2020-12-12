
import React from "react";
import { Pie } from "react-chartjs-2";

const LineChart = () => {
	const data = {
		labels: [
			'Red',
			'Blue',
			'Yellow'
		],
		datasets: [{
			data: [300, 50, 100],
			backgroundColor: [
				'#FF6384',
				'#36A2EB',
				'#FFCE56'
			],
			hoverBackgroundColor: [
				'#FF6384',
				'#36A2EB',
				'#FFCE56'
			]
		}]
	};
	return (
		<div>
			<Line
				data={data}
				height={250}
				width={350}
				options={{
					maintainAspectRatio: false
				}}
			/>
		</div>
	);
};

export default PieChart;
