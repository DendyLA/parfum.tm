import styles from "./page.module.scss";

// Прямой импорт JSON с переводами
import ruMessages from "@/messages/delivery/ru.json";
import tkMessages from "@/messages/delivery/tk.json";

export default function DeliveryPage({ params: { locale } }) {
  // Выбираем нужные сообщения по locale
  const messages = locale === "tk" ? tkMessages : ruMessages;

  return (
    <div className={styles.delivery}>
		<h1 className={styles.title}>{messages.title}</h1>

		<div className={styles.card}>
			<p>{messages.deliveryInfo1}</p>
			<p>{messages.deliveryInfo2}</p>
		</div>

		<div className={styles.card}>
			<h2 className={styles.subtitle}>{messages.scheduleTitle}</h2>
			<p>{messages.scheduleDays}</p>
			<p className={styles.time}>{messages.scheduleTime}</p>
		</div>

		<div className={styles.card}>
			<p>{messages.note1}</p>
			<p>{messages.note2}</p>
		</div>
    </div>
  );
}