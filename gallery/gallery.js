const apiUrl = "https://sheetdb.io/api/v1/j52gedzeoeycb";

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  if (slug) {
    // Detail View Mode
    fetch(`${apiUrl}/search?slug=${slug}`)
      .then((res) => res.json())
      .then((results) => {
        const item = results[0];
        if (!item) {
          document.body.innerHTML = "<p>Item not found.</p>";
          return;
        }

        document.getElementById("masonry-gallery").style.display = "none";
        document.getElementById("detail-view").style.display = "block";

        document.getElementById("detail-title").textContent = item.title;
        document.getElementById("detail-description").textContent =
          item.description;

        const carousel = document.getElementById("detail-carousel");
        const galleryImages = item.galleryImages
          .split(",")
          .map((url) => url.trim());

        galleryImages.forEach((url) => {
          const img = document.createElement("img");
          img.src = url;
          img.style.width = "30%";
          img.style.borderRadius = "6px";
          carousel.appendChild(img);
        });
      })
      .catch((err) => console.error("Failed to load detail view", err));
  } else {
    // Gallery View Mode
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const container = document.getElementById("masonry-gallery");
        data.forEach((item) => {
          const div = document.createElement("div");
          div.className = "gallery-item";
          div.innerHTML = `
            <a href="?slug=${item.slug}">
              <img src="${item.thumbnail}" alt="${item.title}" />
            </a>
          `;
          container.appendChild(div);
        });
      });
  }
});
