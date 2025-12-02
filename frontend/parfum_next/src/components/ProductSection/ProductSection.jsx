import ProductList from "@/components/ProductList/ProductList";

export default function ProductSection({ title, products }) {
    if (!products || products.length === 0) return null;

    return (
        <section className="section_padd">
            <div className="container">
                <h4 className="title">{title}</h4>
                <ProductList product={products} />
            </div>
        </section>
    );
}
