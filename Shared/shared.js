function setCookie(name, value, days) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${days * 86400}; path=/`;
}

function getCookie(name) {
  const found = document.cookie.split("; ").find(r => r.startsWith(name + "="));
  return found ? decodeURIComponent(found.split("=")[1]) : null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; max-age=0; path=/`;
}

function getFavourites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function getCartQty() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateBadges() {
  const favCount = getFavourites().length;
  const cartCount = getCartQty();

  document.querySelectorAll(".fav-badge-count").forEach(el => {
    el.textContent = favCount;
    el.style.display = favCount > 0 ? "flex" : "none";
  });

  document.querySelectorAll(".cart-badge-count").forEach(el => {
    el.textContent = cartCount;
    el.style.display = cartCount > 0 ? "flex" : "none";
  });
}

function updateAuthButton() {
  const user = getCookie("username");
  const btn = document.getElementById("authNavBtn");
  if (!btn) return;

  btn.innerHTML = user
    ? `<i class="bi bi-person-fill me-1"></i>${user}`
    : `<i class="bi bi-person me-1"></i>Login`;
}

function applyTheme() {
  const isDark = localStorage.getItem("darkMode") === "true";
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  const icon = document.getElementById("themeIcon");
  if (icon) {
    icon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-fill";
  }
}

function showToast(msg, type) {
  document.getElementById("globalToast")?.remove();

  const t = document.createElement("div");
  t.id = "globalToast";
  t.style.cssText = `
    position:fixed;
    bottom:24px;
    left:50%;
    transform:translateX(-50%) translateY(20px);
    padding:12px 28px;
    border-radius:100px;
    font-family:'DM Sans','Segoe UI',sans-serif;
    font-size:0.9rem;
    font-weight:600;
    z-index:99999;
    opacity:0;
    transition:all 0.35s ease;
    white-space:nowrap;
    pointer-events:none;
    box-shadow:0 8px 32px rgba(0,0,0,0.18);
    background:${type === "error" ? "#e60012" : "#1a1a1a"};
    color:#fff;
  `;

  t.textContent = msg;
  document.body.appendChild(t);

  setTimeout(() => {
    t.style.opacity = "1";
    t.style.transform = "translateX(-50%) translateY(0)";
  }, 10);

  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 400);
  }, 2800);
}

function initAuthModal() {
  const modal = document.getElementById("authModal");
  const loginBox = document.getElementById("loginBox");
  const signupBox = document.getElementById("signupBox");

  if (!modal || !loginBox || !signupBox) return;

  const showLogin = () => {
    loginBox.style.display = "block";
    signupBox.style.display = "none";
  };

  const showSignup = () => {
    loginBox.style.display = "none";
    signupBox.style.display = "block";
  };

  document.getElementById("authNavBtn")?.addEventListener("click", function () {
    if (getCookie("username")) {
      const shouldLogout = confirm("You are already logged in. Do you want to log out?");
      if (shouldLogout) {
        deleteCookie("username");
        updateAuthButton();
        showToast("Logged out successfully.");
      }
    } else {
      modal.style.display = "flex";
      showLogin();
    }
  });

  document.getElementById("closeAuthModal")?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.style.display = "none";
  });

  document.getElementById("showSignup")?.addEventListener("click", function (e) {
    e.preventDefault();
    showSignup();
  });

  document.getElementById("showLogin")?.addEventListener("click", function (e) {
    e.preventDefault();
    showLogin();
  });

  document.getElementById("signupForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();

    if (!username || !password || !confirm) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    if (password !== confirm) {
      showToast("Passwords do not match.", "error");
      return;
    }

    localStorage.setItem("savedUsername", username);
    localStorage.setItem("savedPassword", password);

    showToast("Account created successfully.");
    this.reset();
    showLogin();
  });

  document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");

    if (username === savedUsername && password === savedPassword) {
      setCookie("username", username, 7);
      updateAuthButton();
      modal.style.display = "none";
      this.reset();
      showToast("Login successful.");
    } else {
      showToast("Invalid username or password.", "error");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  applyTheme();
  updateBadges();
  updateAuthButton();
  initAuthModal();

  document.getElementById("darkModeToggle")?.addEventListener("click", function () {
    const isDark = localStorage.getItem("darkMode") === "true";
    localStorage.setItem("darkMode", String(!isDark));
    applyTheme();
  });
});
