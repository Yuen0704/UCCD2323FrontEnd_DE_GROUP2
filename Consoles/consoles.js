/* ============================================
  CONSOLES.JS — Nintendo Console Page
  Powered by jQuery 4 + Bootstrap 5
  Features: Cookie Consent, Wishlist (localStorage),
  Recently Viewed (sessionStorage), Filter Preference (cookie)
  [UPDATED] Dynamic product fetching via REST API
  [UPDATED] Direct social share buttons in overlay
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

  // =======================================================
  //  UTILITY: Toast notification
  // =======================================================
  function showToast(message) {
    $('#ninToastBody').text(message);
    const toast = new bootstrap.Toast($('#ninToast')[0], { delay: 2500 });
    toast.show();
  }

  // =======================================================
  //  1. COOKIE CONSENT BANNER
  // =======================================================
  const cookieConsent = Cookies.get('nin_cookie_consent');

  if (!cookieConsent) {
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
    try {
      return JSON.parse(localStorage.getItem('nin_wishlist')) || [];
    } catch {
      return [];
    }
  }

  function saveWishlist(list) {
    try {
      localStorage.setItem('nin_wishlist', JSON.stringify(list));
    } catch (e) {
      console.warn('localStorage unavailable:', e);
    }
  }

  function updateWishlistUI() {
    const wishlist = getWishlist();
    const $count = $('#wishlistCount');
    const $items = $('#wishlistItems');
    const $empty = $('#wishlistEmpty');
    const $footer = $('#wishlistFooter');

    $count.text(wishlist.length);

    // Update heart icons on product cards
    $('.wishlist-btn').each(function () {
      const pid = $(this).data('product-id');
      const inWishlist = wishlist.some(item => item.id === pid);
      $(this)
        .toggleClass('wishlisted', inWishlist)
        .find('i')
        .attr('class', inWishlist ? 'bi bi-heart-fill' : 'bi bi-heart');
    });

    // Render wishlist drawer
    if (wishlist.length === 0) {
      $empty.show();
      $footer.hide();
      $items.empty();
    } else {
      $empty.hide();
      $footer.show();
      $items.empty();
      wishlist.forEach(item => {
        $items.append(`
          <div class="wishlist-item" data-wishlist-id="${item.id}">
            <div class="wishlist-item-info">
              <div class="wishlist-item-name">${item.name}</div>
              <div class="wishlist-item-price">${item.price}</div>
            </div>
            <button class="wishlist-remove-btn" data-remove-id="${item.id}" aria-label="Remove from wishlist">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        `);
      });
    }
  }

  // Toggle wishlist on card heart click
  $(document).on('click', '.wishlist-btn', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!isStorageAllowed()) {
      showToast('Please accept cookies to use the wishlist.');
      return;
    }

    const $btn = $(this);
    const pid = $btn.data('product-id');
    const $card = $btn.closest('.product-card');
    const name = $card.data('product-name');
    const price = $card.data('product-price');

    let wishlist = getWishlist();
    const exists = wishlist.findIndex(item => item.id === pid);

    if (exists > -1) {
      wishlist.splice(exists, 1);
      showToast(`${name} removed from wishlist.`);
    } else {
      wishlist.push({ id: pid, name, price });
      showToast(`${name} added to wishlist!`);
    }

    saveWishlist(wishlist);
    updateWishlistUI();
  });

  // Remove from drawer
  $(document).on('click', '.wishlist-remove-btn', function () {
    const pid = $(this).data('remove-id');
    let wishlist = getWishlist();
    const item = wishlist.find(i => i.id === pid);
    wishlist = wishlist.filter(i => i.id !== pid);
    saveWishlist(wishlist);
    updateWishlistUI();
    if (item) showToast(`${item.name} removed from wishlist.`);
  });

  // Clear all
  $('#clearWishlist').on('click', function () {
    saveWishlist([]);
    updateWishlistUI();
    showToast('Wishlist cleared.');
  });

  // =======================================================
  //  3. RECENTLY VIEWED — sessionStorage
  // =======================================================
  function getRecentlyViewed() {
    try {
      return JSON.parse(sessionStorage.getItem('nin_recently_viewed')) || [];
    } catch {
      return [];
    }
  }

  function addRecentlyViewed(product) {
    if (!isStorageAllowed()) return;

    let viewed = getRecentlyViewed();
    viewed = viewed.filter(p => p.id !== product.id);
    viewed.unshift(product);
    viewed = viewed.slice(0, 6);
    try {
      sessionStorage.setItem('nin_recently_viewed', JSON.stringify(viewed));
    } catch (e) {
      console.warn('sessionStorage unavailable:', e);
    }
    renderRecentlyViewed();
  }

  function renderRecentlyViewed() {
    const viewed = getRecentlyViewed();
    const $section = $('#recentlyViewedSection');
    const $container = $('#recentlyViewedContainer');

    if (viewed.length === 0) {
      $section.hide();
      return;
    }

    $section.fadeIn(300);
    $container.empty();
    viewed.forEach(p => {
      $container.append(`
        <div class="recent-chip">
          <i class="bi bi-nintendo-switch"></i>
          <span>${p.name}</span>
          <span class="recent-price">${p.price}</span>
        </div>
      `);
    });
  }

  // =======================================================
  //  PRODUCT DATA CATALOG — Populated from REST API
  // =======================================================
  let productCatalog = {};
  let productsArray = [];

  // =======================================================
  //  OVERLAY ILLUSTRATION BUILDER
  // =======================================================
  function buildIllustration(type) {
    switch (type) {
      case 'switch2':
        return `
          <div class="overlay-console">
            <div class="overlay-switch">
              <div class="ov-joycon ov-joycon-left"></div>
              <div class="ov-screen">
                <div class="ov-screen-line"></div>
                <div class="ov-screen-line short"></div>
              </div>
              <div class="ov-joycon ov-joycon-right"></div>
            </div>
            <div class="ov-dock"></div>
          </div>`;
      case 'oled':
        return `
          <div class="overlay-console">
            <div class="overlay-switch">
              <div class="ov-joycon ov-joycon-left"></div>
              <div class="ov-screen">
                <div class="ov-screen-line"></div>
                <div class="ov-screen-line short"></div>
              </div>
              <div class="ov-joycon ov-joycon-right"></div>
            </div>
            <div class="ov-dock"></div>
          </div>`;
      case 'lite':
        return `
          <div class="overlay-console">
            <div class="overlay-lite">
              <div class="overlay-lite-screen"></div>
            </div>
          </div>`;
      case 'splatoon':
        return `
          <div class="overlay-console">
            <div class="overlay-switch">
              <div class="ov-joycon ov-joycon-left" style="background:rgba(128,0,255,0.15);border-color:rgba(128,0,255,0.3);"></div>
              <div class="ov-screen">
                <div class="ov-screen-line"></div>
                <div class="ov-screen-line short"></div>
              </div>
              <div class="ov-joycon ov-joycon-right" style="background:rgba(180,230,20,0.15);border-color:rgba(130,180,0,0.3);"></div>
            </div>
            <div class="ov-dock"></div>
          </div>`;
      default:
        return `
          <div class="overlay-console">
            <div class="overlay-switch">
              <div class="ov-joycon ov-joycon-left"></div>
              <div class="ov-screen">
                <div class="ov-screen-line"></div>
                <div class="ov-screen-line short"></div>
              </div>
              <div class="ov-joycon ov-joycon-right"></div>
            </div>
            <div class="ov-dock"></div>
          </div>`;
    }
  }

  // =======================================================
  //  OVERLAY: Open / Close / Populate
  // =======================================================
function openOverlay(productId) {
  const product = productCatalog[productId];
  if (!product) return;

  // Populate overlay content
  $('#overlayName').text(product.name);
  $('#overlayPrice').text(product.price);
  $('#overlayBadge')
    .text(product.badge)
    .attr('class', 'overlay-badge ' + (product.badgeClass || ''));
  $('#overlayDescription').html(product.description);
  $('#overlayBuyBtn').attr('href', product.buyUrl);

  // Build specs
  let specsHtml = '';
  product.specs.forEach(spec => {
    specsHtml += `<div class="overlay-spec-item"><i class="bi bi-check-circle-fill"></i><span>${spec}</span></div>`;
  });
  $('#overlaySpecs').html(specsHtml);

  // Build image or fallback illustration - USE detailImageUrl
  const illustrationHtml = buildIllustration(product.illustration || 'switch2');
  const imageHtml = product.detailImageUrl
    ? `<img src="${product.detailImageUrl}" alt="${product.name}" class="overlay-product-img">`
    : illustrationHtml;

  $('#overlayImageArea').html(imageHtml);

  // Update wishlist button state
  const wishlist = getWishlist();
  const inWishlist = wishlist.some(item => item.id === productId);
  const $wishBtn = $('#overlayWishBtn');
  $wishBtn
    .data('product-id', productId)
    .toggleClass('wishlisted', inWishlist)
    .html(inWishlist
      ? '<i class="bi bi-heart-fill me-1"></i>In Wishlist'
      : '<i class="bi bi-heart me-1"></i>Add to Wishlist'
    );

  // Show overlay
  $('body').addClass('overlay-open');
  $('#productOverlay').addClass('active');

  // Track as recently viewed
  addRecentlyViewed({
    id: productId,
    name: product.name,
    price: product.price
  });
}

  function closeOverlay() {
    $('#productOverlay').removeClass('active');
    $('body').removeClass('overlay-open');
  }

  // Close button
  $('#overlayClose').on('click', closeOverlay);

  // Click backdrop to close
  $('#overlayBackdrop').on('click', closeOverlay);

  // ESC key to close
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $('#productOverlay').hasClass('active')) {
      closeOverlay();
    }
  });

  // Wishlist toggle from overlay
  $('#overlayWishBtn').on('click', function () {
    if (!isStorageAllowed()) {
      showToast('Please accept cookies to use the wishlist.');
      return;
    }

    const pid = $(this).data('product-id');
    const product = productCatalog[pid];
    if (!product) return;

    let wishlist = getWishlist();
    const exists = wishlist.findIndex(item => item.id === pid);

    if (exists > -1) {
      wishlist.splice(exists, 1);
      $(this)
        .removeClass('wishlisted')
        .html('<i class="bi bi-heart me-1"></i>Add to Wishlist');
      showToast(`${product.name} removed from wishlist.`);
    } else {
      wishlist.push({ id: pid, name: product.name, price: product.price });
      $(this)
        .addClass('wishlisted')
        .html('<i class="bi bi-heart-fill me-1"></i>In Wishlist');
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

    if (popupUrl) {
      window.open(popupUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    }
  });

  $('#overlayCopyLink').on('click', function(e) {
    e.preventDefault();
    const productId = $('#overlayWishBtn').data('product-id');
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${productId}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('Link copied to clipboard!');
    }).catch(() => {
      showToast('Unable to copy link.');
    });
  });

  // Generic share button (for cards) - kept for fallback
  $(document).on('click', '.share-product-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const $btn = $(this);
    const productId = $btn.data('product-id');
    const productName = $btn.data('product-name');

    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${productId}`;

    if (navigator.share) {
      navigator.share({
        title: `Check out ${productName} on Nintendo!`,
        text: `I found this awesome product on Nintendo's official site.`,
        url: shareUrl,
      }).catch((error) => {
        if (error.name !== 'AbortError') showToast('Sharing failed.');
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Link copied to clipboard! Share it anywhere.');
      }).catch(() => showToast('Unable to copy link.'));
    }
  });

  // =======================================================
  //  AUTO-OPEN OVERLAY FROM URL PARAMETER
  // =======================================================
  function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('product');
  }

  function openProductFromURL() {
    const productId = getProductIdFromURL();
    if (productId && productCatalog[productId]) {
      setTimeout(() => openOverlay(productId), 100);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }

  // =======================================================
  //  REST API: Fetch Consoles and Render Cards
  // =======================================================
  function fetchConsolesFromAPI() {
    $('#productsLoading').show();
    $('#productsError').hide();
    $('#productGrid').empty();

    $.ajax({
      url: '/api/consoles.json',
      method: 'GET',
      dataType: 'json',
      timeout: 10000,
      success: function (response) {
        // Expected: array of product objects
        productsArray = response.map(p => ({
          ...p,
          category: p.category || getCategoryFromId(p.id)
        }));
        buildProductCatalog(productsArray);
        renderProductCards(productsArray);
        $('#productsLoading').hide();
        
        // Initialize features that depend on product catalog
        initFilters();
        updateWishlistUI();
        renderRecentlyViewed();
        openProductFromURL();
        observeProductCards();
      },
      error: function (xhr, status, error) {
        console.error('API Error:', status, error);
        $('#productsLoading').hide();
        $('#productsError').show();
        $('#errorMessage').text('Unable to load products. Please refresh the page or try again later.');
        $('#productGrid').empty();
      }
    });
  }

  // Helper to assign category from ID
  function getCategoryFromId(id) {
    if (id.includes('switch-2')) return 'switch2';
    if (id.includes('bundle')) return 'bundle';
    if (id.includes('oled')) return 'switch';
    if (id.includes('lite')) return 'switch';
    if (id.includes('splatoon')) return 'promo';
    return 'switch';
  }

  // Build productCatalog object keyed by ID
function buildProductCatalog(products) {
  productCatalog = {};
  products.forEach(p => {
    productCatalog[p.id] = {
      name: p.name,
      price: p.price,
      badge: p.badge || 'New',
      badgeClass: p.badgeClass || '',
      description: p.description,
      specs: p.specs || [],
      buyUrl: p.buyUrl || '#',
      illustration: p.illustration || 'switch2',
      cardImageUrl: p.cardImageUrl || '',
      detailImageUrl: p.detailImageUrl || p.cardImageUrl || ''
    };
  });
}

  // Render product cards from array
function renderProductCards(products) {
  const $grid = $('#productGrid');
  $grid.empty();

  products.forEach(product => {
    const shortDesc = product.shortDesc || product.description.substring(0, 100) + '...';
    const col = $(`
      <div class="col product-col" data-category="${product.category}">
        <div class="card product-card h-100" 
            data-product-id="${product.id}"
            data-product-name="${product.name}"
            data-product-price="${product.price}">
          <div class="card-img-top-wrapper">
            <div class="card-img-placeholder">
              <img src="${product.cardImageUrl}" alt="${product.name}" class="card-product-img">
            </div>
            <span class="card-badge ${product.badgeClass || 'badge-new'}">${product.badge}</span>
            <button class="wishlist-btn" data-product-id="${product.id}" aria-label="Add to wishlist">
              <i class="bi bi-heart"></i>
            </button>
            <button class="share-product-btn" data-product-id="${product.id}" data-product-name="${product.name}" aria-label="Share product">
              <i class="bi bi-share-fill"></i>
            </button>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text flex-grow-1">${shortDesc}</p>
            <div class="d-flex align-items-center justify-content-between mt-auto pt-2">
              <span class="card-price">${product.price}</span>
              <a href="#" class="card-link-btn" data-product-id="${product.id}">View Details &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    `);
    $grid.append(col);
  });
}

  // =======================================================
  //  TRIGGER: "View Details" on product cards → open overlay
  // =======================================================
  $(document).on('click', '.card-link-btn', function (e) {
    e.preventDefault();
    const productId = $(this).data('product-id');
    openOverlay(productId);
  });

  // =======================================================
  //  TRIGGER: "Learn More" on hero section → open overlay
  // =======================================================
  $(document).on('click', '.hero-learn-more', function (e) {
    e.preventDefault();
    const productId = $(this).data('product-id');
    openOverlay(productId);
  });

  // =======================================================
  //  4. FILTER — saves preference in cookie
  // =======================================================
  function initFilters() {
    const $filterBtns = $('#filterBar .filter-btn');
    const $productCols = $('.product-col');

    const savedFilter = Cookies.get('nin_filter_pref');
    if (savedFilter && isStorageAllowed()) {
      applyFilter(savedFilter);
      $filterBtns.removeClass('active');
      $filterBtns.filter(`[data-filter="${savedFilter}"]`).addClass('active');
    }

    $filterBtns.off('click').on('click', function () {
      $filterBtns.removeClass('active');
      $(this).addClass('active');

      const filter = $(this).data('filter');
      applyFilter(filter);

      if (isStorageAllowed()) {
        Cookies.set('nin_filter_pref', filter, 7);
      }
    });
  }

  function applyFilter(filter) {
    $('.product-col').each(function () {
      const $col = $(this);
      const category = $col.data('category');

      if (filter === 'all' || category === filter) {
        $col.removeClass('hiding');
        setTimeout(() => $col.show(), 10);
      } else {
        $col.addClass('hiding');
        setTimeout(() => $col.hide(), 350);
      }
    });
  }

  // =======================================================
  //  4b. FILTER SCROLL ARROWS
  // =======================================================
  const $scrollArea = $('#filterScrollArea');
  const $arrowLeft = $('#filterArrowLeft');
  const $arrowRight = $('#filterArrowRight');

  function updateFilterArrows() {
    if (!$scrollArea.length) return;
    const el = $scrollArea[0];
    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (maxScroll <= 2) {
      $arrowLeft.addClass('d-none');
      $arrowRight.addClass('d-none');
      return;
    }

    if (scrollLeft > 4) {
      $arrowLeft.removeClass('d-none');
    } else {
      $arrowLeft.addClass('d-none');
    }

    if (scrollLeft < maxScroll - 4) {
      $arrowRight.removeClass('d-none');
    } else {
      $arrowRight.addClass('d-none');
    }
  }

  $arrowLeft.on('click', function () {
    $scrollArea[0].scrollBy({ left: -150, behavior: 'smooth' });
  });

  $arrowRight.on('click', function () {
    $scrollArea[0].scrollBy({ left: 150, behavior: 'smooth' });
  });

  $scrollArea.on('scroll', updateFilterArrows);
  $(window).on('resize', updateFilterArrows);

  setTimeout(updateFilterArrows, 100);

  // =======================================================
  //  5. VIDEO CAROUSEL — Manual nav + Pause/Play control
  // =======================================================
  const videoCarousel = document.getElementById('videoCarousel');

  function getVideoInSlide(slideEl) {
    if (slideEl && slideEl.dataset.hasVideo === 'true') {
      return slideEl.querySelector('.slide-video');
    }
    return null;
  }

  function pauseAllVideos() {
    $(videoCarousel).find('.slide-video').each(function () {
      this.pause();
    });
  }

  const firstVideo = getVideoInSlide(videoCarousel.querySelector('.carousel-item.active'));
  if (firstVideo) {
    const playPromise = firstVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {});
    }
    $('#pauseIcon').attr('class', 'bi bi-pause-fill');
  }

  $('#pauseBtn').on('click', function () {
    const activeItem = videoCarousel.querySelector('.carousel-item.active');
    const video = getVideoInSlide(activeItem);

    if (video) {
      if (!video.paused) {
        video.pause();
        $('#pauseIcon').attr('class', 'bi bi-play-fill');
      } else {
        video.play();
        $('#pauseIcon').attr('class', 'bi bi-pause-fill');
      }
    }
  });

  $(videoCarousel).on('slide.bs.carousel', function () {
    pauseAllVideos();
  });

  $(videoCarousel).on('slid.bs.carousel', function (e) {
    const newItem = e.relatedTarget;
    const video = getVideoInSlide(newItem);

    if (video) {
      video.currentTime = 0;
      video.play();
      $('#pauseIcon').attr('class', 'bi bi-pause-fill');
    }
  });

  // =======================================================
  //  6. SCROLL ANIMATIONS
  // =======================================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $(entry.target).addClass('visible');
      }
    });
  }, observerOptions);

  $('.showcase-section, .products-section, .nin-footer').each(function () {
    $(this).addClass('fade-up');
    sectionObserver.observe(this);
  });

  function observeProductCards() {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $(entry.target).addClass('visible');
        }
      });
    }, { threshold: 0.1 });

    $('.product-card').each(function (i) {
      $(this).css('transition-delay', `${i * 0.08}s`);
      cardObserver.observe(this);
    });
  }

  // =======================================================
  //  7. VISIT COUNTER — cookie based
  // =======================================================
  (function trackVisits() {
    let visits = parseInt(Cookies.get('nin_visit_count') || '0', 10);
    visits++;
    Cookies.set('nin_visit_count', visits.toString(), 365);

    if (visits > 1 && isStorageAllowed()) {
      setTimeout(() => {
        showToast(`Welcome back to Nintendo! Visit #${visits}.`);
      }, 1500);
    }
  })();

  // =======================================================
  //  8. LAST VISITED TIMESTAMP — localStorage
  // =======================================================
  (function trackLastVisit() {
    if (!isStorageAllowed()) return;

    try {
      const lastVisit = localStorage.getItem('nin_last_visit');
      if (lastVisit) {
        const date = new Date(lastVisit);
        const now = new Date();
        const diffHours = Math.round((now - date) / 36e5);

        if (diffHours > 24) {
          const days = Math.round(diffHours / 24);
          setTimeout(() => {
            showToast(`Last visit: ${days} day${days > 1 ? 's' : ''} ago. See what's new!`);
          }, 3000);
        }
      }
      localStorage.setItem('nin_last_visit', new Date().toISOString());
    } catch (e) {
      console.warn('localStorage unavailable:', e);
    }
  })();

  // =======================================================
  //  KICK OFF: Fetch products from REST API
  // =======================================================
  fetchConsolesFromAPI();

});