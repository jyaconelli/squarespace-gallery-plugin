const apiUrl =
  "https://firestore.googleapis.com/v1/projects/sherry-suisman-site/databases/(default)/documents/galleryItems";
const isLocalHost = window.location.host.includes("localhost");
const base = isLocalHost
  ? "http://localhost:" + window.location.port
  : "https://www.sherrysuisman.com";

const detailsPageUrl = isLocalHost
  ? `${base}/detail/?slug=`
  : `${base}/portfolio/details?slug=`;

// Resize post
function postHeight() {
  const height = document.body.scrollHeight;
  window.parent.postMessage({ type: "resize-iframe", height }, "*");
}

window.addEventListener("load", postHeight);
window.addEventListener("resize", postHeight);
window.addEventListener("DOMNodeInserted", postHeight);
window.addEventListener("DOMNodeRemoved", postHeight);

const observer = new MutationObserver(() => postHeight());
observer.observe(document.body, { childList: true, subtree: true });

const images = document.querySelectorAll("img");

const onReady = () => {
  postHeight();
};
images.forEach((img) => {});

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

      if ("decode" in img) {
        img.decode().then(onReady).catch(onReady);
      } else if (img.complete) {
        // Already loaded (cached)
        onReady();
      } else {
        img.addEventListener("load", onReady);
        img.addEventListener("error", onReady);
      }

      const meta = document.createElement("div");
      meta.className = "gallery-meta";
      // <div class="subtitle">${item.subtitle}</div>
      meta.innerHTML = `
        <div class="title-container">
          <div class="title">${item.title}</div>
          
        </div>
        <div class="cta">View Piece</div>
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
