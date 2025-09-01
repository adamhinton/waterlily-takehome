import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import ReduxStoreProvider from "./redux/StoreProvider";
import AuthWatcher from "./components/AuthWatcher";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Waterlily",
	description: "Survey App",
};

const geistSans = Geist({
	variable: "--font-geist-sans",
	display: "swap",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.className} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ReduxStoreProvider>
						<AuthWatcher>{children}</AuthWatcher>
					</ReduxStoreProvider>
				</ThemeProvider>
				<script src="https://accounts.google.com/gsi/client" async></script>
			</body>
		</html>
	);
}
