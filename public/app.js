document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");

  try {
    const response = await fetch("/api/guardias?city=vitoria");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error cargando datos");
    }

    if (!data.length) {
      app.innerHTML = `
        <h1>Farmacias de guardia en Vitoria-Gasteiz</h1>
        <p>No hay datos disponibles todavía.</p>
      `;
      return;
    }

    app.innerHTML = `
      <h1>Farmacias de guardia en Vitoria-Gasteiz</h1>
      <section class="list">
        ${data.map(renderFarmacia).join("")}
      </section>
    `;
  } catch (error) {
    app.innerHTML = `
      <h1>Farmacias de guardia en Vitoria-Gasteiz</h1>
      <p class="error">No se pudieron cargar los datos.</p>
      <small>${error.message}</small>
    `;
  }
});

function renderFarmacia(item) {
  const farmacia = item.pharmacies || {};

  return `
    <article class="card">
      <h2>${farmacia.name || "Farmacia"}</h2>
      <p>${farmacia.address || ""}</p>
      <p>${farmacia.phone || ""}</p>
      <p><strong>Inicio:</strong> ${formatDate(item.starts_at)}</p>
      <p><strong>Fin:</strong> ${formatDate(item.ends_at)}</p>
    </article>
  `;
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("es-ES");
}
