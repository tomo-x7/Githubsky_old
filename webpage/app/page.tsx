import type { Metadata } from "next";
import Client from "./client";
import style from "./page.module.css";
import Link from "next/link";
type props = {
	href: string | URL;
	children?: React.ReactNode | string | undefined;
};
const Mylink = ({ href, children }: props) => {
	return (
		<Link href={href} target="__blank" rel="noopener noreferrer">
			{children}
		</Link>
	);
};
const kotira = <Mylink href="https://bsky.app/settings/app-passwords">こちら</Mylink>;

let ogpimg: Uint8Array;
fetch("https://githubsky.vercel.app/ogp.png")
	.then((data) => data.arrayBuffer())
	.then((buff) => new Uint8Array(buff))
	.then((u8array) => {
		ogpimg = u8array;
	});

export default function Page() {
	return (
		<>
			<h1>GithubskyはV2に移行しました</h1>
			V2は<a href="https://githubsky.tomo-x.win">こちら</a>
		</>
	);
}

export const metadata: Metadata = {
	title: "Githubsky",
	description: "前日のGithubのコミット数と直近一週間のヒートマップを自動でBlueskyに投稿するサービスです。",
	icons: [{ url: "/favicon.svg", type: "image/svg+xml" }],
	openGraph: {
		title: "Githubsky",
		description: "前日のGithubのコミット数と直近一週間のヒートマップを自動でBlueskyに投稿するサービスです。",
		type: "website",
		images: "https://githubsky.vercel.app/ogp.png",
	},
	twitter: {
		title: "Githubsky",
		description: "前日のGithubのコミット数と直近一週間のヒートマップを自動でBlueskyに投稿するサービスです。",
		card: "summary",
		images: "https://githubsky.vercel.app/card.png",
	},
};
