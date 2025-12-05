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

	const existing = cart.find(
		(item) =>
			item.id === product.id &&
			item.selectedVariation === product.selectedVariation
	);

	if (existing) {
		existing.quantity = (existing.quantity || 1) + 1;
	} else {
		cart.push({ ...product, quantity: 1 });
	}

	saveCart(cart);
	return cart;
}

export function removeFromCart(id, selectedVariation) {
	const cart = getCart().filter(
		(item) => item.id !== id || item.selectedVariation !== selectedVariation
	);
	saveCart(cart);
	return cart;
}


export function clearCart() {
	saveCart([]);
}


export function getCartCount() {
	const cart = getCart();
	return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
}
