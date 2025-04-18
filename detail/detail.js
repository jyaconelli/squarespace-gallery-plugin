const apiUrl = "https://sheetdb.io/api/v1/j52gedzeoeycb";
const base = "https://www.sherrysuisman.com";

const slug = new URLSearchParams(window.location.search).get("slug");

if (!slug) {
  document.body.innerHTML = "<p>No artwork specified.</p>";
}

fetch(`${apiUrl}/search?slug=${slug}`)
  .then(res => res.json())
  .then(([item]) => {
    if (!item) {
      document.body.innerHTML = "<p>Artwork not found.</p>";
      return;
    }

    document.getElementById("title").textContent = item.title || "";
    document.getElementById("subtitle").textContent = item.subtitle || "";
    document.getElementById("aboutDescription").textContent = item.aboutDescription || "";
    document.getElementById("techniquesDescription").textContent = item.techniquesDescription || "";
    document.getElementById("sizeDescription").textContent = item.sizeDescription || "";

    // Carousel
    const carousel = document.getElementById("carousel");
    const images = (item.carouselImages || "").split(",").map(s => s.trim());
    images.forEach(url => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `<img src="${url}" alt="Artwork image" />`;
      carousel.appendChild(slide);
    });

    new Swiper(".swiper", {
      loop: true,
      pagination: { el: ".swiper-pagination" },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    });

    // Sale info
    if (item.isForSale?.toLowerCase() === "yes") {
      document.getElementById("priceDescription").textContent = item.priceDescription || "";
    } else {
      document.querySelector(".sale-section").style.display = "none";
    }

    // Behind the scenes
    const bts = document.getElementById("behind-the-scenes");
    const btsImages = (item.behindSceneImages || "").split(",").map(s => s.trim());
    btsImages.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      bts.appendChild(img);
    });

    document.getElementById("back-button").addEventListener("click", () => {
      window.parent.history.back();
    });
  })
  .catch(err => {
    console.error(err);
    document.body.innerHTML = "<p>Failed to load artwork.</p>";
  });
