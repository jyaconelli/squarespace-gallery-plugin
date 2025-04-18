const apiUrl = "https://sheetdb.io/api/v1/j52gedzeoeycb";

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  if (slug) {
    // Load detail view
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
          carousel.appendChild(img);
        });

        // Back button logic
        document.getElementById("back-button").addEventListener("click", () => {
          window.parent.history.back(); // Navigate parent window back
        });
      })
      .catch((err) => console.error("Failed to load detail view", err));
  } else {
    // Load gallery view
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const container = document.getElementById("masonry-gallery");

        data.forEach((item) => {
          const div = document.createElement("div");
          div.className = "gallery-item";
          const img = document.createElement("img");
          img.src = item.thumbnail;
          img.alt = item.title;

          img.addEventListener("click", () => {
            // Redirect parent window to the detail page
            window.parent.location.href = `/portfolio/details?slug=${item.slug}`;
          });

          div.appendChild(img);
          container.appendChild(div);
        });
      })
      .catch((err) => console.error("Failed to load gallery", err));
  }
});
