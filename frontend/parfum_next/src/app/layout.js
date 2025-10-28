import "@/styles/global.scss";
import Header from "@/components/Header/Header"; 
import Footer from '@/components/Footer/Footer'


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
        <Header />
        
        <main>{children}</main>
		
		<Footer />
      </body>
    </html>
  );
}
