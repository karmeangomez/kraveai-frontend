// modules/proxyStatus.js

// Este archivo es un placeholder visual para el futuro panel de estado de proxies
// Mostrará visualmente: IP, país simulado, estado (activo, en descanso, fallido)

const proxyData = [
  { ip: "198.23.239.134", pais: "🇲🇽", estado: "activo" },
  { ip: "207.244.217.165", pais: "🇨🇴", estado: "descanso" },
  { ip: "185.183.107.41", pais: "🇧🇷", estado: "activo" },
];

function renderProxyStatus() {
  const contenedor = document.getElementById("proxy-panel");
  if (!contenedor) return;

  proxyData.forEach((proxy) => {
    const div = document.createElement("div");
    div.className = `proxy-item ${proxy.estado}`;
    div.innerHTML = `
      <strong>${proxy.ip}</strong> - ${proxy.pais} - <em>${proxy.estado}</em>
    `;
    contenedor.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", renderProxyStatus);
