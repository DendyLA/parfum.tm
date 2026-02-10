import "@/styles/global.scss";
import Header from "@/components/Header/Header"; 
import Footer from '@/components/Footer/Footer'
import RouteLoader from '../../loading';
import { LocaleProvider } from "@/context/LocaleContext";

export const metadata = {
  icons: {
    icon: '/favicons/favicon.ico',
    apple: '/favicons/apple-touch-icon.png',
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
		<LocaleProvider>
			<Header />
			<RouteLoader />
			
				<main>{children}</main>	
			
			<Footer />
		</LocaleProvider>
      </body>
    </html>
  );
}
