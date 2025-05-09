const apiBase =
  "https://firestore.googleapis.com/v1/projects/sherry-suisman-site/databases/(default)/documents/galleryItems";
const base = window.location.host.includes("localhost")
  ? "http://localhost:" + window.location.port
  : "https://www.sherrysuisman.com";

const slug = new URLSearchParams(window.location.search).get("slug");

if (!slug) {
  document.body.innerHTML = "<p>No artwork specified.</p>";
}

// Resize post
function postHeight() {
  const height = document.body.scrollHeight;
  window.parent.postMessage({ type: "resize-iframe", height }, "*");
}

window.addEventListener("load", postHeight);
window.addEventListener("resize", postHeight);

const observer = new MutationObserver(() => postHeight());
observer.observe(document.body, { childList: true, subtree: true });

// Fetch and transform Firestore document
fetch(`${apiBase}/${slug}`)
  .then((res) => {
    if (!res.ok) throw new Error("Not found");
    return res.json();
  })
  .then((doc) => {
    const f = doc.fields || {};
    const item = {};
    for (const key in f) {
      item[key] = Object.values(f[key])[0];
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
    const images = (item.carouselImages || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const mainWrapper = document.getElementById("carousel");
    const thumbWrapper = document.getElementById("carousel-thumbs");

    images.forEach((url) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `<img src="${url}" alt="Artwork image" />`;
      mainWrapper.appendChild(slide);

      const thumb = document.createElement("div");
      thumb.className = "swiper-slide";
      thumb.innerHTML = `<img src="${url}" alt="Thumb image" />`;
      thumbWrapper.appendChild(thumb);
    });

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
    if ((item.isForSale || "").toLowerCase() === "yes") {
      document.getElementById("priceDescription").textContent =
        item.priceDescription || "";
    } else {
      document.querySelector(".sale-section").style.display = "none";
    }

    // Behind the scenes
    const btsWrapper = document.getElementById("behind-the-scenes");
    const btsImages = (item.behindSceneImages || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (btsImages.length < 1) {
      document.querySelector(".bts-section").style.display = "none";
    }

    btsImages.forEach((url) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `<img src="${url}" alt="Behind the scenes image" />`;
      btsWrapper.appendChild(slide);
    });

    new Swiper(".bts-swiper", {
      loop: true,
      spaceBetween: 10,
      slidesPerView: Math.min(btsImages.length, 3),
      pagination: {
        el: ".bts-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".bts-next",
        prevEl: ".bts-prev",
      },
    });
  })
  .catch((err) => {
    console.error(err);
    document.body.innerHTML = "<p>Failed to load artwork.</p>";
  });
