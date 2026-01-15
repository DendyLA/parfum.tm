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

// сравниваем selectedVariation по JSON
function isSameVariation(a, b) {
	if (!a && !b) return true;
	if (!a || !b) return false;
	return JSON.stringify(a) === JSON.stringify(b);
}

// Генерируем уникальный идентификатор для вариации
function getVariationKey(product) {
	if (!product.selectedVariation) return product.id;
	return `${product.id}-${product.selectedVariation.id || product.selectedVariation.value}`;
}

export function addToCart(product) {
	const cart = getCart();

	const existing = cart.find(
		(item) =>
			item.id === product.id &&
			isSameVariation(item.selectedVariation, product.selectedVariation)
	);

	if (existing) {
		existing.quantity = (existing.quantity || 1) + 1;
	} else {
		cart.push({ ...product, quantity: 1, _key: getVariationKey(product) });
	}

	saveCart(cart);
	return cart;
}

export function removeFromCart(id, selectedVariation) {
	const cart = getCart().filter(
		(item) => !(item.id === id && isSameVariation(item.selectedVariation, selectedVariation))
	);
	saveCart(cart);
	return cart;
}

export function updateQuantity(id, selectedVariation, newQty) {
	const cart = getCart()
		.map(item => {
			if (item.id === id && isSameVariation(item.selectedVariation, selectedVariation)) {
				return { ...item, quantity: newQty };
			}
			return item;
		})
		.filter(item => item.quantity > 0);

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
