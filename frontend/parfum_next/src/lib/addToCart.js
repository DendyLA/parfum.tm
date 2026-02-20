// lib/cart.js
export function getCart() {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(localStorage.getItem("cart")) || [];
	} catch {
		return [];
	}
}

export function saveCart(cart) {
	if (typeof window === "undefined") return;
	localStorage.setItem("cart", JSON.stringify(cart));
}

// 🔑 ключ товара = product_id + variation_id
function makeKey(productId, variationId) {
	return variationId ? `${productId}-${variationId}` : `${productId}`;
}

export function addToCart(product, locale = "ru") {
	if (!product?.id) return getCart();

	const cart = getCart();
	const variationId = product.selectedVariation?.id || null;
	const key = makeKey(product.id, variationId);

	const existing = cart.find(item => item._key === key);

	if (existing) {
		existing.quantity += 1; // ✅ увеличиваем
	} else {
		cart.push({
			_key: key,
			product_id: product.id,
			variation_id: variationId,
			variation_label: product.selectedVariation?.value || null,
			variation_color: product.selectedVariation?.color_hex || null,
			name: product.translations?.[locale]?.name || product.name || "Нет имени",
			translations: product.translations || {},
			price: product.discount_price || product.price || 0,
			image: product.image || "/placeholder.png",
			category_name: product.category?.translations?.[locale]?.name || product.category?.name || "Нет категории",
			category: product.category || {},
			quantity: 1,
		});
	}

	saveCart(cart);
	return cart;
}

export function removeFromCart(key) {
	const cart = getCart().filter(item => item._key !== key);
	saveCart(cart);
	return cart;
}

export function updateQuantity(key, qty) {
	const cart = getCart()
		.map(item => (item._key === key ? { ...item, quantity: qty } : item))
		.filter(item => item.quantity > 0);
	saveCart(cart);
	return cart;
}

export function clearCart() {
	saveCart([]);
}

export function getCartCount() {
	return getCart().reduce((sum, item) => sum + item.quantity, 0);
}
