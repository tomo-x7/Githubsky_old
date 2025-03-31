import './globals.css'
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<head>
			</head>
			<body>{children}</body>
		</html>
	);
}
