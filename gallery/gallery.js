const apiUrl = "https://sheetdb.io/api/v1/j52gedzeoeycb";
const base = "https://www.sherrysuisman.com";

document.addEventListener("DOMContentLoaded", function () {
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("masonry-gallery");

      data.forEach((item) => {
        const div = document.createElement("div");
        div.className = "gallery-item";

        const img = document.createElement("img");
        img.src = item.coverImage;
        img.alt = item.title || "Artwork";

        const meta = document.createElement("div");
        meta.className = "gallery-meta";
        meta.innerHTML = `
          <div class="title">${item.title || ""}</div>
          <div class="subtitle">${item.subtitle || ""}</div>
        `;

        img.addEventListener("click", () => {
          window.parent.location.href = `${base}/portfolio/details?slug=${item.slug}`;
        });

        div.appendChild(img);
        div.appendChild(meta);
        container.appendChild(div);
      });
    })
    .catch((err) => console.error("Error loading gallery:", err));
});
