document.addEventListener("DOMContentLoaded", function () {
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("acceptCookies");
  const declineBtn = document.getElementById("declineCookies");

  if (cookieBanner && !localStorage.getItem("cookieChoice")) {
    cookieBanner.style.display = "flex";
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem("cookieChoice", "accepted");
      cookieBanner.style.display = "none";
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      localStorage.setItem("cookieChoice", "declined");
      cookieBanner.style.display = "none";
    });
  }
});

$(document).ready(function () {
  const games = [
    {
      title: "Super Mario Odyssey",
      desc: "Join Mario on a massive 3D adventure across different kingdoms to rescue Princess Peach.",
      genre: "Adventure",
      mode: "Single player",
      image: "../Games/images/SMO_image1.avif"
    },
    {
      title: "Animal Crossing",
      desc: "Create your own island paradise and enjoy a relaxing life simulation with friends.",
      genre: "Simulation",
      mode: "Relaxing gameplay",
      image: "../Games/images/AC_image1.png"
    },
    {
      title: "Overcooked 2",
      desc: "Work together in chaotic kitchens to prepare meals under pressure in this fun co-op game.",
      genre: "Party / Cooking",
      mode: "Multiplayer co-op",
      image: "../Games/images/O2_image1.webp"
    }
  ];

  function showGame(index) {
    const game = games[index];

    $("#gameImage").attr("src", game.image);
    $("#gameTitle").text(game.title);
    $("#gameDesc").text(game.desc);
    $("#gameGenre").text(game.genre);
    $("#gameMode").text(game.mode);

    sessionStorage.setItem("selectedNintendoGame", index);

    $(".game-btn").removeClass("active");
    $('.game-btn[data-index="' + index + '"]').addClass("active");
  }

  const saved = sessionStorage.getItem("selectedNintendoGame");
  if (saved !== null) {
    showGame(Number(saved));
  }

  $(".game-btn").click(function () {
    const index = $(this).data("index");
    showGame(index);
  });

  $("#saveFavoriteBtn").click(function () {
  const selected = sessionStorage.getItem("selectedNintendoGame") || 0;

  // map index → game key (VERY IMPORTANT)
  const gameKeys = ["MarioOdyssey", "AnimalCrossing", "Overcooked2"];
  const gameKey = gameKeys[selected];

  let favs = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favs.includes(gameKey)) {
    favs.push(gameKey); // ✅ save ONLY KEY
    localStorage.setItem("favorites", JSON.stringify(favs));

    $("#favoriteDisplay").html("❤️ Added to favourites!");
  } else {
    $("#favoriteDisplay").html("⚠️ Already in favourites!");
  }

  // update navbar badge
  if (typeof updateBadges === "function") {
    updateBadges();
  }
});

  $("#saveFavoriteBtn").click(function () {
    const selected = sessionStorage.getItem("selectedNintendoGame") || 0;
    const gameName = games[selected].title;

    localStorage.setItem("favoriteNintendoGame", gameName);
    $("#favoriteDisplay").html("⭐ <strong>Your favorite game:</strong> " + gameName);
  });

  const fav = localStorage.getItem("favoriteNintendoGame");
  if (fav !== null) {
    $("#favoriteDisplay").html("⭐ <strong>Your favorite game:</strong> " + fav);
  }
});