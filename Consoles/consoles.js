/* ============================================
   CONSOLES.JS — Nintendo Console Page
   Powered by jQuery 4 + Bootstrap 5
   Features: Cookie Consent, Wishlist (localStorage),
   Recently Viewed (sessionStorage), Filter Preference (cookie)
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

  // Init wishlist UI
  updateWishlistUI();

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
  //  PRODUCT DATA CATALOG — for overlay detail pages
  // =======================================================
  const productCatalog = {
    'switch-2': {
      name: 'Nintendo Switch 2',
      price: 'RM 2,488',
      badge: 'LATEST RELEASE',
      badgeClass: '',
      description: 'Nintendo Switch 2 redefines the boundaries of hybrid gaming, combining the freedom of a handheld with the raw performance of a high-end home console. Engineered for the next generation of adventures, it brings your favorite worlds to life while maintaining the seamless "pick up and play" versatility that defined its predecessor.',
      specs: [
        'Custom Nvidia&trade; Tegra T239 SoC with DLSS enabled',
        '7.9" FHD LCD touchscreen display (HDR10 supported &amp; 120hz VRR)',
        'Up to 4K 60fps resolution &amp; 2K 120fps in docked mode',
        'Magnetic Joy-Con 2 with mouse-style controls',
        'Built-in GameChat voice &amp; video chat',
        'Backward compatible with Nintendo Switch games',
        '12GB LPDDR5X RAM',
        '256GB UFS internal storage (expandable via microSD)'
      ],
      buyUrl: 'https://shopee.com.my/nintendo_officialstore?categoryId=100634&entryPoint=ShopByPDP&itemId=43953768099',
      illustration: 'switch2',
      imageUrl: '/Consoles/Images/Nintendo Switch 2 Image 1.png'
    },
    'switch-2-mk-bundle': {
      name: 'Switch 2 + Mario Kart World Bundle',
      price: 'RM 2,599',
      badge: 'Bundle',
      badgeClass: 'badge-bundle',
      description: 'Get everything you need to start racing on day one. This bundle includes the Nintendo Switch 2 console plus a digital download code for Mario Kart World — the latest entry in the beloved racing series featuring seamlessly connected open-world tracks, the new Knockout Tour mode, Free Roam exploration, and support for mouse-style Joy-Con steering.',
      specs: [
        'Nintendo Switch 2 console included',
        'Digital copy of Mario Kart World (RM 398 value)',
        'Open-world connected tracks &amp; Free Roam mode',
        'Knockout Tour — new competitive race format',
        'Joy-Con 2 mouse-style steering support',
        'Online multiplayer via Nintendo Switch Online'
      ],
      buyUrl: 'https://shopee.com.my/nintendo_officialstore?categoryId=100634&entryPoint=ShopByPDP&itemId=43953768099',
      illustration: 'switch2',
      imageUrl: '/Consoles/Images/Nintendo Switch 2 Mario Image 2.png'
    },
    'switch-oled': {
      name: 'Nintendo Switch — OLED Model',
      price: 'RM 1,288',
      badge: 'Classic',
      badgeClass: 'badge-classic',
      description: 'Experience your favorite Nintendo games on a vibrant 7-inch OLED screen with vivid colors and crisp contrast. The OLED Model features a wide adjustable stand for tabletop play, a dock with a wired LAN port for stable online connections, 64GB of internal storage, and enhanced audio for a richer sound experience.',
      specs: [
        '7-inch OLED screen with vivid colors',
        'Wide adjustable stand for tabletop mode',
        '64GB internal storage',
        'Dock with wired LAN port included',
        'Enhanced audio speakers',
        'Compatible with all Nintendo Switch games'
      ],
      buyUrl: 'https://shopee.com.my/nintendo_officialstore?categoryId=100634&entryPoint=ShopByPDP&itemId=43953768099',
      illustration: 'oled',
      imageUrl: '/Consoles/Images/Nintendo Switch Oled Image 2.png'
    },
    'switch-lite': {
      name: 'Nintendo Switch Lite',
      price: 'RM 838',
      badge: 'Handheld',
      badgeClass: 'badge-handheld',
      description: 'A compact, lightweight Nintendo Switch system designed specifically for handheld play. With a sleek, unibody design and integrated controls, the Switch Lite is perfect for gamers on the go. Available in a variety of fun colors. Plays all Nintendo Switch games that support handheld mode.',
      specs: [
        '5.5-inch LCD touchscreen',
        'Lightweight unibody design (275g)',
        'Built-in controls — no detachable Joy-Cons',
        'Available in Coral, Yellow, Gray, Turquoise &amp; more',
        '32GB internal storage (expandable via microSD)',
        'Plays all handheld-compatible Switch games'
      ],
      buyUrl: 'https://shopee.com.my/nintendo_officialstore?categoryId=100634&entryPoint=ShopByPDP&itemId=43953768099',
      illustration: 'lite',
      imageUrl: '/Consoles/Images/Nintendo Switch Lite Image 2.png'
    },
    'switch-2-dk-bundle': {
      name: 'Switch 2 + Donkey Kong Bananza',
      price: 'RM 2,877',
      badge: 'Bundle',
      badgeClass: 'badge-bundle',
      description: 'Take on a vast underground 3D adventure with this console bundle. Includes the Nintendo Switch 2 system plus a copy of Donkey Kong Bananza — DK\'s brand-new 3D platforming adventure where you smash, throw, and climb your way through a massive interconnected underground world filled with secrets, challenges, and boss battles.',
      specs: [
        'Nintendo Switch 2 console included',
        'Copy of Donkey Kong Bananza (RM 278 value)',
        'Massive 3D underground adventure world',
        'Classic DK gameplay — smash, throw &amp; climb',
        'Supports co-op multiplayer',
        'Full Switch 2 feature set included'
      ],
      buyUrl: 'https://shopee.com.my/nintendo_officialstore?categoryId=100634&entryPoint=ShopByPDP&itemId=43953768099',
      illustration: 'switch2',
      imageUrl: '/Consoles/Images/Donkey Kong Bonanza Game Intro.png'
    },
    'switch-oled-splatoon': {
      name: 'Switch OLED — Splatoon 3 Edition',
      price: 'RM 1,699',
      badge: 'Exclusive',
      badgeClass: 'badge-special',
      description: 'Stand out from the crowd with this special edition Nintendo Switch OLED Model featuring a Splatoon 3-inspired design. Includes uniquely themed gradient Joy-Con controllers in purple and yellow-green, a custom decorated dock, and a white console body with Splatoon ink-splatter accents. The vibrant 7-inch OLED screen brings every splat to life.',
      specs: [
        'Splatoon 3 themed gradient Joy-Cons',
        'Custom decorated dock with ink splatter design',
        'White console body with unique accents',
        '7-inch OLED screen with vivid colors',
        '64GB internal storage',
        'Game sold separately'
      ],
      buyUrl: 'https://shopee.com.my/nintendo_officialstore?categoryId=100634&entryPoint=ShopByPDP&itemId=43953768099',
      illustration: 'splatoon',
      imageUrl: '/Consoles/Images/Nintendo Switch Oled Splatoon 3 2.png'
    }
  };

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

    // Build image or fallback illustration
    const illustrationHtml = buildIllustration(product.illustration || 'switch2');
    const imageHtml = product.imageUrl
      ? `<img src="${product.imageUrl}" alt="${product.name}" class="overlay-product-img">`
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

    $(document).on('click', '.share-product-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const $btn = $(this);
    const productId = $btn.data('product-id');     // Use product ID
    const productName = $btn.data('product-name');

    // Build the full URL to share (current page + ?product=id)
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
      // Small delay to ensure DOM is ready
      setTimeout(() => openOverlay(productId), 100);
      // Clean the URL without reloading the page
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }

  // Call on page load
  openProductFromURL();

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

  // Init recently viewed
  renderRecentlyViewed();

  // =======================================================
  //  4. FILTER — saves preference in cookie
  // =======================================================
  const $filterBtns = $('#filterBar .filter-btn');
  const $productCols = $('.product-col');

  // Restore saved filter from cookie
  const savedFilter = Cookies.get('nin_filter_pref');
  if (savedFilter && isStorageAllowed()) {
    applyFilter(savedFilter);
    $filterBtns.removeClass('active');
    $filterBtns.filter(`[data-filter="${savedFilter}"]`).addClass('active');
  }

  $filterBtns.on('click', function () {
    $filterBtns.removeClass('active');
    $(this).addClass('active');

    const filter = $(this).data('filter');
    applyFilter(filter);

    // Save filter preference in cookie
    if (isStorageAllowed()) {
      Cookies.set('nin_filter_pref', filter, 7);
    }
  });

  function applyFilter(filter) {
    $productCols.each(function () {
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

    // Show arrows only if content overflows
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

  // Initial check
  setTimeout(updateFilterArrows, 100);

  // =======================================================
  //  5. VIDEO CAROUSEL — Manual nav + Pause/Play control
  // =======================================================
  const videoCarousel = document.getElementById('videoCarousel');

  // Get the video element inside a slide (if any)
  function getVideoInSlide(slideEl) {
    if (slideEl && slideEl.dataset.hasVideo === 'true') {
      return slideEl.querySelector('.slide-video');
    }
    return null;
  }

  // Pause all videos
  function pauseAllVideos() {
    $(videoCarousel).find('.slide-video').each(function () {
      this.pause();
    });
  }

  // Autoplay the first video on page load
  const firstVideo = getVideoInSlide(videoCarousel.querySelector('.carousel-item.active'));
  if (firstVideo) {
    const playPromise = firstVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        // Autoplay blocked by browser — leave it paused
      });
    }
    $('#pauseIcon').attr('class', 'bi bi-pause-fill');
  }

  // Pause button — controls the active slide's video
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

  // On slide change — pause outgoing video
  $(videoCarousel).on('slide.bs.carousel', function () {
    pauseAllVideos();
  });

  // On slide arrived — autoplay the new slide's video
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

  // Sections fade-up
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

  // Product cards staggered reveal
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

  // =======================================================
  //  7. VISIT COUNTER — cookie based
  // =======================================================
  (function trackVisits() {
    let visits = parseInt(Cookies.get('nin_visit_count') || '0', 10);
    visits++;
    Cookies.set('nin_visit_count', visits.toString(), 365);

    // Welcome-back toast on return visits
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

});
