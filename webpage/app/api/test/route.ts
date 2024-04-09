import { createCanvas } from "canvas";
import { Chart } from "chart.js/auto";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
   const canvas = createCanvas(800, 800);
  const context = canvas.getContext("2d");

  const xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

  new Chart(context as unknown as CanvasRenderingContext2D, { // なぜか謎のキャストが必要
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          label: "A",
          data: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478],
          backgroundColor: "red",
        },
        {
          label: "B",
          data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
          backgroundColor: "green",
        },
        {
          label: "C",
          data: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
          backgroundColor: "blue",
        },
      ],
    },
  });

  const imageBuffer = canvas.toBuffer("image/png");
  //const imageBuffer=await fetch('https://githubsky.vercel.app/api/createimg?count=4&lastweek={%220%22:3,%221%22:1,%222%22:2,%223%22:3,%224%22:4,%225%22:1,%226%22:17}').then((data)=>data.blob())
  return new NextResponse(imageBuffer,{status:200,headers:{"Content-Type": "image/png"}})
  // biome--ignore lint/correctness/noUnreachable: <explanation>
//   return new Response(imageBuffer, {
//     status: 200,
//     headers: { "Content-Type": "image/png" },
//   });
}