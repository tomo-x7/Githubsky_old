import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { elem, type params } from "./img";

const size = {
	width: 960,
	height: 640,
};
const contentType = "image/png";

export async function GET(rawrequest: NextRequest) {
	const searchParams = new URL(rawrequest.url).searchParams;
	const star = searchParams.get("star");
	const params: params = {
		count: Number.parseInt(searchParams.get("count") ?? "0"),
		lastweek: JSON.parse(
			decodeURIComponent(
				searchParams.get("lastweek") ?? JSON.stringify({ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }),
			),
		),
		star: star !== null ? Number.parseInt(star) : undefined,
	};
	return new ImageResponse(elem(params), {
		width: 1074,
		height: 564,
	});
}
