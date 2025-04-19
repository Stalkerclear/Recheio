function generateLink() {
  const dest = document.getElementById('dest').value;
  if (!dest) return alert('Informe uma URL de destino');
  const link = `${window.location.origin}/track?dest=${encodeURIComponent(dest)}`;
  document.getElementById('link').innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
  fetchResult();
}

function fetchResult() {
  fetch('/result')
    .then(res => res.json())
    .then(data => {
      if (!data) return;
      const display = `
IP: ${data.ip}
Cidade: ${data.city}
País: ${data.country}
ISP: ${data.isp}
Timestamp: ${data.timestamp}
      `.trim();
      document.getElementById('dataDisplay').textContent = display;
      document.getElementById('output').style.display = 'block';
    });
}

function copyAndClear() {
  const text = document.getElementById('dataDisplay').textContent;
  navigator.clipboard.writeText(text).then(() => {
    fetch('/clear', { method: 'POST' }).then(() => {
      document.getElementById('output').style.display = 'none';
      document.getElementById('dataDisplay').textContent = '';
      alert('Dados copiados e apagados!');
    });
  });
        }
