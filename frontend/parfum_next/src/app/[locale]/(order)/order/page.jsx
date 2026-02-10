

import OrderForm from "@/components/OrderForm/OrderForm";
import OrderInfo from "@/components/OrderInfo/OrderInfo";

import styles from './page.module.scss'


export default function OrderPage() {

	

    return (
        <div className={styles.order}>
			<div className="container">
				<div className={styles.order__box}>
					<div className={styles.order__item}>
						<h1 className={`${styles.order__title} title`}>Оформление заказа</h1>
						<OrderForm/>
					</div>
					<div className="order__item">
						<OrderInfo/>
					</div>
				</div>
			</div>
		</div>	
    );
}
