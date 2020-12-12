
import React from "react";
import { Pie } from "react-chartjs-2";

const PieChart = () => {
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
			<Pie
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
