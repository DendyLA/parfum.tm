// app/sale/page.jsx
import ProductList from "@/components/ProductList/ProductList";
import styles from "./page.module.scss";
import { getProducts } from "@/lib/endpoints";

export default async function SalePage() {
  // Получаем только акционные товары
  const products = await getProducts({ on_sale: true, pageSize: 20 });

  return (
    <div className={styles.salePage}>
      <div className='container'>
        <h1 className={styles.title}>Акционные товары</h1>
        <p className={styles.description}>
          Здесь представлены все товары действующие по акции
        </p>

        <ProductList product={products} />
      </div>
    </div>
  );
}