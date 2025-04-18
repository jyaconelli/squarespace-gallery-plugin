const apiUrl = "https://sheetdb.io/api/v1/j52gedzeoeycb";
const base = "https://www.sherrysuisman.com";


function transformDriveUrl(url) {
  const match = url.match(/[-\w]{25,}/);
  return match ? `https://drive.google.com/thumbnail?sz=w640&id=${match[0]}` : url;
}


fetch(apiUrl)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("masonry-gallery");

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "gallery-item";

      const img = document.createElement("img");
      img.src = transformDriveUrl(item.coverImage);
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
  .catch(err => console.error("Error loading gallery:", err));
