// lib/cart.js

export function getCart() {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(localStorage.getItem("cart")) || [];
	} catch (e) {
		console.error("Ошибка чтения корзины:", e);
		return [];
	}
}

export function saveCart(cart) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem("cart", JSON.stringify(cart));
	} catch (e) {
		console.error("Ошибка сохранения корзины:", e);
	}
}

export function addToCart(product) {
	const cart = getCart();

	const existing = cart.find((item) => item.id === product.id);
	if (existing) {
		existing.quantity = (existing.quantity || 1) + 1;
	} else {
		cart.push({ ...product, quantity: 1 });
	}

	saveCart(cart);
	return cart;
}

export function removeFromCart(id) {
	const cart = getCart().filter((item) => item.id !== id);
	saveCart(cart);
	return cart;
}

export function clearCart() {
	saveCart([]);
}
