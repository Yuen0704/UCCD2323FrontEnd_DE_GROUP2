/* ============================================
  ACCESSORIES.JS — Nintendo Accessories Page
  Powered by jQuery 4 + Bootstrap 5
  Features: Cookie Consent, Wishlist (localStorage),
  Recently Viewed (sessionStorage), Sidebar + Mobile
  Category Filter, JS-rendered Product Grid,
  Functional Pagination, Product Detail Overlay
   ============================================ */

$(function () {

  // =======================================================
  //  UTILITY: Cookie helpers
  // =======================================================
  const Cookies = {
    set(name, value, days = 365) {
      const d = new Date();
      d.setTime(d.getTime() + days * 864e5);
      document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
    },
    get(name) {
      const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : null;
    },
    remove(name) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
  };

  function showToast(message) {
    $('#ninToastBody').text(message);
    const toast = new bootstrap.Toast($('#ninToast')[0], { delay: 2500 });
    toast.show();
  }

  // =======================================================
  //  1. COOKIE CONSENT
  // =======================================================
  if (!Cookies.get('nin_cookie_consent')) {
    $('#cookieBanner').fadeIn(400);
  }

  $('#cookieAccept').on('click', function () {
    Cookies.set('nin_cookie_consent', 'accepted', 365);
    $('#cookieBanner').fadeOut(300);
    showToast('Preferences saved. Cookies accepted.');
  });

  $('#cookieDecline').on('click', function () {
    Cookies.set('nin_cookie_consent', 'declined', 30);
    $('#cookieBanner').fadeOut(300);
    showToast('Cookies declined. Some features may be limited.');
  });

  function isStorageAllowed() {
    return Cookies.get('nin_cookie_consent') === 'accepted';
  }

  // =======================================================
  //  2. WISHLIST — localStorage
  // =======================================================
  function getWishlist() {
    try { return JSON.parse(localStorage.getItem('nin_wishlist_acc')) || []; }
    catch { return []; }
  }

  function saveWishlist(list) {
    try { localStorage.setItem('nin_wishlist_acc', JSON.stringify(list)); }
    catch (e) { console.warn('localStorage unavailable:', e); }
  }

  function updateWishlistUI() {
    const wishlist = getWishlist();

    // Sync all count badges
    $('.wishlist-count-sync').text(wishlist.length);

    // Update hearts on cards
    $('.wishlist-btn').each(function () {
      const pid = $(this).data('product-id');
      const inWishlist = wishlist.some(item => item.id === pid);
      $(this)
        .toggleClass('wishlisted', inWishlist)
        .find('i').attr('class', inWishlist ? 'bi bi-heart-fill' : 'bi bi-heart');
    });

    // Render drawer
    const $items = $('#wishlistItems');
    const $empty = $('#wishlistEmpty');
    const $footer = $('#wishlistFooter');

    if (wishlist.length === 0) {
      $empty.show(); $footer.hide(); $items.empty();
    } else {
      $empty.hide(); $footer.show(); $items.empty();
      wishlist.forEach(item => {
        $items.append(`
          <div class="wishlist-item" data-wishlist-id="${item.id}">
            <div class="wishlist-item-info">
              <div class="wishlist-item-name">${item.name}</div>
              <div class="wishlist-item-price">${item.price}</div>
            </div>
            <button class="wishlist-remove-btn" data-remove-id="${item.id}" aria-label="Remove">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        `);
      });
    }
  }

  $(document).on('click', '.wishlist-btn', function (e) {
    e.preventDefault(); e.stopPropagation();
    if (!isStorageAllowed()) { showToast('Please accept cookies to use the wishlist.'); return; }

    const $btn = $(this);
    const pid = $btn.data('product-id');
    const $card = $btn.closest('.product-card');
    const name = $card.data('product-name');
    const price = $card.data('product-price');

    let wishlist = getWishlist();
    const idx = wishlist.findIndex(i => i.id === pid);
    if (idx > -1) { wishlist.splice(idx, 1); showToast(`${name} removed from wishlist.`); }
    else { wishlist.push({ id: pid, name, price }); showToast(`${name} added to wishlist!`); }

    saveWishlist(wishlist);
    updateWishlistUI();
  });

  $(document).on('click', '.wishlist-remove-btn', function () {
    const pid = $(this).data('remove-id');
    let wishlist = getWishlist();
    const item = wishlist.find(i => i.id === pid);
    wishlist = wishlist.filter(i => i.id !== pid);
    saveWishlist(wishlist);
    updateWishlistUI();
    if (item) showToast(`${item.name} removed from wishlist.`);
  });

  $('#clearWishlist').on('click', function () {
    saveWishlist([]);
    updateWishlistUI();
    showToast('Wishlist cleared.');
  });

  updateWishlistUI();

  // =======================================================
  //  3. RECENTLY VIEWED — sessionStorage
  // =======================================================
  function getRecentlyViewed() {
    try { return JSON.parse(sessionStorage.getItem('nin_recently_viewed_acc')) || []; }
    catch { return []; }
  }

  function addRecentlyViewed(product) {
    if (!isStorageAllowed()) return;
    let viewed = getRecentlyViewed();
    viewed = viewed.filter(p => p.id !== product.id);
    viewed.unshift(product);
    viewed = viewed.slice(0, 6);
    try { sessionStorage.setItem('nin_recently_viewed_acc', JSON.stringify(viewed)); }
    catch (e) { console.warn('sessionStorage unavailable:', e); }
    renderRecentlyViewed();
  }

  function renderRecentlyViewed() {
    const viewed = getRecentlyViewed();
    const $section = $('#recentlyViewedSection');
    const $container = $('#recentlyViewedContainer');

    if (viewed.length === 0) { $section.hide(); return; }

    $section.fadeIn(300);
    $container.empty();
    viewed.forEach(p => {
      $container.append(`
        <div class="recent-chip" data-recent-id="${p.id}">
          <i class="bi bi-controller"></i>
          <span>${p.name}</span>
          <span class="recent-price">${p.price}</span>
        </div>
      `);
    });
  }

  // Click recently viewed chip → open overlay
  $(document).on('click', '.recent-chip', function () {
    const pid = $(this).data('recent-id');
    if (pid) openOverlay(pid);
  });

  renderRecentlyViewed();

  // =======================================================
  //  PRODUCT DATA CATALOG — 20 products across 5 categories
  // =======================================================
  const allProducts = [
    // ──── CONTROLLERS (6) ────
    { id: 'joycon-2', 
      name: 'Joy-Con 2 (Pair)', 
      price: 'RM 498', 
      category: 'controllers', 
      badge: 'New', 
      badgeClass: 'badge-new', 
      icon: 'bi-controller',
      image: '/Accessories/Images/Nintendo Joy Con Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo Joy Con Image 2.png',
      desc: 'Magnetic attach, built-in optical sensor for mouse-style input, HD Rumble, IR Motion Camera. Available in Neon Red/Blue.',
      description: 'The Joy-Con 2 represents a complete reimagining of Nintendo\'s iconic controllers. Featuring magnetic attachment for effortless connection, a built-in optical sensor that enables mouse-like cursor control, enhanced HD Rumble for more immersive haptics, and an improved IR Motion Camera.',
      specs: ['Magnetic rail attachment system','Built-in optical sensor for mouse-style precision','Enhanced HD Rumble','Hall-effect joysticks — zero drift','USB-C charging, ~20hr battery life','NFC touchpoint for amiibo','Available in Neon Red / Neon Blue']
    },
    { id: 'pro-controller', 
      name: 'Switch 2 Pro Controller', 
      price: 'RM 388', 
      category: 'controllers', 
      badge: 'Best Seller', 
      badgeClass: 'badge-popular', 
      icon: 'bi-dpad',
      image: '/Accessories/Images/Nintendo Switch 2 Pro Controller Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo Switch 2 Pro Controller Image 2.png',
      desc: 'Hall-effect analog sticks, HD Rumble, NFC amiibo reader, USB-C charging, 60-hour battery. Built for marathon sessions.',
      description: 'Engineered for marathon gaming sessions. The Switch 2 Pro Controller features hall-effect analog sticks that eliminate stick drift, HD Rumble, a built-in NFC reader for amiibo, and a massive 60-hour rechargeable battery.',
      specs: ['Hall-effect analog sticks — zero drift','HD Rumble for immersive feedback','NFC amiibo reader built-in','USB-C fast charging — 60hr battery','Motion controls with gyroscope &amp; accelerometer','Ergonomic textured grip','Compatible with Switch 2 &amp; original Switch'] 
    },
    { id: 'joycon-wheel', 
      name: 'Joy-Con Wheel (Pair)', 
      price: 'RM 108', 
      category: 'controllers', 
      badge: '', 
      badgeClass: '', 
      icon: 'bi-circle',
      image: '/Accessories/Images/Nintendo Joy Con Wheel Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo Joy Con Wheel Image 2.png',
      desc: 'Snap your Joy-Con into this wheel-shaped grip for intuitive steering in racing games. Lightweight and ergonomic.',
      description: 'Transform your Joy-Con into a racing wheel. The Joy-Con Wheel provides an ergonomic steering grip that makes racing games feel natural and intuitive. Simply slide your Joy-Con into the housing and steer your way to victory.',
      specs: ['Ergonomic wheel-shaped grip','Slide-in Joy-Con housing','Lightweight — only 56g per wheel','Pair of 2 included','Compatible with Joy-Con 2 &amp; original Joy-Con','Perfect for Mario Kart World','No batteries or charging required'] 
    },
    { id: 'joycon-grip',
      name: 'Joy-Con2 Charging Grip',
      price: 'RM 183',
      category: 'controllers',
      badge: '',
      badgeClass: '',
      icon: 'bi-hand-index-thumb',
      image: '/Accessories/Images/Nintendo Joy Con Grip Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo Joy Con Grip Image 2.png',
      desc: 'Charging grip that powers your Joy-Con while you play. Combines two Joy-Con controllers with USB-C charging support.',
      description: 'The Joy-Con2 Charging Grip allows you to attach two Joy-Con controllers and charge them simultaneously while playing. Simply connect via USB-C to a Nintendo Switch dock or any USB power source. The ergonomic design with textured grips ensures comfortable long gaming sessions without worrying about battery life.',
      specs: ['Combines 2 Joy-Cons into traditional layout','USB-C charging port for simultaneous charging','Charge while playing in TV or tabletop mode','Textured rubberized handles for comfort','Compatible with Joy-Con2 and original Joy-Con','LED indicators for charging status','Includes USB-C cable (sold separately on some models)']
    },
    { 
      id: 'gamecube-controller', 
      name: 'GameCube Controller', 
      price: 'Discontinued', 
      category: 'controllers', 
      badge: 'Retro', 
      badgeClass: 'badge-promo', 
      icon: 'bi-joystick',
      image: '/Accessories/Images/Nintendo Game Cube Controller Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo Game Cube Controller Image 2.png',
      desc: 'Official-style GameCube controller with iconic button layout. Perfect for Super Smash Bros. and retro gaming.',
      description: 'The Nintendo GameCube Controller features the legendary button layout that defined a generation. With its oversized A button, unique C-stick, analog triggers, and comfortable grip, it remains the preferred choice for competitive Super Smash Bros. players and retro enthusiasts. Wired connection ensures lag-free performance.',
      specs: ['Iconic GameCube button layout','Oversized A button with unique B, X, Y arrangement','Analog L/R triggers with digital click','C-stick for camera or smash attacks','Wired USB connection (Switch compatible)','Ergonomic handle design for long sessions','Compatible with Nintendo Switch (via adapter) & GameCube'] 
    },
    { id: 'gamecube-adapter', 
      name: 'GameCube Controller Adapter', 
      price: 'Discontinued', 
      category: 'controllers', 
      badge: '', 
      badgeClass: '', 
      icon: 'bi-usb-plug',
      image: '/Accessories/Images/Nintendo Game Cube Controller Adapter Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo Game Cube Controller Adapter Image 2.png',
      desc: 'Connect up to 4 GameCube controllers to your Nintendo Switch via USB. Ideal for Super Smash Bros. enthusiasts.',
      description: 'Plug in your classic GameCube controllers for the authentic competitive experience. This USB adapter supports up to 4 GameCube controllers simultaneously and is the go-to accessory for Super Smash Bros. tournaments.',
      specs: ['Supports up to 4 GameCube controllers','USB connection to Switch dock','Ideal for Super Smash Bros.','Plug and play — no software needed','Works with Switch 2 &amp; original Switch','Compact adapter design','Tournament approved'] 
    },

    // ──── PROTECTION & STORAGE (5) ────
    { id: 'carrying-case', 
      name: 'Switch 2 Carrying Case', 
      price: 'RM 128', 
      category: 'protection', 
      badge: 'Essential', 
      badgeClass: '', 
      icon: 'bi-bag',
      image:'/Accessories/Images/Nintendo Switch 2 Casing Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo Switch 2 Casing Image 2.png',
      desc: 'Hard-shell EVA protection, fits console with Joy-Cons attached, holds 10 game cards, built-in adjustable stand.',
      description: 'Premium hard-shell EVA carrying case designed for Nintendo Switch 2. Fits the console with Joy-Con 2 controllers attached, features a padded interior, holds up to 10 game cards, and includes a built-in stand with two adjustable viewing angles.',
      specs: ['Hard-shell EVA exterior','Custom molded interior for Switch 2','Holds 10 game card cartridges','Built-in adjustable stand — 2 angles','Soft microfiber lining','Zippered mesh pocket for cables','Officially licensed Nintendo product'] 
    },
    { id: 'screen-protector', 
      name: 'Tempered Glass Screen Protector', 
      price: 'Carrying Case (Bundled)', 
      category: 'protection', 
      badge: '', 
      badgeClass: '', 
      icon: 'bi-shield-check',
      image: '/Accessories/Images/Nintendo Switch 2 Protector Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo Switch 2 Protector Image 2.png',
      desc: '9H hardness tempered glass, anti-fingerprint coating, bubble-free installation. Precision cut for 7.9" Switch 2 display.',
      description: 'Precision-cut 9H hardness tempered glass protector for the 7.9" Nintendo Switch 2 display. Anti-fingerprint oleophobic coating, 99.9% light transmittance, and bubble-free adhesive for effortless installation.',
      specs: ['9H hardness tempered glass','Precision cut for 7.9" display','Anti-fingerprint oleophobic coating','99.9% light transmittance','Bubble-free adhesive technology','0.33mm ultra-thin profile','Includes alignment frame &amp; cleaning kit'] 
    },
    { id: 'microsd-256', 
      name: 'Nintendo microSD 256GB', 
      price: 'RM 329', 
      category: 'protection', 
      badge: 'Popular', 
      badgeClass: 'badge-popular', 
      icon: 'bi-sd-card',
      image: '/Accessories/Images/Nintendo microSD 256GB Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo microSD 256GB Image 1.png',
      desc: 'Official licensed 256GB microSDXC card. UHS-I, 100MB/s read speed. Nintendo-certified reliability.',
      description: 'Expand your game library with this officially licensed 256GB microSDXC memory card. UHS-I with 100MB/s read speeds for fast game loading. Nintendo-certified for guaranteed compatibility and reliability.',
      specs: ['256GB microSDXC capacity','UHS-I — 100MB/s read speed','Fast game loading times','Compatible with Switch 2 &amp; original','Nintendo-certified reliability','Nintendo branded design','Includes SD adapter for PC transfer'] 
    },
    { id: 'microsd-512', 
      name: 'Nintendo microSD 512GB', 
      price: 'RM 639', 
      category: 'protection', 
      badge: 'Popular', 
      badgeClass: 'badge-popular', 
      icon: 'bi-sd-card',
      image: '/Accessories/Images/Nintendo microSD 512GB Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo microSD 512GB Image 1.png',
      desc: 'Massive 512GB storage. UHS-I, 100MB/s read. Store your entire digital library with room to spare.',
      description: 'The ultimate storage expansion for digital-first gamers. 512GB of microSDXC storage at UHS-I speeds means you can carry your entire digital game library without ever worrying about space.',
      specs: ['512GB microSDXC capacity','UHS-I — 100MB/s read speed','Store 50+ digital game titles','Compatible with Switch 2 &amp; original','Nintendo-certified reliability','Nintendo branded design','Includes SD adapter'] 
    },
    
    // ──── VISUAL (4) ────
    { id: 'switch-2-camera', 
      name: 'Nintendo Switch 2 Camera', 
      price: 'RM 258', 
      category: 'visual', 
      badge: 'Exclusive', 
      badgeClass: 'badge-new', 
      icon: 'bi-camera',
      image: '/Accessories/Images/Nintendo Camera Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo Camera Image 2.png',
      desc: 'Official HD camera for Nintendo Switch 2. Perfect for streaming, video calls, and compatible games.',
      description: 'The Nintendo Switch 2 Camera brings high-definition video capture to your gaming experience. Whether you\'re streaming gameplay, video chatting with friends, or using camera-based game features, this official accessory delivers crisp, smooth video. The adjustable stand and privacy shutter make it perfect for tabletop mode.',
      specs: ['1080p video capture at 30fps','Plug-and-play via USB-C connection','Built-in adjustable stand for tabletop mode','Privacy shutter for security','Dual noise-reducing microphones','Compatible with Nintendo Switch and Switch 2','Ideal for streaming, video calls & camera-enabled games'] 
    },

    // ──── CHARGING & POWER (5) ────
    { id: 'charging-dock', 
      name: 'Joy-Con Charging Dock', 
      price: 'RM 149', 
      category: 'charging', 
      badge: '', 
      badgeClass: '', 
      icon: 'bi-battery-charging',
      image: '/Accessories/Images/Nintendo Joy Con Charging Dock Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo Joy Con Charging Dock Image 2.png',
      desc: 'Charges multiple Joy-Con controllers simultaneously. LED indicators show charge status. USB-C powered.',
      description: 'Keep all Joy-Con controllers powered and organized. Charges multiple simultaneously via USB-C. Individual LED indicators show charge status. Compact low-profile design fits anywhere.',
      specs: ['Charges 2 Joy-Cons simultaneously','LED charge status indicators','USB-C powered','Compatible with Joy-Con 2 &amp; original','Full charge in ~3.5 hours','Non-slip rubber base','Officially recommended must have product'] },
    { id: 'ac-adapter', 
      name: 'Switch 2 AC Adapter', 
      price: 'RM 168', 
      category: 'charging', 
      badge: '', badgeClass: '', 
      icon: 'bi-plug',
      image: '/Accessories/Images/Nintendo AC Adapter Image 1.png',
      imageDetail: '/Accessories/Images/Nintendo AC Adapter Image 2.png',
      desc: 'Official 39W USB-C power adapter. Fast-charges in handheld or tabletop. Powers the dock for TV mode.',
      description: 'Official 39W USB-C adapter. Fast-charges the Switch 2 in handheld or tabletop mode and powers the dock for TV output. 1.5m cable, foldable plug, 100-240V worldwide compatible.',
      specs: ['39W USB-C power delivery','Fast-charges Switch 2','Powers dock for TV mode','1.5m reinforced cable','Foldable plug prongs','100-240V worldwide compatible','Over-voltage &amp; over-current protection'] 
    }
  ];

  // =======================================================
  //  CATEGORY LABELS
  // =======================================================
  const categoryLabels = {
    all: 'All Accessories',
    controllers: 'Controllers',
    protection: 'Protection & Storage',
    visual: 'Visual',
    charging: 'Charging & Power'
  };

  // =======================================================
  //  STATE
  // =======================================================
  let currentFilter = 'all';
  let currentPage = 1;
  const ITEMS_PER_PAGE = 4;

  // =======================================================
  //  GRID RENDERING
  // =======================================================
  function getFilteredProducts() {
    if (currentFilter === 'all') return allProducts;
    return allProducts.filter(p => p.category === currentFilter);
  }

  function updateCategoryCounts() {
    $('#countAll').text(allProducts.length);
    $('#countControllers').text(allProducts.filter(p => p.category === 'controllers').length);
    $('#countProtection').text(allProducts.filter(p => p.category === 'protection').length);
    $('#countVisual').text(allProducts.filter(p => p.category === 'visual').length);
    $('#countCharging').text(allProducts.filter(p => p.category === 'charging').length);
  }

  function renderGrid() {
    const filtered = getFilteredProducts();
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

    // Clamp page
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

    // Update header
    $('#categoryLabel').text(categoryLabels[currentFilter] || 'All Accessories');
    $('#resultsCount').text(`${filtered.length} product${filtered.length !== 1 ? 's' : ''}`);

    // Build cards
    const $grid = $('#productGrid');
    $grid.empty();

    pageItems.forEach((p, i) => {
      const badgeHtml = p.badge
        ? `<span class="card-badge ${p.badgeClass || 'bg-dark'}">${p.badge}</span>`
        : '';

      // Build image or icon fallback for card preview
      const cardImageHtml = p.image
        ? `<img src="${p.image}" alt="${p.name}" class="card-product-img">`
        : `<div class="accessory-icon-wrapper"><i class="bi ${p.icon}"></i></div>`;

      const card = `
        <div class="col">
          <div class="card product-card h-100" data-product-id="${p.id}" data-product-name="${p.name}" data-product-price="${p.price}">
            <div class="card-img-top-wrapper">
              <div class="card-img-placeholder">
                ${cardImageHtml}
              </div>
              ${badgeHtml}
              <button class="wishlist-btn" data-product-id="${p.id}" aria-label="Add to wishlist"><i class="bi bi-heart"></i></button>
              <button class="share-product-btn" data-product-name="${p.name}" data-product-url="${window.location.origin}/Accessories/accessories.html?product=${p.id}" aria-label="Share product"><i class="bi bi-share-fill"></i></button>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.name}</h5>
              <p class="card-text flex-grow-1">${p.desc}</p>
              <div class="d-flex align-items-center justify-content-between mt-auto pt-2">
                <span class="card-price">${p.price}</span>
                <a href="#" class="card-link-btn" data-product-id="${p.id}">View Details &rarr;</a>
              </div>
            </div>
          </div>
        </div>`;
      $grid.append(card);
    });

    // Staggered reveal
    $grid.find('.product-card').each(function (i) {
      const $card = $(this);
      setTimeout(() => $card.addClass('visible'), 60 * i);
    });

    // Update wishlist hearts
    updateWishlistUI();

    // Render pagination
    renderPagination(totalPages);

    // Scroll to grid top on page change (not on initial load)
    if (renderGrid._hasRendered) {
      const offset = $('.products-section').offset();
      if (offset) {
        $('html, body').animate({ scrollTop: offset.top - 70 }, 300);
      }
    }
    renderGrid._hasRendered = true;
  }

  renderGrid._hasRendered = false;

  // =======================================================
  //  PAGINATION
  // =======================================================
  function renderPagination(totalPages) {
    const $nav = $('#paginationNav');
    $nav.empty();

    if (totalPages <= 1) return;

    let html = '<ul class="pagination-custom">';

    // Prev
    html += `<li><button class="page-btn page-btn-prev" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}"><i class="bi bi-chevron-left"></i></button></li>`;

    // Page numbers with ellipsis logic
    const pages = buildPageNumbers(currentPage, totalPages);
    pages.forEach(p => {
      if (p === '...') {
        html += `<li><button class="page-btn page-btn-ellipsis" disabled>…</button></li>`;
      } else {
        html += `<li><button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button></li>`;
      }
    });

    // Next
    html += `<li><button class="page-btn page-btn-next" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}"><i class="bi bi-chevron-right"></i></button></li>`;

    html += '</ul>';
    $nav.html(html);
  }

  function buildPageNumbers(current, total) {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);

    if (current > 3) pages.push('...');

    const rangeStart = Math.max(2, current - 1);
    const rangeEnd = Math.min(total - 1, current + 1);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (current < total - 2) pages.push('...');

    pages.push(total);
    return pages;
  }

  // Pagination click
  $(document).on('click', '.page-btn:not(:disabled):not(.page-btn-ellipsis)', function () {
    const page = parseInt($(this).data('page'), 10);
    if (!isNaN(page) && page !== currentPage) {
      currentPage = page;
      renderGrid();
    }
  });

  // =======================================================
  //  FILTER — SIDEBAR (PC) + MOBILE PILLS — SYNCED
  // =======================================================
  function setFilter(filter) {
    currentFilter = filter;
    currentPage = 1;

    // Sync sidebar
    $('.category-check-item').removeClass('active').find('input').prop('checked', false);
    $(`.category-check-item[data-filter="${filter}"]`).addClass('active').find('input').prop('checked', true);

    // Sync mobile pills
    $('.filter-pill').removeClass('active');
    $(`.filter-pill[data-filter="${filter}"]`).addClass('active');

    // Save to cookie
    if (isStorageAllowed()) {
      Cookies.set('nin_acc_filter_pref', filter, 7);
    }

    renderGrid();
  }

  // Sidebar click
  $(document).on('click', '.category-check-item', function (e) {
    e.preventDefault();
    const filter = $(this).data('filter');
    setFilter(filter);
  });

  // Mobile pill click
  $(document).on('click', '.filter-pill', function () {
    const filter = $(this).data('filter');
    setFilter(filter);
  });

  // Restore saved filter
  const savedFilter = Cookies.get('nin_acc_filter_pref');
  if (savedFilter && isStorageAllowed()) {
    currentFilter = savedFilter;
  }

  // ===================== MOBILE FILTER ARROWS =====================
const $mobileScroll = $('#mobileFilterScroll');
const $arrowLeft = $('#mobileFilterArrowLeft');
const $arrowRight = $('#mobileFilterArrowRight');

function updateMobileArrows() {
  if (!$mobileScroll.length) return;
  
  const el = $mobileScroll[0];
  const scrollLeft = el.scrollLeft;
  const maxScroll = el.scrollWidth - el.clientWidth;

  if (maxScroll <= 4) {
    $arrowLeft.addClass('d-none');
    $arrowRight.addClass('d-none');
    return;
  }

  $arrowLeft.toggleClass('d-none', scrollLeft < 10);
  $arrowRight.toggleClass('d-none', scrollLeft > maxScroll - 10);
}

// Click handlers
$arrowLeft.on('click', () => {
  $mobileScroll[0].scrollBy({ left: -140, behavior: 'smooth' });
});

$arrowRight.on('click', () => {
  $mobileScroll[0].scrollBy({ left: 140, behavior: 'smooth' });
});

// Event listeners
$mobileScroll.on('scroll', updateMobileArrows);
$(window).on('resize', updateMobileArrows);

// Initial check after page loads
setTimeout(updateMobileArrows, 200);

  // =======================================================
  //  PRODUCT OVERLAY
  // =======================================================
  function getProductById(id) {
    return allProducts.find(p => p.id === id);
  }

  function openOverlay(productId) {
    const product = getProductById(productId);
    if (!product) return;

    $('#overlayName').text(product.name);
    $('#overlayPrice').text(product.price);
    $('#overlayBadge')
      .text(product.badge || product.category.toUpperCase())
      .attr('class', 'overlay-badge ' + (product.badgeClass || 'badge-essential'));
    $('#overlayDescription').html(product.description);
    $('#overlayBuyBtn').attr('href', 'https://shopee.com.my/nintendo_officialstore');

    let specsHtml = '';
    (product.specs || []).forEach(s => {
      specsHtml += `<div class="overlay-spec-item"><i class="bi bi-check-circle-fill"></i><span>${s}</span></div>`;
    });
    $('#overlaySpecs').html(specsHtml);

    // Use distinct detail image for overlay (falls back to card image, then icon)
    const overlayImg = product.imageDetail || product.image;
    if (overlayImg) {
      $('#overlayImageArea').html(`
      <img src="${overlayImg}" alt="${product.name}" class="overlay-real-image">
      `);
    } else {
      $('#overlayImageArea').html(`
        <div class="overlay-accessory-icon"><i class="bi ${product.icon}"></i></div>
      `);
    }

    const wishlist = getWishlist();
    const inWishlist = wishlist.some(i => i.id === productId);
    const $wishBtn = $('#overlayWishBtn');
    $wishBtn
      .data('product-id', productId)
      .toggleClass('wishlisted', inWishlist)
      .html(inWishlist
        ? '<i class="bi bi-heart-fill me-1"></i>In Wishlist'
        : '<i class="bi bi-heart me-1"></i>Add to Wishlist');

    $('body').addClass('overlay-open');
    $('#productOverlay').addClass('active');

    addRecentlyViewed({ id: productId, name: product.name, price: product.price });
  }

  function closeOverlay() {
    $('#productOverlay').removeClass('active');
    $('body').removeClass('overlay-open');
  }

  $('#overlayClose').on('click', closeOverlay);
  $('#overlayBackdrop').on('click', closeOverlay);
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $('#productOverlay').hasClass('active')) closeOverlay();
  });

  // Wishlist from overlay
  $('#overlayWishBtn').on('click', function () {
    if (!isStorageAllowed()) { showToast('Please accept cookies to use the wishlist.'); return; }

    const pid = $(this).data('product-id');
    const product = getProductById(pid);
    if (!product) return;

    let wishlist = getWishlist();
    const idx = wishlist.findIndex(i => i.id === pid);

    if (idx > -1) {
      wishlist.splice(idx, 1);
      $(this).removeClass('wishlisted').html('<i class="bi bi-heart me-1"></i>Add to Wishlist');
      showToast(`${product.name} removed from wishlist.`);
    } else {
      wishlist.push({ id: pid, name: product.name, price: product.price });
      $(this).addClass('wishlisted').html('<i class="bi bi-heart-fill me-1"></i>In Wishlist');
      showToast(`${product.name} added to wishlist!`);
    }

    saveWishlist(wishlist);
    updateWishlistUI();
  });

  // =======================================================
  //  SHARE PRODUCT (WebShare API)
  // =======================================================
  $(document).on('click', '.share-product-btn', function(e) {
    e.preventDefault();
    e.stopPropagation(); // prevent card link from firing
    const $btn = $(this);
    const productName = $btn.data('product-name');
    const productUrl = $btn.data('product-url');

    if (navigator.share) {
      navigator.share({
        title: `Check out ${productName} on Nintendo!`,
        text: `I found this awesome product on Nintendo's official site.`,
        url: productUrl,
      }).catch((error) => {
        if (error.name !== 'AbortError') {
          showToast('Sharing failed. You can copy the link manually.');
        }
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(productUrl).then(() => {
        showToast('Link copied to clipboard! Share it anywhere.');
      }).catch(() => {
        showToast('Unable to copy link. Please share manually.');
      });
    }
  });

  // View Details click
  $(document).on('click', '.card-link-btn', function (e) {
    e.preventDefault();
    openOverlay($(this).data('product-id'));
  });

  // Shop Now on daily picks
  $(document).on('click', '.pick-shop-btn', function (e) {
    e.preventDefault();
    openOverlay($(this).data('product-id'));
  });

  // =======================================================
  //  INITIAL RENDER
  // =======================================================
  updateCategoryCounts();
  setFilter(currentFilter);

  // =======================================================
  //  SCROLL ANIMATIONS
  // =======================================================
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) $(entry.target).addClass('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $('.products-section, .nin-footer').each(function () {
    $(this).addClass('fade-up');
    sectionObserver.observe(this);
  });

  // =======================================================
  //  VISIT COUNTER
  // =======================================================
  (function () {
    let visits = parseInt(Cookies.get('nin_acc_visit_count') || '0', 10);
    visits++;
    Cookies.set('nin_acc_visit_count', visits.toString(), 365);
    if (visits > 1 && isStorageAllowed()) {
      setTimeout(() => showToast(`Welcome back! Visit #${visits} to Accessories.`), 1500);
    }
  })();

  // =======================================================
  //  LAST VISITED TIMESTAMP
  // =======================================================
  (function () {
    if (!isStorageAllowed()) return;
    try {
      const last = localStorage.getItem('nin_acc_last_visit');
      if (last) {
        const diffH = Math.round((new Date() - new Date(last)) / 36e5);
        if (diffH > 24) {
          const days = Math.round(diffH / 24);
          setTimeout(() => showToast(`Last visit: ${days} day${days > 1 ? 's' : ''} ago. Check out new accessories!`), 3000);
        }
      }
      localStorage.setItem('nin_acc_last_visit', new Date().toISOString());
    } catch (e) { console.warn('localStorage unavailable:', e); }
  })();

});