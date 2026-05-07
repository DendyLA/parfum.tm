import "@/styles/global.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MobileNav from "@/components/mobileNav/MobileNav";
import RouteLoader from "../../loading";
import { LocaleProvider } from "@/context/LocaleContext";
import ScrollToTop from "@/components/ScrollTop/ScrollTop";
import ToTop from "@/components/ToTop/ToTop";

import ruMeta from "@/messages/meta/ru.json";
import tkMeta from "@/messages/meta/tk.json";

export async function generateMetadata({ params }) {
	const { locale } = params;

	const meta = locale === "tk" ? tkMeta.layout : ruMeta.layout;

	return {
		metadataBase: new URL("https://parfum.com.tm"),

		title: {
			default: meta.title,
			template: "%s | Parfum TM",
		},

		description: meta.description,

		viewport: {
			width: "device-width",
			initialScale: 1,
		},

		robots: {
			index: true,
			follow: true,
		},

		openGraph: {
			type: "website",
			siteName: "Parfum TM",
			title: meta.title,
			description: meta.description,
		},

		icons: {
			icon: "/favicons/favicon.ico",
			apple: "/favicons/apple-touch-icon.png",
		},
	};
}

export default function LocaleLayout({ children, params }) {
	const { locale } = params;

	return (
		<html lang={locale}>
			<body>
				<LocaleProvider>
					<ToTop />
					<Header />
					<RouteLoader />

					<main>{children}</main>

					<Footer />
					<MobileNav />
					<ScrollToTop />
				</LocaleProvider>
			</body>
		</html>
	);
}