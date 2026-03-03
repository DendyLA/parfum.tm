import styles from "./page.module.scss";

export default function DeliveryPage() {
  return (
    <div className={styles.delivery}>
		<h1 className={styles.title}>Доставка</h1>

		<div className={styles.card}>
			<p>
			Мы осуществляем доставку по Ашхабаду и по всему Туркменистану.
			</p>
			<p>
			Стоимость и сроки доставки рассчитываются индивидуально в зависимости от адреса.
			</p>
		</div>

		<div className={styles.card}>
			<h2 className={styles.subtitle}>График работы магазина</h2>
			<p>Понедельник – Воскресенье</p>
			<p className={styles.time}>09:00 – 20:00</p>
		</div>

		<div className={styles.card}>
			<p>
			Время работы службы доставки и онлайн-консультантов может отличаться.
			</p>
			<p>
			Для получения дополнительной информации свяжитесь с нами.
			</p>
		</div>
    </div>
  );
}