document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://sheetdb.io/api/v1/YOUR_API_ID";

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      const container = document.querySelector("#masonry-gallery");
      if (!container) return;
      data.forEach(item => {
        const div = document.createElement("div");
        div.className = "gallery-item";
        div.innerHTML = `
          <a href="/portfolio/${item.slug}">
            <img src="${item.thumbnail}" alt="${item.title}" />
          </a>
        `;
        container.appendChild(div);
      });
    });
});



