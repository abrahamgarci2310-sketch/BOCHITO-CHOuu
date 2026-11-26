/* ---------- MENÚ EN CELULAR ---------- */
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const abierto = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", abierto);
});
nav.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  })
);

/* ---------- CARRO QUE AVANZA Y DEJA TEXTO ---------- */
const car = document.getElementById("car");
const road = document.querySelector(".road");

const speed = 140;   // píxeles por segundo
let x = 0, dir = 1, last = null;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const frases = ["¡FIESTA!", "¡A BAILAR!", "BOCHO SHOW", "¡DIVERSIÓN!"];  // cámbialas o deja solo una
let fraseIdx = 0, ultimoTexto = 0;

function soltarTexto(posX, direccion) {
  const t = document.createElement("span");
  t.className = "trail";
  t.textContent = frases[fraseIdx++ % frases.length];
  // sale por la parte de atrás del carro
  t.style.left = (direccion === 1 ? posX : posX + car.clientWidth) + "px";
  road.appendChild(t);
  t.addEventListener("animationend", () => t.remove());
}

function frame(time) {
  if (last === null) last = time;
  const dt = (time - last) / 1000;
  last = time;

  const maxX = road.clientWidth - car.clientWidth;
  x += dir * speed * dt;

  if (x >= maxX) { x = maxX; dir = -1; }
  if (x <= 0)    { x = 0;    dir = 1;  }

  if (Math.abs(x - ultimoTexto) > 160) {   // cada 160px suelta un texto
    soltarTexto(x, dir);
    ultimoTexto = x;
  }

  const bounce = Math.sin(time / 90) * 1.2;
  const flip = dir === 1 ? 1 : -1;
  car.style.transform = `translate(${x}px, ${bounce}px) scaleX(${flip})`;

  requestAnimationFrame(frame);
}

if (reduceMotion) {
  car.style.left = "50%";
  car.style.transform = "translateX(-50%)";
} else {
  requestAnimationFrame(frame);
}

/* ---------- MÚSICA DE FONDO ---------- */
const musica = document.getElementById("musica");
const musicBtn = document.getElementById("musicBtn");
musica.volume = 0.5;

function actualizarBoton() {
  musicBtn.textContent = musica.paused ? "🔇" : "🔊";
}

// Intenta reproducir al cargar. Si el navegador lo bloquea,
// arranca con el primer clic, toque o tecla del visitante.
function iniciarMusica() {
  musica.play().then(actualizarBoton).catch(() => {
    const arrancar = () => {
      musica.play().then(actualizarBoton).catch(() => {});
      ["pointerdown", "keydown", "touchstart"].forEach(ev =>
        document.removeEventListener(ev, arrancar)
      );
    };
    ["pointerdown", "keydown", "touchstart"].forEach(ev =>
      document.addEventListener(ev, arrancar, { once: false })
    );
    actualizarBoton();
  });
}
iniciarMusica();

// Botón para pausar o reanudar
musicBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (musica.paused) musica.play(); else musica.pause();
  actualizarBoton();
});
musica.addEventListener("play", actualizarBoton);
musica.addEventListener("pause", actualizarBoton);