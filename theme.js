const theme = {
  fondo: "#000000",
  texto: "#ffffff",
  primario: "#ffffff",
  botones: "#111111",
  acento: "#4d4d4d",
  azulIA: "#00c6ff"
};

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.backgroundColor = theme.fondo;
  document.body.style.color = theme.texto;

  const buttons = document.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.style.backgroundColor = theme.botones;
    btn.style.color = theme.primario;
  });

  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    input.style.backgroundColor = theme.acento;
    input.style.color = theme.texto;
  });
});
