/**
 * favourite.js
 * ============
 * Handles the Favourites page.
 *
 * STORAGE USED:
 *   localStorage "favorites"  → array of game name keys  e.g. ["ZeldaBOTW","MarioOdyssey"]
 *   localStorage "cart"       → array of cart item objects
 *
 * HOW FAVOURITES WORK:
 *   1. Your existing games.js / game-details.js writes to localStorage "favorites"
 *      when the user clicks the heart button.
 *   2. This page reads that same key and shows the saved games.
 *   3. No data is duplicated — both pages share one localStorage entry.
 */

/* ── Game data ──────────────────────────────────────────────
   Must match the game names and prices in your games.js.
   Add price / salePrice / stock here.
────────────────────────────────────────────────────────── */
const GAME_DATA = {
  AnimalCrossing: {
    title: "Animal Crossing: New Horizons",
    genre: "Simulation",
    rating: 4.8,
    price: 249,
    salePrice: 199,   // discounted — shows strikethrough on original
    stock: 12,
    image: "images/AC_image1.png"
  },
  PicoPark: {
    title: "PICO PARK",
    genre: "Puzzle",
    rating: 4.6,
    price: 89,
    salePrice: null,  // no sale
    stock: 5,
    image: "images/PP_image1.jpg"
  },
  Overcooked2: {
    title: "Overcooked! 2",
    genre: "Party",
    rating: 4.5,
    price: 129,
    salePrice: null,
    stock: 0,         // out of stock — Add to Cart will be disabled
    image: "images/O2_image1.webp"
  },
  MarioOdyssey: {
    title: "Super Mario Odyssey",
    genre: "Platformer",
    rating: 4.9,
    price: 219,
    salePrice: 179,
    stock: 8,
    image: "images/SMO_image1.avif"
  },
  ZeldaBOTW: {
    title: "Zelda: Breath of the Wild",
    genre: "Adventure",
    rating: 5.0,
    price: 269,
    salePrice: null,
    stock: 3,
    image: "images/ZB_image1.jpg"
  },
  SwitchSports: {
    title: "Nintendo Switch Sports",
    genre: "Sports",
    rating: 4.4,
    price: 199,
    salePrice: null,
    stock: 20,
    image: "images/NSS_image1.jpg"
  }
};

/* ── Read / save favourites ─────────────────────────────── */

function readFavs() {
  /* Get the favourites array from localStorage */
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavs(list) {
  /* Write the updated favourites array back to localStorage */
  localStorage.setItem("favorites", JSON.stringify(list)); // LOCALSTORAGE
  updateBadges();  // refresh the heart badge count in the navbar (from shared.js)
}

/* ── Add to cart ─────────────────────────────────────────── */

function addToCart(gameKey) {
  const game = GAME_DATA[gameKey];
  if (!game || game.stock === 0) {
    showToast("This game is out of stock.", "error");
    return;
  }

  /* Read current cart from localStorage */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.game === gameKey);
  if (existing) {
    /* Item already in cart — just increase quantity */
    existing.qty += 1;
  } else {
    /* New item — add it */
    cart.push({
      game:  gameKey,
      title: game.title,
      image: game.image,
      price: game.salePrice || game.price,  // use sale price if available
      qty:   1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart)); // LOCALSTORAGE
  updateBadges(); // refresh cart badge in navbar
  showToast(`"${game.title}" added to cart! 🛒`);
}

/* ── Build price HTML ────────────────────────────────────── */

function buildPriceHtml(game) {
  let html = '<div class="fav-price-row">';
  if (game.salePrice) {
    /* Show original crossed out + sale price + SALE badge */
    html += `<span class="price-original">RM ${game.price}</span>
             <span class="price-sale">RM ${game.salePrice}</span>
             <span class="fav-sale-badge">SALE</span>`;
  } else {
    html += `<span class="price-normal">RM ${game.price}</span>`;
  }
  html += '</div>';

  /* Stock badge */
  html += game.stock > 0
    ? `<div class="stock-in mb-2"><i class="bi bi-check-circle-fill me-1"></i>In Stock (${game.stock})</div>`
    : `<div class="stock-out mb-2"><i class="bi bi-x-circle-fill me-1"></i>Out of Stock</div>`;

  return html;
}

/* ── Render all favourite cards ──────────────────────────── */

function renderFavourites() {
  const keys  = readFavs();                                        // e.g. ["ZeldaBOTW","MarioOdyssey"]
  const games = keys.map(k => ({ key: k, ...GAME_DATA[k] }))     // attach game data
                    .filter(g => g.title);                        // skip unknown keys

  /* Update count label */
  document.getElementById("favTotalCount").textContent = games.length;

  const grid     = document.getElementById("favGrid");
  const emptyMsg = document.getElementById("favEmpty");

  if (games.length === 0) {
    /* Show empty state, hide grid */
    grid.innerHTML        = "";
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";
  grid.innerHTML = "";

  games.forEach(game => {
    const outOfStock = game.stock === 0;

    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6 fade-in";

    col.innerHTML = `
      <div class="fav-card">
        <img src="${game.image}" alt="${game.title}" class="fav-card-img">

        <div class="fav-card-body">
          <h3 class="fav-card-title">${game.title}</h3>

          <div class="fav-card-meta">
            <span class="fav-genre-badge">${game.genre}</span>
            <span class="fav-rating-badge">⭐ ${game.rating}/5</span>
          </div>

          ${buildPriceHtml(game)}

          <div class="fav-btn-group">

            <!-- Add to Cart: disabled when out of stock -->
            <button class="fav-cart-btn js-add-cart" data-key="${game.key}" ${outOfStock ? "disabled" : ""}>
              <i class="bi bi-cart-plus"></i>
              ${outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <!-- View details page -->
            <a href="game-details.html?game=${game.key}" class="fav-details-btn">
              <i class="bi bi-info-circle"></i> Details
            </a>

            <!-- Remove from favourites -->
            <button class="fav-remove-btn js-remove-fav" data-key="${game.key}">
              <i class="bi bi-heart-slash"></i> Remove
            </button>

          </div>
        </div>
      </div>
    `;

    grid.appendChild(col);
  });
}

/* ── Events ──────────────────────────────────────────────── */

/* Add to cart button inside cards */
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".js-add-cart");
  if (btn) addToCart(btn.dataset.key);
});

/* Remove from favourites button */
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".js-remove-fav");
  if (!btn) return;
  const key  = btn.dataset.key;
  const game = GAME_DATA[key];
  saveFavs(readFavs().filter(k => k !== key)); // remove and save
  renderFavourites();
  showToast(`"${game ? game.title : key}" removed from favourites.`);
});

/* Clear all favourites button */
document.getElementById("clearAllFavBtn")?.addEventListener("click", function () {
  if (!confirm("Remove all favourites?")) return;
  saveFavs([]);
  renderFavourites();
  showToast("All favourites cleared.");
});

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", renderFavourites);
