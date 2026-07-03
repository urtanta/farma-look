// public/app.js

document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h1>Farmacias de guardia en Vitoria-Gasteiz</h1>
    <p>Cargando datos...</p>
  `;

  try {
    const response = await fetch("/api/guardias?city=vitoria");

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.length) {
      app.innerHTML = `
        <h1>Farmacias de guardia en Vitoria-Gasteiz</h1>
        <p>No hay farmacias disponibles ahora mismo.</p>
      `;
      return;
    }

    app.innerHTML = `
      <h1>Farmacias de guardia en Vitoria-Gasteiz</h1>
      <div class="pharmacy-list">
        ${data.map(renderFarmacia).join("")}
      </div>
    `;
  } catch (error) {
    app.innerHTML = `
      <h1>Farmacias de guardia en Vitoria-Gasteiz</h1>
      <p>No se pudieron cargar los datos.</p>
      <small>${error.message}</small>
    `;
  }
});

function renderFarmacia(farmacia) {
  return `
    <article class="pharmacy-card">
      <h2>${farmacia.name || farmacia.nombre || "Farmacia"}</h2>
      <p>${farmacia.address || farmacia.direccion || ""}</p>
      <p>${farmacia.phone || farmacia.telefono || ""}</p>
      <p>${farmacia.city || farmacia.ciudad || "Vitoria-Gasteiz"}</p>
    </article>
  `;
}
