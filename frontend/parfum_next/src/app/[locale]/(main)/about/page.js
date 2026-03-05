
import styles from "./page.module.scss";
import ruMessages from "@/messages/about/ru.json";
import tkMessages from "@/messages/about/tk.json";

import ruMeta from "@/messages/meta/ru.json";
import tkMeta from "@/messages/meta/tk.json";

export async function generateMetadata({ params }) {
	const { locale } = params;

	const meta = locale === "tk" ? tkMeta.about : ruMeta.about;

	return {
		title: meta.title,
		description: meta.description,
		keywords: meta.keywords,

		openGraph: {
			title: meta.title,
			description: meta.description,
			url: `https://parfum.com.tm/${locale}/about`,
			siteName: "Parfum TM",
			type: "website"
		},

		alternates: {
			languages: {
				ru: "https://parfum.com.tm/ru/about",
				tk: "https://parfum.com.tm/tk/about"
			}
		}
	};
}


export default function AboutPage({ params: { locale } }) {
	const messages = locale === "tk" ? tkMessages : ruMessages;

	return (
		<>
		<section className={styles.intro}>
			<div className={`container ${styles.intro__container}`}>
			<div className={styles.intro__wrapper}>
				<h1 className={styles.intro__title}>{messages.introTitle}</h1>
				<div className={styles.intro__bottom}>
				<div className={styles.intro__subtitle_top}>{messages.introTop}</div>
				<div className={styles.intro__subtitle}>{messages.introSubtitle}</div>
				<div className={styles.intro__text}>{messages.introText}</div>
				</div>
			</div>
			</div>
		</section>

		<section className="section_padd">
			<div className="container">
			<div className={styles.about}>
				<div className={styles.about__content}>
				{messages.aboutParagraphs.map((p, i) => (
					<p key={i}>{p}</p>
				))}
				</div>
			</div>
			</div>
		</section>

		<section className={styles.map}>
			<div className={styles.map__wrapper}>
			<iframe
				src="https://yandex.ru/map-widget/v1/?um=constructor%3Ad23059a43a1034f9c26b043524b70763e71760e307de341c2830858653a42120&amp;source=constructor"
				width="100%"
				height="713"
				frameBorder="0"
			></iframe>
			<div className={styles.map__info}>
				{messages.mapPoints.map((point, i) => (
				<div key={i} className={styles.map__point}>
					<h3>{point.title}</h3>
					<p>{point.address1}</p>
					{point.address2 && <p>{point.address2}</p>}
					<div className={styles.map__phones}>
					{point.phones.map((phone, j) => (
						<a key={j} href={`tel:${phone}`}>{phone}</a>
					))}
					</div>
				</div>
				))}
			</div>
			</div>
		</section>
		</>
	);
}