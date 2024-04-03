import type { week } from "./github";

export const getimg = async (count: number, lastweek: week,star?:number) => {
	const rawdata = await fetch(
		`https://githubsky.vercel.app/api/createimg?count=${count}&lastweek=${JSON.stringify(lastweek)}&star=${star}`,
	);
	if (!rawdata.ok) {
		return false;
	}
	const data = await rawdata.blob();
    return data
	// const fs = require("node:fs");
	// // 非同期で行う場合
	// await fs.writeFile("out.png", Buffer.from(await data.arrayBuffer()), (err, data) => {
	// 	if (err) console.log(err);
	// 	else console.log("write end");
	// });
};
