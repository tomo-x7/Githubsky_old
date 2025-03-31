import './globals.css'
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<head>
			<meta name="google-site-verification" content="YixWpicRcAoWs75i4q6tbR_KwaSRuVetnSE4_fllXvo" />
			</head>
			<body>{children}</body>
		</html>
	);
}
