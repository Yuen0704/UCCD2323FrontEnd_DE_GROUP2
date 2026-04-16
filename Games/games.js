$(document).ready(function () {

  /* ── GAME DATA (price + stock added) ──────────────────── */
  const games = [
    {
      name: "AnimalCrossing",
      title: "Animal Crossing: New Horizons",
      genre: "Simulation",
      description: "Build your dream island and enjoy a relaxing life with adorable villagers.",
      images: [
        "images/AC_image1.png",
        "images/AC_image2.webp",
        "images/AC_image3.jpg"
      ],
      rating: 4.8, year: 2020,
      price: 249, salePrice: 199, stock: 12
    },
    {
      name: "PicoPark",
      title: "PICO PARK",
      genre: "Puzzle",
      description: "A fun cooperative puzzle game where teamwork is the key to success.",
      images: [
        "images/PP_image1.jpg",
        "images/PP_image2.png",
        "images/PP_image3.png"
      ],
      rating: 4.6, year: 2021,
      price: 89, salePrice: null, stock: 5
    },
    {
      name: "Overcooked2",
      title: "Overcooked! 2",
      genre: "Party",
      description: "Work together in chaotic kitchens and serve dishes under pressure.",
      images: [
        "images/O2_image1.webp",
        "images/O2_image2.webp",
        "images/O2_image3.jpg"
      ],
      rating: 4.5, year: 2018,
      price: 129, salePrice: null, stock: 0
    },
    {
      name: "MarioOdyssey",
      title: "Super Mario Odyssey",
      genre: "Platformer",
      description: "Join Mario on an exciting 3D globe-trotting adventure full of surprises.",
      images: [
        "images/SMO_image1.avif",
        "images/SMO_image2.jpg",
        "images/SMO_image3.webp"
      ],
      rating: 4.9, year: 2017,
      price: 219, salePrice: 179, stock: 8
    },
    {
      name: "ZeldaBOTW",
      title: "Zelda: Breath of the Wild",
      genre: "Adventure",
      description: "Explore the vast kingdom of Hyrule in this award-winning open-world adventure.",
      images: [
        "images/ZB_image1.jpg",
        "images/ZB_image2.avif",
        "images/ZB_image3.jpg"
      ],
      rating: 5.0, year: 2017,
      price: 269, salePrice: null, stock: 3
    },
    {
      name: "SwitchSports",
      title: "Nintendo Switch Sports",
      genre: "Sports",
      description: "Play exciting sports activities with motion controls and friends or family.",
      images: [
        "images/NSS_image1.jpg",
        "images/NSS_image2.png",
        "images/NSS_image3.webp"
      ],
      rating: 4.4, year: 2022,
      price: 199, salePrice: null, stock: 20
    }
  ];

  /* ── STATE (read from storage on page load) ───────────── */
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  // sessionStorage: compare list resets when the tab is closed
  let compareList = JSON.parse(sessionStorage.getItem("compareList")) || [];

  let isDark = localStorage.getItem("darkMode") === "true";

  /* ── DARK MODE ────────────────────────────────────────── */
  function applyTheme() {
    $("html").attr("data-theme", isDark ? "dark" : "light");
    $("#themeIcon").removeClass("bi-moon-fill bi-sun-fill")
      .addClass(isDark ? "bi-sun-fill" : "bi-moon-fill");
  }
  applyTheme();

  $("#darkModeToggle").on("click", function () {
    isDark = !isDark;
    localStorage.setItem("darkMode", String(isDark));
    applyTheme();
  });

  /* ── STAR GENERATOR ───────────────────────────────────── */
  function generateStars(rating) {
    const full = Math.floor(rating), half = rating % 1 !== 0;
    let s = '';
    for (let i = 0; i < full; i++)             s += '<i class="bi bi-star-fill"></i>';
    if (half) s += '<i class="bi bi-star-half"></i>';
    for (let i = full + (half ? 1 : 0); i < 5; i++)   s += '<i class="bi bi-star"></i>';
    return s;
  }

  /* ── PRICE HTML BUILDER ───────────────────────────────── */
  function buildPriceHtml(game) {
    let html = '<div class="card-price-row">';
    if (game.salePrice) {
      html += `<span class="price-original">RM ${game.price}</span>
               <span class="price-sale">RM ${game.salePrice}</span>
               <span class="sale-badge">SALE</span>`;
    } else {
      html += `<span class="price-normal">RM ${game.price}</span>`;
    }
    html += '</div>';
    html += game.stock > 0
      ? `<div class="stock-in mb-2"><i class="bi bi-check-circle-fill me-1"></i>In Stock (${game.stock})</div>`
      : `<div class="stock-out mb-2"><i class="bi bi-x-circle-fill me-1"></i>Out of Stock</div>`;
    return html;
  }

  /* ── ADD TO CART (localStorage) ──────────────────────── */
  function addToCart(gameName) {
    const game = games.find(g => g.name === gameName);
    if (!game || game.stock === 0) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.game === gameName);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        game: game.name,
        title: game.title,
        image: game.images[0],
        price: game.salePrice || game.price,
        qty: 1
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart)); // LOCALSTORAGE
    updateBadges();  // from shared.js — refreshes cart badge count in navbar
    showToast(`"${game.title}" added to cart! 🛒`);
  }

  /* ── CAROUSEL BUILDER ─────────────────────────────────── */
  function buildCarousel(game) {
    const slides = game.images.map(img =>
      `<div class="carousel-slide"><img src="${img}" alt="${game.title}" loading="lazy"></div>`
    ).join('');
    const dots = game.images.map((_, i) =>
      `<span class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');
    return `
      <div class="carousel-wrap">
        <div class="carousel-track" data-current="0">${slides}</div>
        <button class="carousel-btn prev"><i class="bi bi-chevron-left"></i></button>
        <button class="carousel-btn next"><i class="bi bi-chevron-right"></i></button>
        <div class="carousel-dots">${dots}</div>
        <div class="quick-view-overlay">
          <button class="quick-view-btn" data-game="${game.name}">
            <i class="bi bi-eye"></i> Quick View
          </button>
        </div>
      </div>`;
  }

  /* ── CARD BUILDER ─────────────────────────────────────── */
  function buildCard(game, extraBadge = '') {
    const isFav = favorites.includes(game.name);
    const isComparing = compareList.includes(game.name);
    const outOfStock = game.stock === 0;
    return `
      <div class="game-card">
        ${extraBadge}
        <div class="compare-check-wrap" title="Add to compare (sessionStorage)">
          <input type="checkbox" class="compare-check"
                 data-game="${game.name}" ${isComparing ? 'checked' : ''}>
        </div>
        ${buildCarousel(game)}
        <div class="game-card-body">
          <h3 class="game-title">${game.title}</h3>
          <div class="game-meta">
            <span class="genre-badge">${game.genre}</span>
            <span class="rating-display">⭐ ${game.rating}</span>
            <span class="year-display">${game.year}</span>
          </div>
          <div class="star-rating mb-1">${generateStars(game.rating)}</div>
          ${buildPriceHtml(game)}
          <p class="game-desc">${game.description}</p>
          <div class="card-button-group">
            <button class="fav-btn ${isFav ? 'active-fav' : ''}" data-game="${game.name}">
              <i class="bi ${isFav ? 'bi-heart-fill' : 'bi-heart'}"></i>
              ${isFav ? 'Saved' : 'Favourite'}
            </button>
            <button class="cart-btn" data-game="${game.name}" ${outOfStock ? 'disabled' : ''}>
              <i class="bi bi-cart-plus"></i>
              ${outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <a href="game-details.html?game=${game.name}" class="details-btn">
              <i class="bi bi-info-circle"></i> Details
            </a>
          </div>
        </div>
      </div>`;
  }

  /* ── ANIMATED COUNTER ─────────────────────────────────── */
  function animateCounter(target) {
    const $el = $("#resultCount");
    const current = parseInt($el.text()) || 0;
    if (current === target) return;
    $({ val: current }).animate({ val: target }, {
      duration: 400, easing: 'swing',
      step: function () { $el.text(Math.ceil(this.val)); },
      complete: function () { $el.text(target); }
    });
  }

  /* ── RENDER MAIN GRID ─────────────────────────────────── */
  function renderGames(keyword = "", genre = "All", sort = "default") {
    let filtered = games.filter(g =>
      g.title.toLowerCase().includes(keyword.toLowerCase()) &&
      (genre === "All" || g.genre === genre)
    );

    const ep = g => g.salePrice || g.price; // effective price for sorting
    if (sort === "rating-desc") filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === "rating-asc") filtered.sort((a, b) => a.rating - b.rating);
    else if (sort === "price-asc") filtered.sort((a, b) => ep(a) - ep(b));
    else if (sort === "price-desc") filtered.sort((a, b) => ep(b) - ep(a));
    else if (sort === "year-desc") filtered.sort((a, b) => b.year - a.year);
    else if (sort === "year-asc") filtered.sort((a, b) => a.year - b.year);

    animateCounter(filtered.length);
    $("#gameContainer").empty();

    if (filtered.length === 0) {
      $("#gameContainer").html(`
        <div class="col-12 no-results">
          <i class="bi bi-controller"></i>
          <p>No games found matching your search.</p>
        </div>`);
      return;
    }

    filtered.forEach((game, i) => {
      const $col = $(`<div class="col-lg-4 col-md-6 fade-in"></div>`);
      $col.css("animation-delay", (i * 0.07) + "s");
      $col.html(buildCard(game));
      $("#gameContainer").append($col);
    });
  }

  /* ── TOP RATED (skeleton → real cards after 900ms) ───── */
  function renderTopRated() {
    const top3 = [...games].sort((a, b) => b.rating - a.rating).slice(0, 3);
    setTimeout(function () {
      // Remove all skeleton placeholders from this container
      $("#topRatedContainer").empty();
      top3.forEach(function (game, i) {
        const $col = $(`<div class="col-lg-4 col-md-6 fade-in"></div>`);
        $col.css("animation-delay", (i * 0.1) + "s");
        $col.html(buildCard(game, `<div class="featured-badge"><i class="bi bi-fire"></i> Top Rated</div>`));
        $("#topRatedContainer").append($col);
      });
    }, 900);
  }

  /* ── NEW RELEASES (skeleton → real cards after 1200ms) ── */
  function renderNewReleases() {
    const new3 = [...games].sort((a, b) => b.year - a.year).slice(0, 3);
    setTimeout(function () {
      $("#newReleasesContainer").empty();
      new3.forEach(function (game, i) {
        const $col = $(`<div class="col-lg-4 col-md-6 fade-in"></div>`);
        $col.css("animation-delay", (i * 0.1) + "s");
        $col.html(buildCard(game, `<div class="featured-badge new-rel-badge"><i class="bi bi-stars"></i> New</div>`));
        $("#newReleasesContainer").append($col);
      });
    }, 1200);
  }

  /* ── RECENTLY VIEWED (localStorage) ──────────────────── */
  function addRecentlyViewed(name) {
    recentlyViewed = recentlyViewed.filter(n => n !== name);
    recentlyViewed.unshift(name);
    if (recentlyViewed.length > 4) recentlyViewed = recentlyViewed.slice(0, 4);
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed)); // LOCALSTORAGE
    renderRecentlyViewed();
  }

  function renderRecentlyViewed() {
    if (recentlyViewed.length === 0) { $("#recentlyViewedSection").hide(); return; }
    $("#recentlyViewedSection").show();
    $("#recentlyViewedContainer").empty();
    recentlyViewed.forEach(function (name) {
      const game = games.find(g => g.name === name);
      if (!game) return;
      const $col = $('<div class="col-lg-3 col-md-6"></div>');
      $col.html(`
        <div class="mini-card" data-game="${game.name}">
          <img src="${game.images[0]}" alt="${game.title}">
          <div>
            <div class="mini-card-title">${game.title}</div>
            <div class="mini-card-genre">${game.genre} · ${game.rating}⭐</div>
          </div>
        </div>`);
      $("#recentlyViewedContainer").append($col);
    });
  }

  /* ── QUICK VIEW MODAL ─────────────────────────────────── */
  function openQuickView(gameName) {
    const game = games.find(g => g.name === gameName);
    if (!game) return;
    addRecentlyViewed(gameName);
    $("#qvImage").attr("src", game.images[0]);
    $("#qvGenre").text(game.genre);
    $("#qvTitle").text(game.title);
    $("#qvStars").html(generateStars(game.rating));
    $("#qvYear").text(game.year);
    $("#qvRating").text(game.rating);
    $("#qvDesc").text(game.description);
    $("#qvDetailsLink").attr("href", `game-details.html?game=${game.name}`);
    // Price in modal
    let priceHtml = game.salePrice
      ? `<span class="price-original me-2">RM ${game.price}</span><span class="price-sale">RM ${game.salePrice}</span>`
      : `<span class="price-normal">RM ${game.price}</span>`;
    $("#qvPrice").html(priceHtml);
    // Cart button state
    const outOfStock = game.stock === 0;
    $("#qvCartBtn").prop("disabled", outOfStock).data("game", gameName)
      .html(outOfStock
        ? '<i class="bi bi-x-circle me-1"></i>Out of Stock'
        : '<i class="bi bi-cart-plus me-1"></i>Add to Cart');
    new bootstrap.Modal(document.getElementById("quickViewModal")).show();
  }

  // Cart button inside quick view modal
  $(document).on("click", "#qvCartBtn", function () {
    addToCart($(this).data("game"));
  });

  /* ── COMPARE (sessionStorage) ─────────────────────────── */
  function saveCompareList() {
    sessionStorage.setItem("compareList", JSON.stringify(compareList)); // SESSIONSTORAGE
  }

  function updateCompareBar() {
    if (compareList.length === 0) { $("#compareBar").hide(); return; }
    $("#compareBar").show();
    $("#compareCount").text(compareList.length);
    $("#compareBtn").prop("disabled", compareList.length < 2);
    const chips = compareList.map(name => {
      const g = games.find(g => g.name === name);
      return `<span class="compare-name-chip">${g ? g.title : name}</span>`;
    }).join('');
    $("#compareNames").html(chips);
  }

  function openCompareModal() {
    if (compareList.length < 2) return;
    const [a, b] = compareList.map(name => games.find(g => g.name === name));
    const ratingWin = a.rating >= b.rating;
    const priceA = a.salePrice || a.price, priceB = b.salePrice || b.price;
    const priceWinA = priceA <= priceB;

    const col = (game, isA) => `
      <div class="col-md-6">
        <div class="compare-col">
          <img src="${game.images[0]}" alt="${game.title}" class="compare-img">
          <div class="compare-body">
            <h4 style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:1px;color:var(--text);margin-bottom:14px;">${game.title}</h4>
            <div class="compare-row"><span class="compare-label">Genre</span><span class="compare-val">${game.genre}</span></div>
            <div class="compare-row">
              <span class="compare-label">Rating</span>
              <span class="compare-val ${isA ? (ratingWin ? 'compare-winner' : '') : (!ratingWin ? 'compare-winner' : '')}">${game.rating}/5 ⭐</span>
            </div>
            <div class="compare-row">
              <span class="compare-label">Price</span>
              <span class="compare-val ${isA ? (priceWinA ? 'compare-winner' : '') : (!priceWinA ? 'compare-winner' : '')}">RM ${game.salePrice || game.price}</span>
            </div>
            <div class="compare-row"><span class="compare-label">Year</span><span class="compare-val">${game.year}</span></div>
            <div class="compare-row"><span class="compare-label">Stock</span><span class="compare-val">${game.stock > 0 ? game.stock + ' units' : 'Out of Stock'}</span></div>
          </div>
        </div>
      </div>`;
    $("#compareContainer").html(col(a, true) + col(b, false));
    new bootstrap.Modal(document.getElementById("compareModal")).show();
  }

  /* ── CAROUSEL CLICK EVENTS ────────────────────────────── */
  $(document).on("click", ".carousel-btn.next", function (e) {
    e.stopPropagation();
    const $track = $(this).siblings(".carousel-track");
    const total = $track.children(".carousel-slide").length;
    let cur = ((parseInt($track.data("current")) || 0) + 1) % total;
    $track.data("current", cur).css("transform", `translateX(-${cur * 100}%)`);
    $track.siblings(".carousel-dots").find(".carousel-dot").removeClass("active").eq(cur).addClass("active");
  });

  $(document).on("click", ".carousel-btn.prev", function (e) {
    e.stopPropagation();
    const $track = $(this).siblings(".carousel-track");
    const total = $track.children(".carousel-slide").length;
    let cur = ((parseInt($track.data("current")) || 0) - 1 + total) % total;
    $track.data("current", cur).css("transform", `translateX(-${cur * 100}%)`);
    $track.siblings(".carousel-dots").find(".carousel-dot").removeClass("active").eq(cur).addClass("active");
  });

  $(document).on("click", ".carousel-dot", function (e) {
    e.stopPropagation();
    const idx = parseInt($(this).data("index"));
    const $track = $(this).closest(".carousel-wrap").find(".carousel-track");
    $track.data("current", idx).css("transform", `translateX(-${idx * 100}%)`);
    $(this).closest(".carousel-dots").find(".carousel-dot").removeClass("active").eq(idx).addClass("active");
  });

  /* ── FILTER / SORT EVENTS ─────────────────────────────── */
  function getFilters() {
    return {
      keyword: $("#searchInput").val(),
      genre: $("#genreFilter").val(),
      sort: $("#sortFilter").val()
    };
  }
  $("#searchInput").on("keyup", function () { const f = getFilters(); renderGames(f.keyword, f.genre, f.sort); });
  $("#genreFilter").on("change", function () { const f = getFilters(); renderGames(f.keyword, f.genre, f.sort); });
  $("#sortFilter").on("change", function () { const f = getFilters(); renderGames(f.keyword, f.genre, f.sort); });

  /* --- Favourite Button ---*/
 $(document).on("click", ".fav-btn", function () {
  const name = $(this).data("game");

  if (favorites.includes(name)) {
    // ❌ REMOVE from favourites
    favorites = favorites.filter(n => n !== name);

    $(`.fav-btn[data-game="${name}"]`).each(function () {
      $(this)
        .removeClass("active-fav")
        .find("i")
        .removeClass("bi-heart-fill")
        .addClass("bi-heart");

      $(this).find(".fav-text").text("Favourite");
    });

  } else {
    // ✅ ADD to favourites
    favorites.push(name);

    showToast("Added to Favourites ❤️");

    $(`.fav-btn[data-game="${name}"]`).each(function () {
      $(this)
        .addClass("active-fav")
        .find("i")
        .removeClass("bi-heart")
        .addClass("bi-heart-fill");

      $(this).find(".fav-text").text("Saved");
    });
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateBadges();
});

  /* ── CART BUTTON ──────────────────────────────────────── */
  $(document).on("click", ".cart-btn", function () {
    addToCart($(this).data("game"));
  });

  /* ── QUICK VIEW BUTTON ────────────────────────────────── */
  $(document).on("click", ".quick-view-btn", function (e) {
    e.stopPropagation();
    openQuickView($(this).data("game"));
  });

  /* ── MINI CARD (recently viewed) → quick view ─────────── */
  $(document).on("click", ".mini-card", function () {
    openQuickView($(this).data("game"));
  });

  /* ── COMPARE CHECKBOX (sessionStorage) ───────────────── */
  $(document).on("change", ".compare-check", function () {
    const name = $(this).data("game");
    if ($(this).is(":checked")) {
      if (compareList.length >= 2) {
        $(this).prop("checked", false);
        showToast("Max 2 games to compare.", "error");
        return;
      }
      compareList.push(name);
    } else {
      compareList = compareList.filter(n => n !== name);
    }
    saveCompareList(); // writes to sessionStorage
    updateCompareBar();
  });

  $("#compareBtn").on("click", openCompareModal);
  $("#clearCompare").on("click", function () {
    compareList = [];
    saveCompareList();
    updateCompareBar();
    $(".compare-check").prop("checked", false);
  });

  /* ── INIT ─────────────────────────────────────────────── */
  $("#totalGamesCount").text(games.length);
  renderGames();
  renderTopRated();
  renderNewReleases();
  renderRecentlyViewed();
  updateCompareBar(); // 
});
