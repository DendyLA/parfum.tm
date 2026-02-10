import BrandsFetcher from "./BrandsFetcher";

export default async function BrandPage({ params }) {
    const { slug } = await params; // <-- ОБЯЗАТЕЛЬНО await

    return (
        <section className="section_padd">
            <div className="container">
                <BrandsFetcher slug={slug} key={slug} />
            </div>
        </section>
    );
}
