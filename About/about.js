document.addEventListener("DOMContentLoaded", function () {
  const aboutBg = document.querySelector(".about-bg");

  if (aboutBg) {
    document.addEventListener("mousemove", function (e) {
      const x = (window.innerWidth / 2 - e.clientX) / 40;
      const y = (window.innerHeight / 2 - e.clientY) / 40;

      aboutBg.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const aboutBg = document.querySelector(".about-bg");

  if (aboutBg) {
    document.addEventListener("mousemove", function (e) {
      const x = (window.innerWidth / 2 - e.clientX) / 40;
      const y = (window.innerHeight / 2 - e.clientY) / 40;

      aboutBg.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
    });
  }

  const animatedItems = document.querySelectorAll(".about-animate");

  setTimeout(() => {
    animatedItems.forEach((item) => {
      item.classList.add("show");
    });
  }, 200);
});