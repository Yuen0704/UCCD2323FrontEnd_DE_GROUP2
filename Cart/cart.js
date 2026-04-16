/* ── Read / save cart ────────────────────────────────────── */

function readCart() {
  /* Read cart array from localStorage */
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  /* Write updated cart back to localStorage and refresh header badge */
  localStorage.setItem("cart", JSON.stringify(cart)); // LOCALSTORAGE
  updateBadges(); // from shared.js — refreshes cart icon count in navbar
}

/* ── Calculate total price ───────────────────────────────── */

function calcTotal(cart) {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

/* ── Render cart ─────────────────────────────────────────── */

function renderCart() {
  const cart      = readCart();
  const emptyEl   = document.getElementById("cartEmpty");
  const contentEl = document.getElementById("cartContent");
  const rowsEl    = document.getElementById("cartRows");

  if (cart.length === 0) {
    /* Show empty state */
    emptyEl.style.display   = "block";
    contentEl.style.display = "none";
    return;
  }

  emptyEl.style.display   = "none";
  contentEl.style.display = "block";
  rowsEl.innerHTML = "";

  cart.forEach((item, index) => {
    const subtotal = (item.price * item.qty).toFixed(2);

    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `

      <!-- Game info: thumbnail + name -->
      <div class="cart-game-info">
        <img src="${item.image}" alt="${item.title}" class="cart-game-thumb">
        <div>
          <div class="cart-game-name">${item.title}</div>
          <div class="cart-game-unit">RM ${item.price.toFixed(2)} each</div>
        </div>
      </div>

      <!-- Unit price -->
      <div class="cart-price-cell">RM ${item.price.toFixed(2)}</div>

      <!-- Quantity stepper: − number + -->
      <div class="qty-stepper">
        <button class="qty-btn js-qty-dec" data-index="${index}" title="Decrease">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn js-qty-inc" data-index="${index}" title="Increase">+</button>
      </div>

      <!-- Row subtotal -->
      <div class="cart-subtotal-cell">RM ${subtotal}</div>

      <!-- Remove button -->
      <button class="cart-remove-btn js-remove-item" data-index="${index}" title="Remove item">
        <i class="bi bi-trash3"></i>
      </button>
    `;

    rowsEl.appendChild(row);
  });

  /* Update summary panel */
  const total = calcTotal(cart).toFixed(2);
  document.getElementById("summarySubtotal").textContent = `RM ${total}`;
  document.getElementById("summaryTotal").textContent    = `RM ${total}`;
}

/* ── Events ──────────────────────────────────────────────── */

/* Increase quantity */
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".js-qty-inc");
  if (!btn) return;
  const cart = readCart();
  const i    = parseInt(btn.dataset.index);
  cart[i].qty += 1;
  saveCart(cart);
  renderCart();
});

/* Decrease quantity (removes item when reaches 0) */
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".js-qty-dec");
  if (!btn) return;
  const cart = readCart();
  const i    = parseInt(btn.dataset.index);
  cart[i].qty -= 1;
  if (cart[i].qty <= 0) cart.splice(i, 1); // remove if qty hits 0
  saveCart(cart);
  renderCart();
});

/* Remove item entirely */
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".js-remove-item");
  if (!btn) return;
  const cart  = readCart();
  const i     = parseInt(btn.dataset.index);
  const title = cart[i].title;
  cart.splice(i, 1);
  saveCart(cart);
  renderCart();
  showToast(`"${title}" removed from cart.`);
});

/* Clear all items */
document.getElementById("clearCartBtn")?.addEventListener("click", function () {
  if (!confirm("Remove all items from your cart?")) return;
  saveCart([]);
  renderCart();
  showToast("Cart cleared.");
});

/* Checkout button — frontend demo, no real payment */
document.getElementById("checkoutBtn")?.addEventListener("click", function () {
  const user = getCookie("username"); // read COOKIE from shared.js

  if (!user) {
    /* Not logged in — ask them to login first */
    showToast("Please log in to checkout.", "error");
    document.getElementById("authModal").style.display = "flex";
    return;
  }

  /* Simulate a successful order */
  showToast(`Order placed! Thank you, ${user}! 🎉`);

  /* In a real project: send cart data to a server here.
     For this demo: clear the cart after a short delay. */
  setTimeout(() => {
    saveCart([]);
    renderCart();
  }, 2200);
});

/* ── Init on page load ───────────────────────────────────── */
document.addEventListener("DOMContentLoaded", renderCart);
