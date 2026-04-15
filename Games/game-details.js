/**
 * game-details.js
 * ===============
 * FIX: Added updateAuthButton() and updateBadges() calls so
 *      the navbar login button text and heart/cart badge
 *      counts display correctly on this page.
 *
 * STORAGE USED:
 *   localStorage   → favorites, recentlyViewed (read + write)
 *   sessionStorage → currentGame (write only — records which
 *                    game was last viewed, resets on tab close)
 *   Cookie         → username (read via getCookie from shared.js)
 */

$(document).ready(function () {

  /* ── FIX: update navbar auth button and badge counts ──── */
  // shared.js runs on DOMContentLoaded, but calling again here
  // ensures they're set after jQuery has finished loading.
  if (typeof updateAuthButton === "function") updateAuthButton();
  if (typeof updateBadges    === "function") updateBadges();

  /* ── GAME DATA ────────────────────────────────────────── */
  const gameData = {
    AnimalCrossing: {
      title: "Animal Crossing: New Horizons", genre: "Simulation",
      description: "Escape to a deserted island and create your own paradise as you explore, create, and customize in the Animal Crossing: New Horizons game. Your island getaway has a wealth of natural resources that can be used to craft everything from tools to creature comforts. You can shape the island however you like. Befriend adorable villagers and enjoy the simple pleasures of island life.",
      release: "March 20, 2020", players: "1–8 players (online / local)", platform: "Nintendo Switch",
      rating: 4.8,
      trailer: "https://www.youtube.com/embed/5LAKjL3p6Gw",
      banner: "images/AC_image1.png",
      screenshots: [
        "images/AC_image2.webp",
        "images/AC_image3.jpg",
        "images/AC_image4.jpg"
      ],
      features: ["Build your dream island from scratch","Craft tools, furniture, and more","Befriend over 400 unique villagers","Visit friends' islands online","Seasonal events & holidays"],
      tags: ["Island Life","Crafting","Relaxing","Multiplayer","Open World","Cute"]
    },
    PicoPark: {
      title: "PICO PARK", genre: "Puzzle",
      description: "PICO PARK is a cooperative action puzzle game for 2–8 players. Work together with your friends to solve puzzles, collect keys, and reach the goal. Communication and teamwork are essential — you cannot succeed alone! Enjoy over 48 stages packed with clever puzzles that require real coordination.",
      release: "May 7, 2021", players: "2–8 players (local / online)", platform: "Nintendo Switch",
      rating: 4.6,
      trailer: "https://www.youtube.com/embed/r_-yjKYfp9Y",
      banner: "images/PP_image1.jpg",
      screenshots: [
        "images/PP_image2.png",
        "images/PP_image3.png",
        "images/PP_image4.jpg"
      ],
      features: ["48+ cooperative puzzle stages","Up to 8 players at once","Local and online multiplayer","Simple controls, deep teamwork","Unlockable mini-games"],
      tags: ["Cooperative","Puzzle","Multiplayer","Party","Teamwork","Colorful"]
    },
    Overcooked2: {
      title: "Overcooked! 2", genre: "Party",
      description: "Overcooked! 2 sees the return of the Onion King and The Unbread — a horde of zombie bread that has risen from the dead! Explore the Onion Kingdom, whip up recipes and cook up a mighty feast to defend it. Chop, sauté, boil, and bake across kitchens that range from sushi restaurants to magic schools.",
      release: "August 7, 2018", players: "1–4 players (local / online)", platform: "Nintendo Switch",
      rating: 4.5,
      trailer: "https://www.youtube.com/embed/ZKNO0MsDV2k",
      banner: "images/O2_image1.webp",
      screenshots: [
        "images/O2_image2.webp",
        "images/O2_image3.jpg",
        "images/O2_image4.jpg"
      ],
      features: ["Chaotic cooperative cooking gameplay","New recipes and throwing mechanics","Online multiplayer support","30+ kitchens to cook in","Wacky moving kitchen stages"],
      tags: ["Party","Cooking","Chaos","Multiplayer","Co-op","Funny"]
    },
    MarioOdyssey: {
      title: "Super Mario Odyssey", genre: "Platformer",
      description: "Join Mario on a massive, globe-trotting 3D adventure in Super Mario Odyssey! Use his new cap ally Cappy to take control of enemies and objects and discover incredible gameplay possibilities. Explore huge 3D kingdoms filled with secrets and surprises on a mission to stop Bowser's wedding plans.",
      release: "October 27, 2017", players: "1–2 players (co-op)", platform: "Nintendo Switch",
      rating: 4.9,
      trailer: "https://www.youtube.com/embed/wGQHQc_3ycE",
      banner: "images/SMO_image1.avif",
      screenshots: [
        "images/SMO_image2.jpg",
        "images/SMO_image3.webp",
        "images/SMO_image4.jpg"
      ],
      features: ["Explore 17 massive kingdoms","Capture enemies with Cappy","Collect 880 Power Moons","2-player co-op mode","Classic Mario outfits & costumes"],
      tags: ["Platformer","Adventure","3D","Classic","Family","Exploration"]
    },
    ZeldaBOTW: {
      title: "Zelda: Breath of the Wild", genre: "Adventure",
      description: "Forget everything you know about The Legend of Zelda games. Step into a world of discovery, exploration, and adventure. Travel across fields, through forests, and to mountain peaks. Fight against ferocious enemies while exploring the sprawling open world.",
      release: "March 3, 2017", players: "1 player", platform: "Nintendo Switch",
      rating: 5.0,
      trailer: "https://www.youtube.com/embed/1rPxiXXxftE",
      banner: "images/ZB_image1.jpg",
      screenshots: [
        "images/ZB_image2.avif",
        "images/ZB_image3.jpg",
        "images/ZB_image4.webp"
      ],
      features: ["Massive open-world Hyrule","100+ shrines to discover","Physics-based puzzle solving","Cook 200+ recipes","Climb almost any surface"],
      tags: ["Open World","Adventure","Epic","Puzzle","Combat","Award Winner"]
    },
    SwitchSports: {
      title: "Nintendo Switch Sports", genre: "Sports",
      description: "Get moving with Nintendo Switch Sports! Swing, kick, spike, and bowl with Joy-Con controllers across a range of fun sports. Play alone or with friends and family. Six sports available: soccer, volleyball, bowling, tennis, badminton, and chambara.",
      release: "April 29, 2022", players: "1–4 players (online / local)", platform: "Nintendo Switch",
      rating: 4.4,
      trailer: "https://www.youtube.com/embed/TZ16-1YIRAc",
      banner: "images/NSS_image1.jpg",
      screenshots: [
        "images/NSS_image2.png",
        "images/NSS_image3.webp",
        "images/NSS_image4.webp"
      ],
      features: ["6 sports included at launch","Online ranked matches","Customisable Sportsmate avatars","Joy-Con motion controls","Free future sport updates"],
      tags: ["Sports","Motion Controls","Family","Multiplayer","Active","Online"]
    }
  };

  /* ── HELPERS ──────────────────────────────────────────── */
  function generateStars(rating) {
    const full = Math.floor(rating), half = rating % 1 !== 0;
    let s = '';
    for (let i = 0; i < full; i++)             s += '<i class="bi bi-star-fill"></i>';
    if (half)                                    s += '<i class="bi bi-star-half"></i>';
    for (let i = full+(half?1:0); i < 5; i++)   s += '<i class="bi bi-star"></i>';
    return s;
  }

  /* ── DARK MODE ────────────────────────────────────────── */
  let isDark = localStorage.getItem("darkMode") === "true";
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

  /* ── GET GAME FROM URL ?game= ─────────────────────────── */
  const params  = new URLSearchParams(window.location.search);
  const gameKey = params.get("game");

  if (!gameKey || !gameData[gameKey]) {
    $("#mainContent").hide();
    $(".details-hero, .breadcrumb-bar").hide();
    $("#notFoundMsg").css("display", "block");
    return;
  }

  const game = gameData[gameKey];

  /* ── SESSIONSTORAGE: record current viewed game ───────────
     Uses sessionStorage so it resets when the tab closes.
     The profile page and games page can read this temporarily.
  ────────────────────────────────────────────────────────── */
  sessionStorage.setItem("currentGame", gameKey); // SESSIONSTORAGE

  /* ── POPULATE PAGE ────────────────────────────────────── */
  document.title = `Nintendo — ${game.title}`;
  $("#breadcrumbTitle").text(game.title);
  $("#detailsHero").css("background-image", `url('${game.banner}')`);
  $("#heroGameTitle").text(game.title);
  $("#heroGenreBadge").text(game.genre);
  $("#heroRating").html(generateStars(game.rating) +
    ` <span style="font-size:0.9rem;color:rgba(255,255,255,0.8);margin-left:6px;">${game.rating}/5</span>`);
  $("#gameTitle").text(game.title);
  $("#gameStars").html(generateStars(game.rating));
  $("#gameDescription").text(game.description);
  $("#gameGenre").text(game.genre);
  $("#gameRelease").text(game.release);
  $("#gamePlayers").text(game.players);
  $("#gamePlatform").text(game.platform);
  $("#gameRatingVal").text(`${game.rating} / 5`);
  $("#platformText").text(game.platform);
  $("#gameTrailer").attr("src", game.trailer);

  // Features
  $("#featuresList").empty();
  game.features.forEach(function (f) { $("#featuresList").append(`<li>${f}</li>`); });

  // Tags
  $("#tagsBox").empty();
  game.tags.forEach(function (tag) { $("#tagsBox").append(`<span class="tag-badge">${tag}</span>`); });

  /* ── SCREENSHOT GALLERY ───────────────────────────────── */
  let galleryIndex = 0;

  function buildGallery() {
    $("#galleryTrack").empty();
    $("#galleryDots").empty();
    game.screenshots.forEach(function (src, i) {
      $("#galleryTrack").append(`
        <div class="gallery-slide">
          <img src="${src}" alt="${game.title} screenshot ${i+1}" loading="lazy">
        </div>`);
      $("#galleryDots").append(`<span class="gallery-dot ${i===0?'active':''}" data-index="${i}"></span>`);
    });
  }

  function goToSlide(index) {
    const total = game.screenshots.length;
    galleryIndex = (index + total) % total;
    $("#galleryTrack").css("transform", `translateX(-${galleryIndex * 100}%)`);
    $(".gallery-dot").removeClass("active").eq(galleryIndex).addClass("active");
  }

  buildGallery();
  $("#galleryNext").on("click", function () { goToSlide(galleryIndex + 1); });
  $("#galleryPrev").on("click", function () { goToSlide(galleryIndex - 1); });
  $(document).on("click", ".gallery-dot", function () { goToSlide(parseInt($(this).data("index"))); });
  // Auto-advance every 4 seconds
  setInterval(function () { goToSlide(galleryIndex + 1); }, 4000);

  /* ── FAVOURITE BUTTON (localStorage) ─────────────────── */
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  function updateFavUI() {
    const isFav = favorites.includes(gameKey);
    if (isFav) {
      $("#favoriteBtn").addClass("active-fav").find("i").removeClass("bi-heart").addClass("bi-heart-fill");
      $("#favBtnText").text("Saved to Favourites");
      $("#favoriteStatus").addClass("saved").html('<i class="bi bi-heart-fill"></i> Saved in favourites (localStorage)');
    } else {
      $("#favoriteBtn").removeClass("active-fav").find("i").removeClass("bi-heart-fill").addClass("bi-heart");
      $("#favBtnText").text("Add to Favourite");
      $("#favoriteStatus").removeClass("saved").html('<i class="bi bi-info-circle"></i> Not saved to favourites yet');
    }
    if (typeof updateBadges === "function") updateBadges();
  }

  updateFavUI();

  $("#favoriteBtn").on("click", function () {
    if (favorites.includes(gameKey)) {
      favorites = favorites.filter(function (item) { return item !== gameKey; });
    } else {
      favorites.push(gameKey);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites)); // LOCALSTORAGE
    updateFavUI();
  });

  /* ── RELATED GAMES ────────────────────────────────────── */
  function renderRelated() {
    const related = Object.entries(gameData)
      .filter(function ([key, g]) { return key !== gameKey && g.genre === game.genre; })
      .slice(0, 3);
    const fallback = Object.entries(gameData)
      .filter(function ([key]) { return key !== gameKey; })
      .slice(0, 3);
    const toShow = related.length > 0 ? related : fallback;

    $("#relatedContainer").empty();
    toShow.forEach(function ([key, g]) {
      const $col = $('<div class="col-lg-4 col-md-6"></div>');
      $col.html(`
        <a href="game-details.html?game=${key}" class="related-card">
          <img src="${g.banner}" alt="${g.title}">
          <div class="related-card-body">
            <div class="related-card-title">${g.title}</div>
            <div class="related-card-meta">
              <span class="related-genre">${g.genre}</span>
              <span class="related-rating">⭐ ${g.rating}/5</span>
            </div>
          </div>
        </a>`);
      $("#relatedContainer").append($col);
    });
  }
  renderRelated();

  /* ── RECENTLY VIEWED (localStorage) ──────────────────── */
  let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
  recentlyViewed = recentlyViewed.filter(function (n) { return n !== gameKey; });
  recentlyViewed.unshift(gameKey);
  if (recentlyViewed.length > 4) recentlyViewed = recentlyViewed.slice(0, 4);
  localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed)); // LOCALSTORAGE

});
