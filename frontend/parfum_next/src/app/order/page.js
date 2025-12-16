// import { createOrder } from "@/lib/orders";
// import { getCart, clearCart } from "@/lib/addToCart";

// async function submitOrder(formData) {
// 	const cart = getCart();

// 	const items = cart.map(item => ({
// 		product_id: item.id,
// 		variation: item.selectedVariation,
// 		quantity: item.quantity,
// 		price: item.discount_price ?? item.price,
// 	}));

// 	const total_price = items.reduce(
// 		(sum, i) => sum + i.price * i.quantity,
// 		0
// 	);

// 	await createOrder({
// 		first_name: formData.firstName,
// 		last_name: formData.lastName,
// 		phone: formData.phone,
// 		comment: formData.comment,
// 		items,
// 		total_price,
// 	});

// 	clearCart();
// }


'use client';

export default function OrderPage() {
    return (
        <div>
            <p>Здесь будет форма заказа клиента.</p>
        </div>
    );
}
