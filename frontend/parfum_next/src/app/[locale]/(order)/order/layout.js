import "@/styles/global.scss";
import Link from "next/link";
import Image from "next/image";
import Footer from '@/components/Footer/Footer'
import { MoveLeft } from 'lucide-react';

import styles from './page.module.scss'

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
		<header className={styles.order__header}>
			<div className="container">
				<div className={styles.order__wrapper}>
					<Link href='/' className={`${styles.order__link} link`}><MoveLeft />Вернуться к покупкам</Link>
					<Link className={`${styles.order__image} link`} href="/"><Image src="/images/logo/logo.svg" alt="Company Logo" width={180} height={60} priority/></Link>
				</div>
			</div>
		</header>

		<main>{children}</main>
		
		<Footer />
	  </body>
	</html>
  );
}
