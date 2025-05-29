// modules/clientes/clientes.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔐 CONFIGURACIÓN SEGURA (usa variables de entorno en Netlify)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ➕ Agregar cliente desde URL
window.agregarCliente = async function () {
  const url = prompt("Pega el URL del perfil de Instagram");
  if (!url) return;

  try {
    const res = await fetch("https://kraveai-backend.onrender.com/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await res.json();
    if (!data.success) throw new Error("No se pudo obtener el perfil.");

    await addDoc(collection(db, "clientes"), data.perfil);
    mostrarClientes();
  } catch (err) {
    alert("Error: " + err.message);
  }
};

// Mostrar clientes existentes
async function mostrarClientes() {
  const contenedor = document.getElementById("lista-clientes");
  contenedor.innerHTML = "";

  const snapshot = await getDocs(collection(db, "clientes"));
  snapshot.forEach((docSnap) => {
    const c = docSnap.data();
    const div = document.createElement("div");
    div.className = "cliente-ficha";
    div.innerHTML = `
      <img src="${c.profile_pic}" class="avatar" />
      <div>
        <strong>@${c.username}</strong> ${c.verified ? '<span class="verificado">✔️</span>' : ''}<br />
        Seguidores: ${c.followers.toLocaleString()}
      </div>
      <button onclick="window.location.href='ficha-cliente.html?user=${c.username}'">Ver</button>
    `;
    contenedor.appendChild(div);
  });
}

window.eliminarCliente = async function (id) {
  await deleteDoc(doc(db, "clientes", id));
  mostrarClientes();
};

document.addEventListener("DOMContentLoaded", mostrarClientes);
