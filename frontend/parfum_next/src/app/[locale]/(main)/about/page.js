
import styles from "./page.module.scss";

export default function AboutPage() {
  return (
	<>
		<section className={styles.intro} style={{ backgroundImage: "url('/images/about/bg.png')"}}>
			<div className={`container ${styles.intro__container}`}>
				<div className={styles.intro__wrapper}>
					<h1 className={styles.intro__title}>Parfum TM — 25 лет на рынке Туркменистана, тысячи довольных клиентов и широкий выбор оригинальной парфюмерии и косметики.</h1>
					<div className={styles.intro__bottom}>
						<div className={styles.intro__subtitle_top}>ПРИВЕТСТВУЕМ В PARFUM TM</div>
						<div className={styles.intro__subtitle}>ГДЕ ЦАРИТ КРАСОТА БЕЗ ГРАНИЦ</div>
						<div className={styles.intro__text}>
							25 лет радости для ценителей качественной и оригинальной продукции в сфере парфюмерии, ухода за лицом и косметики в Туркменистане. Parfum TM — это пространство вдохновения, где каждый аромат рассказывает историю, а каждая покупка становится особенным моментом. Здесь сочетаются проверенные мировые бренды, эксклюзивные новинки и высокий уровень сервиса. Тысячи покупателей ежедневно выбирают Parfum TM за качество, оригинальность и профессиональный подход. Красота не знает границ — и именно поэтому ассортимент и сервис создаются так, чтобы каждый мог найти свой идеальный аромат и уход.
						</div>
					</div>
					</div>
			</div>




		</section>


		<section className="section_padd">
			<div className="container">
				<div className={styles.about}>
				{/* <h1 className={styles.about__title}>О Нас</h1> */}

				<div className={styles.about__content}>
					<p>
					В нашем магазине вы всегда найдете не только популярные товары, но и эксклюзивные новинки, которые станут настоящей находкой для ценителей красоты. Мы искренне заботимся о каждом клиенте, предоставляя индивидуальные консультации и помощь в подборе средств для ухода, чтобы каждая покупка была максимально эффективной и приносила радость.
					</p>
					<p>
						Наши продавцы-консультанты всегда готовы помочь вам с выбором продукции, дать рекомендации по уходу за кожей или подобрать идеальный парфюм. Мы стремимся сделать каждую покупку максимально комфортной для вас, обеспечивая высокий уровень обслуживания и надежную доставку.
					</p>
					<p>
					25 лет работы — это не просто цифра, это история о стремлении быть лучше для вас. Наши клиенты — наша гордость, и мы будем продолжать развиваться, чтобы дарить вам только лучшие продукты и уникальный опыт покупок.
					</p>

				</div>
				</div>
			</div>
		</section>


		<section className={styles.map}>
			<div className="container">
				<div className={styles.map__wrapper}>
					<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Ad23059a43a1034f9c26b043524b70763e71760e307de341c2830858653a42120&amp;source=constructor" width="100%" height="713" frameborder="0"></iframe>
					<div className={styles.map__info}>
						<div className={styles.map__point}>
							<h3>ТЦ "15 лет Независимости"</h3>
							<p>(оптовый) 1 этаж со стороны Сурикова</p>
							<p>Магазин №105</p>

							<div className={styles.map__phones}>
							<a href="tel:+99362907632">+993 62 90 76 32</a>
							<a href="tel:+99312422746">+993 12 42 27 46</a>
							</div>
						</div>

						<div className={styles.map__point}>
							<h3>ТЦ "15 лет Независимости"</h3>
							<p>(оптовый) 1 этаж</p>
							<p>Магазин №5 (старое здание)</p>

							<div className={styles.map__phones}>
							<a href="tel:+99362907631">+993 62 90 76 31</a>
							<a href="tel:+99312422745">+993 12 42 27 45</a>
							</div>
						</div>

						<div className={styles.map__point}>
							<h3>"Paytagt" (Мир) базар</h3>
							<p>Магазин №125</p>

							<div className={styles.map__phones}>
							<a href="tel:+99362907635">+993 62 90 76 35</a>
							<a href="tel:+99312462123">+993 12 46 21 23</a>
							</div>
						</div>

						</div>
				</div>

			</div>
		</section>
	</>
    
  );
}
