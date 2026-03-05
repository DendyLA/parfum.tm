import ProductList from "@/components/ProductList/ProductList";
import styles from "./page.module.scss";
import { getProducts } from "@/lib/endpoints";

// Импортируем переводы напрямую
import ruMessages from "@/messages/sale/ru.json";
import tkMessages from "@/messages/sale/tk.json";

export default async function SalePage({ params: { locale } }) {
  // Выбираем нужные сообщения по locale
  const messages = locale === "tk" ? tkMessages : ruMessages;

  // Получаем акционные товары
  const products = await getProducts({ on_sale: true, pageSize: 20 });

  return (
    <div className={styles.salePage}>
      <div className="container">
        <h1 className={styles.title}>{messages.title}</h1>
        <p className={styles.description}>{messages.description}</p>

        <ProductList product={products} />
      </div>
    </div>
  );
}