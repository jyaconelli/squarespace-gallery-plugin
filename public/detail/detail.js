const apiUrl = "https://sheetdb.io/api/v1/j52gedzeoeycb";
const base = window.location.host.includes("localhost")
  ? "http://localhost:" + window.location.port
  : "https://www.sherrysuisman.com";

const slug = new URLSearchParams(window.location.search).get("slug");

if (!slug) {
  document.body.innerHTML = "<p>No artwork specified.</p>";
}

function postHeight() {
  const height = document.body.scrollHeight;
  window.parent.postMessage({ type: "resize-iframe", height }, "*");
}

// Recalculate on load and resize
window.addEventListener("load", postHeight);
window.addEventListener("resize", postHeight);

// Optional: recalc after images load
const observer = new MutationObserver(() => postHeight());
observer.observe(document.body, { childList: true, subtree: true });

fetch(`${apiUrl}/search?slug=${slug}`)
  .then((res) => res.json())
  .then(([item]) => {
    if (!item) {
      document.body.innerHTML = "<p>Artwork not found.</p>";
      return;
    }

    document.getElementById("title").textContent = item.title || "";
    document.title = `${item.title} – Sherry Suisman Gallery`;
    window.parent.postMessage(
      { type: "update-title", title: document.title },
      "*"
    );
    document.getElementById("subtitle").textContent = item.subtitle || "";
    document.getElementById("aboutDescription").textContent =
      item.aboutDescription || "";
    document.getElementById("techniquesDescription").textContent =
      item.techniquesDescription || "";
    document.getElementById("sizeDescription").textContent =
      item.sizeDescription || "";

    // Carousel
    const images = (item.carouselImages || "").split(",").map((s) => s.trim());

    const mainWrapper = document.getElementById("carousel");
    const thumbWrapper = document.getElementById("carousel-thumbs");

    images.forEach((url) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `<a href="${url}" class="glightbox" data-gallery="carousel">
      <img src="${url}" alt="Artwork image" />
    </a>`;
      mainWrapper.appendChild(slide);

      const thumb = document.createElement("div");
      thumb.className = "swiper-slide";
      thumb.innerHTML = `<img src="${url}" alt="Thumb image" />`;
      thumbWrapper.appendChild(thumb);
    });

    // Initialize Swipers
    const thumbsSwiper = new Swiper(".swiper-thumbs", {
      spaceBetween: 10,
      slidesPerView: 3,
      freeMode: true,
      loop: true,
      watchSlidesProgress: true,
    });

    const mainSwiper = new Swiper(".main-swiper", {
      loop: true,
      spaceBetween: 10,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: thumbsSwiper,
      },
    });

    // Sale info
    if (item.isForSale?.toLowerCase() === "yes") {
      document.getElementById("priceDescription").textContent =
        item.priceDescription || "";
    } else {
      document.querySelector(".sale-section").style.display = "none";
    }

    // Behind the scenes
    const btsWrapper = document.getElementById("behind-the-scenes");
    const btsImages = (item.behindSceneImages || "")
      .split(",")
      .map((s) => s.trim());
    btsImages.forEach((url) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      slide.innerHTML = `<a href="${url}" class="glightbox-bts" data-gallery="carousel">
      <img src="${url}" alt="Behind the scenes image" />
    </a>`;
      btsWrapper.appendChild(slide);
    });

    const btsLightbox = GLightbox({
      selector: ".glightbox-bts",
    });
    const lightbox = GLightbox({
      selector: ".glightbox",
    });

    new Swiper(".bts-swiper", {
      loop: true,
      spaceBetween: 10,
      slidesPerView: Math.min(5, btsImages.length),
      pagination: {
        el: ".bts-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".bts-next",
        prevEl: ".bts-prev",
      },
    });

    document.getElementById("back-button").addEventListener("click", () => {
      window.parent.history.back();
    });
  })
  .catch((err) => {
    console.error(err);
    document.body.innerHTML = "<p>Failed to load artwork.</p>";
  });
