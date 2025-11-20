import CategoryFetcher from "./CategoryFetcher";

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  return (
    <section className="section_padd">
		<div className="container">
			<h1>Категория: {slug}</h1>
			{/* Клиентский компонент отвечает за fetch и бесконечный список */}
			<CategoryFetcher slug={slug} />
		</div>
    </section>
  );
}
