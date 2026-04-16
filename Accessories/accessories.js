/* ============================================
  ACCESSORIES.JS — Nintendo Accessories Page
  Powered by jQuery 4 + Bootstrap 5
  Features: Cookie Consent, Wishlist (localStorage),
  Recently Viewed (sessionStorage), Sidebar + Mobile
  Category Filter, JS-rendered Product Grid,
  Functional Pagination, Product Detail Overlay,
  REST API data fetch + Social Media Share Buttons
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
    $('.wishlist-count-sync').text(wishlist.length);

    $('.wishlist-btn').each(function () {
      const pid = $(this).data('product-id');
      const inWishlist = wishlist.some(item => item.id === pid);
      $(this)
        .toggleClass('wishlisted', inWishlist)
        .find('i').attr('class', inWishlist ? 'bi bi-heart-fill' : 'bi bi-heart');
    });

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

  $(document).on('click', '.recent-chip', function () {
    const pid = $(this).data('recent-id');
    if (pid) openOverlay(pid);
  });

  // =======================================================
  //  PRODUCT DATA CATALOG — will be populated from API
  // =======================================================
  let productCatalog = {};
  let allProducts = [];

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
  //  REST API: Fetch accessories and render
  // =======================================================
  function fetchAccessoriesFromAPI() {
    $.ajax({
      url: '/api/accessories.json',
      method: 'GET',
      dataType: 'json',
      timeout: 10000,
      success: function (response) {
        allProducts = response;
        buildProductCatalog(allProducts);
        updateCategoryCounts();
        setFilter(currentFilter); // initial render
        updateWishlistUI();
        renderRecentlyViewed();
        observeProductCards();
      },
      error: function (xhr, status, error) {
        console.error('API Error:', status, error);
        showToast('Unable to load accessories. Please refresh.');
      }
    });
  }

  function buildProductCatalog(products) {
    productCatalog = {};
    products.forEach(p => { productCatalog[p.id] = p; });
  }

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

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

    $('#categoryLabel').text(categoryLabels[currentFilter] || 'All Accessories');
    $('#resultsCount').text(`${filtered.length} product${filtered.length !== 1 ? 's' : ''}`);

    const $grid = $('#productGrid');
    $grid.empty();

    pageItems.forEach(p => {
      const badgeHtml = p.badge
        ? `<span class="card-badge ${p.badgeClass || 'bg-dark'}">${p.badge}</span>`
        : '';

      const cardImageHtml = p.cardImageUrl
        ? `<img src="${p.cardImageUrl}" alt="${p.name}" class="card-product-img">`
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

    $grid.find('.product-card').each(function (i) {
      setTimeout(() => $(this).addClass('visible'), 60 * i);
    });

    updateWishlistUI();
    renderPagination(totalPages);

    if (renderGrid._hasRendered) {
      const offset = $('.products-section').offset();
      if (offset) $('html, body').animate({ scrollTop: offset.top - 70 }, 300);
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
    html += `<li><button class="page-btn page-btn-prev" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}"><i class="bi bi-chevron-left"></i></button></li>`;

    const pages = buildPageNumbers(currentPage, totalPages);
    pages.forEach(p => {
      if (p === '...') {
        html += `<li><button class="page-btn page-btn-ellipsis" disabled>…</button></li>`;
      } else {
        html += `<li><button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button></li>`;
      }
    });

    html += `<li><button class="page-btn page-btn-next" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}"><i class="bi bi-chevron-right"></i></button></li>`;
    html += '</ul>';
    $nav.html(html);
  }

  function buildPageNumbers(current, total) {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (current > 3) pages.push('...');
    const rangeStart = Math.max(2, current - 1);
    const rangeEnd = Math.min(total - 1, current + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

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

    $('.category-check-item').removeClass('active').find('input').prop('checked', false);
    $(`.category-check-item[data-filter="${filter}"]`).addClass('active').find('input').prop('checked', true);

    $('.filter-pill').removeClass('active');
    $(`.filter-pill[data-filter="${filter}"]`).addClass('active');

    if (isStorageAllowed()) Cookies.set('nin_acc_filter_pref', filter, 7);
    renderGrid();
  }

  $(document).on('click', '.category-check-item', function (e) {
    e.preventDefault();
    setFilter($(this).data('filter'));
  });

  $(document).on('click', '.filter-pill', function () {
    setFilter($(this).data('filter'));
  });

  // Restore saved filter
  const savedFilter = Cookies.get('nin_acc_filter_pref');
  if (savedFilter && isStorageAllowed()) currentFilter = savedFilter;

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

  $arrowLeft.on('click', () => $mobileScroll[0].scrollBy({ left: -140, behavior: 'smooth' }));
  $arrowRight.on('click', () => $mobileScroll[0].scrollBy({ left: 140, behavior: 'smooth' }));
  $mobileScroll.on('scroll', updateMobileArrows);
  $(window).on('resize', updateMobileArrows);
  setTimeout(updateMobileArrows, 200);

  // =======================================================
  //  PRODUCT OVERLAY
  // =======================================================
  function openOverlay(productId) {
    const product = productCatalog[productId];
    if (!product) return;

    $('#overlayName').text(product.name);
    $('#overlayPrice').text(product.price);
    $('#overlayBadge')
      .text(product.badge || product.category.toUpperCase())
      .attr('class', 'overlay-badge ' + (product.badgeClass || 'badge-essential'));
    $('#overlayDescription').html(product.description);
    $('#overlayBuyBtn').attr('href', product.buyUrl || 'https://shopee.com.my/nintendo_officialstore');

    let specsHtml = '';
    (product.specs || []).forEach(s => {
      specsHtml += `<div class="overlay-spec-item"><i class="bi bi-check-circle-fill"></i><span>${s}</span></div>`;
    });
    $('#overlaySpecs').html(specsHtml);

    // Overlay image: prefer detailImageUrl, fallback to cardImageUrl or icon
    const overlayImg = product.detailImageUrl || product.cardImageUrl;
    if (overlayImg) {
      $('#overlayImageArea').html(`<img src="${overlayImg}" alt="${product.name}" class="overlay-real-image">`);
    } else {
      $('#overlayImageArea').html(`<div class="overlay-accessory-icon"><i class="bi ${product.icon}"></i></div>`);
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
    const product = productCatalog[pid];
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
  //  DIRECT SOCIAL SHARE BUTTONS (Overlay)
  // =======================================================
  $(document).on('click', '.share-facebook, .share-x, .share-reddit', function(e) {
    e.preventDefault();
    const platform = $(this).data('platform');
    const productId = $('#overlayWishBtn').data('product-id');
    const product = productCatalog[productId];
    if (!product) return;

    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${productId}`;
    const shareText = `Check out the ${product.name} on Nintendo! ${product.price}`;
    let popupUrl = '';

    if (platform === 'facebook') {
      popupUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'x') {
      popupUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'reddit') {
      popupUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(product.name)}`;
    }

    if (popupUrl) window.open(popupUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  });

  $('#overlayCopyLink').on('click', function(e) {
    e.preventDefault();
    const productId = $('#overlayWishBtn').data('product-id');
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${productId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('Link copied to clipboard!');
    }).catch(() => showToast('Unable to copy link.'));
  });

  // Generic share button (for cards) - fallback Web Share API
  $(document).on('click', '.share-product-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const $btn = $(this);
    const productName = $btn.data('product-name');
    const productUrl = $btn.data('product-url');

    if (navigator.share) {
      navigator.share({
        title: `Check out ${productName} on Nintendo!`,
        text: `I found this awesome product on Nintendo's official site.`,
        url: productUrl,
      }).catch(error => {
        if (error.name !== 'AbortError') showToast('Sharing failed.');
      });
    } else {
      navigator.clipboard.writeText(productUrl).then(() => {
        showToast('Link copied to clipboard! Share it anywhere.');
      }).catch(() => showToast('Unable to copy link.'));
    }
  });

  // View Details / Shop Now clicks
  $(document).on('click', '.card-link-btn', function (e) {
    e.preventDefault();
    openOverlay($(this).data('product-id'));
  });

  $(document).on('click', '.pick-shop-btn', function (e) {
    e.preventDefault();
    openOverlay($(this).data('product-id'));
  });

  // =======================================================
  //  SCROLL ANIMATIONS
  // =======================================================
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) $(entry.target).addClass('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  function observeProductCards() {
    $('.product-card').each(function (i) {
      $(this).css('transition-delay', `${i * 0.08}s`);
      sectionObserver.observe(this);
    });
  }

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

  // =======================================================
  //  KICK OFF: Fetch products from REST API
  // =======================================================
  fetchAccessoriesFromAPI();

});