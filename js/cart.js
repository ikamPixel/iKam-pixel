// Favour Collection - cart.js
// Local cart state, drawer UI, and WhatsApp checkout

const CART_KEY = 'fc_cart_v1';

const cartStore = {
	items: [],
	load() {
		try {
			const raw = localStorage.getItem(CART_KEY);
			this.items = raw ? JSON.parse(raw) : [];
		} catch {
			this.items = [];
		}
	},
	persist() {
		localStorage.setItem(CART_KEY, JSON.stringify(this.items));
	},
	add(product) {
		const existing = this.items.find(i => i.id === product.id);
		if (existing) {
			existing.qty += product.qty || 1;
		} else {
			this.items.push({ ...product, qty: product.qty || 1 });
		}
		this.persist();
		renderCart();
	},
	remove(id) {
		this.items = this.items.filter(i => i.id !== id);
		this.persist();
		renderCart();
	},
	updateQty(id, delta) {
		const item = this.items.find(i => i.id === id);
		if (!item) return;
		item.qty = Math.max(1, item.qty + delta);
		this.persist();
		renderCart();
	},
	clear() {
		this.items = [];
		this.persist();
		renderCart();
	},
	total() {
		return this.items.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);
	}
};

function getProductFromElement(triggerEl) {
	// Prefer parent product card
	const card = triggerEl.closest('[data-product-card]');
	if (card) {
		const id = card.getAttribute('data-id');
		const name = card.getAttribute('data-name');
		const price = parseFloat(card.getAttribute('data-price') || '0');
		const image = card.querySelector('img')?.getAttribute('src') || '';
		return { id, name, price, image };
	}
	// Fallback: use data attributes on the trigger itself
	const id = triggerEl.getAttribute('data-id');
	const name = triggerEl.getAttribute('data-name');
	const price = parseFloat(triggerEl.getAttribute('data-price') || '0');
	let image = '';
	const slide = triggerEl.closest('.swiper-slide, .slide');
	if (slide) {
		image = slide.querySelector('img')?.getAttribute('src') || '';
	}
	return { id, name, price, image };
}

function initCartButtons() {
	document.addEventListener('click', (e) => {
		const btn = e.target.closest('[data-add-to-cart]');
		if (!btn) return;
		const product = getProductFromElement(btn);
		if (!product?.id) return;
		cartStore.add(product);
		openCart();
	});
}

function renderCart() {
	const list = document.querySelector('[data-cart-items]');
	const empty = document.querySelector('[data-cart-empty]');
	const totalEl = document.querySelector('[data-cart-total]');
	const countEls = Array.from(document.querySelectorAll('[data-cart-count]'));
	if (!list || !empty || !totalEl) return;
	list.innerHTML = '';
	if (cartStore.items.length === 0) {
		empty.classList.remove('hide');
	} else {
		empty.classList.add('hide');
	}
	cartStore.items.forEach(item => {
		const row = document.createElement('div');
		row.className = 'cart-drawer__item';
		row.innerHTML = `
			<div class="cart-drawer__thumb"><img src="${item.image}" alt="${item.name}"></div>
			<div class="cart-drawer__info">
				<div class="cart-drawer__name">${item.name}</div>
				<div class="cart-drawer__price">₦${(item.price || 0).toLocaleString()}</div>
				<div class="cart-drawer__qty">
					<button type="button" data-qty-dec data-id="${item.id}">−</button>
					<span>${item.qty}</span>
					<button type="button" data-qty-inc data-id="${item.id}">+</button>
				</div>
			</div>
			<button class="cart-drawer__remove" type="button" data-remove-item data-id="${item.id}">Remove</button>
		`;
		list.appendChild(row);
	});
	totalEl.textContent = `₦${cartStore.total().toLocaleString()}`;
	const totalCount = cartStore.items.reduce((n, i) => n + i.qty, 0);
	countEls.forEach(c => c.textContent = String(totalCount));
}

function initCartDrawer() {
	const drawer = document.querySelector('[data-cart-drawer]');
	const openBtns = Array.from(document.querySelectorAll('[data-cart-open]'));
	const closeBtn = document.querySelector('[data-cart-close]');
	const overlay = document.querySelector('[data-cart-overlay]');
	if (!drawer) return;
	openBtns.forEach(b => b.addEventListener('click', openCart));
	if (closeBtn) closeBtn.addEventListener('click', closeCart);
	if (overlay) overlay.addEventListener('click', closeCart);

	document.addEventListener('click', (e) => {
		const dec = e.target.closest('[data-qty-dec]');
		const inc = e.target.closest('[data-qty-inc]');
		const rm = e.target.closest('[data-remove-item]');
		if (dec) cartStore.updateQty(dec.getAttribute('data-id'), -1);
		if (inc) cartStore.updateQty(inc.getAttribute('data-id'), +1);
		if (rm) cartStore.remove(rm.getAttribute('data-id'));
	});
}

function openCart() {
	const drawer = document.querySelector('[data-cart-drawer]');
	if (drawer) drawer.classList.add('is-open');
}
function closeCart() {
	const drawer = document.querySelector('[data-cart-drawer]');
	if (drawer) drawer.classList.remove('is-open');
}

function openWhatsAppWithCart() {
	if (cartStore.items.length === 0) return;
	const lines = cartStore.items.map(i => `• ${i.name} (x${i.qty}) - ₦${(i.price||0).toLocaleString()}`);
	const total = `Total: ₦${cartStore.total().toLocaleString()}`;
	const intro = 'Hello Favour Collection, I would like to buy:';
	const contact = 'Name: ____  |  Phone: ____';
	const message = encodeURIComponent([intro, '', ...lines, '', total, '', contact].join('\n'));
	const phone = '2349024900729'; // WhatsApp international format without +
	const url = `https://wa.me/${phone}?text=${message}`;
	window.open(url, '_blank');
}

function initCheckout() {
	const checkoutBtn = document.querySelector('[data-checkout]');
	if (!checkoutBtn) return;
	checkoutBtn.addEventListener('click', () => {
		openWhatsAppWithCart();
	});
}

function initBuyNow() {
	document.addEventListener('click', (e) => {
		const btn = e.target.closest('[data-buy-now]');
		if (!btn) return;
		const product = getProductFromElement(btn);
		if (product?.id) cartStore.add(product);
		openWhatsAppWithCart();
	});
}

window.addEventListener('DOMContentLoaded', () => {
	cartStore.load();
	initCartButtons();
	initCartDrawer();
	initCheckout();
	initBuyNow();
	renderCart();
	window.FCCart = cartStore; // for quick debugging
});