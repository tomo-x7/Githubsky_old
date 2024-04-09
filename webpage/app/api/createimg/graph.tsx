import { Image, createCanvas } from "canvas";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ImageResponse } from "next/og";
const FileReader = require('filereader')


dayjs.locale("ja");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");
const yesterday = dayjs().tz().subtract(1, "d");

type week = {
	0: number;
	1: number;
	2: number;
	3: number;
	4: number;
	5: number;
	6: number;
};
export type params = { count: number; lastweek: week; star?: number };

export const graph = async (params: params): Promise<Buffer> => {
	const lastweekarray: Array<number> = [
		params.lastweek[0],
		params.lastweek[1],
		params.lastweek[2],
		params.lastweek[3],
		params.lastweek[4],
		params.lastweek[5],
		params.lastweek[6],
	];
	const image = { width: 1074, height: 564 };
	const graphheight = 400;

	const graphBackgroundColor = Array(7).fill("green");
	graphBackgroundColor[yesterday.day()] = "red";
	const graphtextfont = Array(7).fill({ weight: "bold", size: 20 });
	graphtextfont[yesterday.day()] = { weight: "bold", size: 40 };

	const graphcanvas = createCanvas(image.width, graphheight);
	const graphcontext = graphcanvas.getContext("2d");
	const maincanvas = createCanvas(image.width, image.height);
	const maincontext = maincanvas.getContext("2d");

	Chart.register(ChartDataLabels);
	Chart.defaults.scales.linear.display = false;
	Chart.defaults.plugins.legend.display = false;
	new Chart(graphcontext as unknown as CanvasRenderingContext2D, {
		type: "bar",
		data: {
			labels: ["日", "月", "火", "水", "木", "金", "土"],
			datasets: [
				{
					data: lastweekarray,
					label: "コミット数",
					backgroundColor: graphBackgroundColor,
					datalabels: {
						color: "rgba(200,60,60,1)",
						font: graphtextfont,
						anchor: "end",
						align: "end",
						padding: {
							bottom: 0,
						},
						formatter: (value, context) => {
							return `${value}℃`;
						},
					},
				},
			],
		},
		options: {
			scales: {
				myscale: {
					axis: "y",
					display: true,
					ticks: {
						stepSize: 10,
					},
					suggestedMax: 20,
					grid: {},
				},
			},
		},
	});

	maincontext.fillStyle = "white";
	maincontext.fillRect(0, 0, image.width, image.height);

	const imageblob = Buffer.from(await (await new ImageResponse(<div>aaaa</div>).blob()).arrayBuffer())
	console.log('blob')
	await drawObjURL(
		imageblob,
		maincontext as unknown as CanvasRenderingContext2D,
	);

	maincontext.drawImage(graphcanvas, 0, image.height - graphheight);
	return maincanvas.toBuffer('image/png');
};

const drawObjURL = (buff: Buffer, context: CanvasRenderingContext2D) => {
	return new Promise<void>((resolve, reject) => {
		const img = new Image();

		
		img.onerror = (e) => {
			console.warn(e);
			reject();
		};
		img.onload = () => {
			context.drawImage(img as unknown as HTMLImageElement, 0, 0);
			console.log('success')
			resolve();
		};
		img.src = buff;
	});
};