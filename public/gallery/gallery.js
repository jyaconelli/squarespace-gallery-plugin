const apiUrl = "https://firestore.googleapis.com/v1/projects/sherry-suisman-site/databases/(default)/documents/galleryItems";
const isLocalHost = window.location.host.includes("localhost");
const base = isLocalHost
  ? "http://localhost:" + window.location.port
  : "https://www.sherrysuisman.com";

const detailsPageUrl = isLocalHost
  ? `${base}/detail/?slug=`
  : `${base}/portfolio/details?slug=`;

fetch(apiUrl)
  .then((res) => res.json())
  .then((json) => {
    const container = document.getElementById("masonry-gallery");
    const docs = json.documents || [];

    docs.forEach((doc) => {
      const f = doc.fields || {};
      const item = {
        slug: f.slug?.stringValue || "",
        title: f.title?.stringValue || "",
        subtitle: f.subtitle?.stringValue || "",
        coverImage: f.coverImage?.stringValue || "",
      };

      if (!item.slug || !item.coverImage) return;

      const div = document.createElement("div");
      div.className = "gallery-item";

      const img = document.createElement("img");
      img.src = item.coverImage;
      img.alt = item.title || "Artwork";

      const meta = document.createElement("div");
      meta.className = "gallery-meta";
      meta.innerHTML = `
        <div class="title">${item.title}</div>
        <div class="subtitle">${item.subtitle}</div>
      `;

      img.addEventListener("click", () => {
        window.parent.location.href = `${detailsPageUrl}${item.slug}`;
      });

      div.appendChild(img);
      div.appendChild(meta);
      container.appendChild(div);
    });
  })
  .catch((err) => console.error("Error loading gallery:", err));
