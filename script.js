
/* ============ 3D BACKGROUND (Three.js) ============ */
(function () {
  const canvas = document.getElementById("bg-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    70,
    innerWidth / innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 55;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  // Particle starfield
  const count = 1400;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 260;
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x8a7bff,
    size: 0.35,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const stars = new THREE.Points(geo, mat);
  scene.add(stars);

  // Wireframe floating shapes
  const shapes = [];
  const geos = [
    new THREE.IcosahedronGeometry(6, 0),
    new THREE.OctahedronGeometry(5, 0),
    new THREE.TorusGeometry(4.5, 1.1, 8, 24),
    new THREE.TetrahedronGeometry(6, 0),
  ];
  const colors = [0x6c5ce7, 0x00d4ff, 0xff4d8d, 0x8a7bff];
  geos.forEach((g, i) => {
    const m = new THREE.MeshBasicMaterial({
      color: colors[i],
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(
      (Math.random() - 0.5) * 70,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 30 - 10,
    );
    mesh.userData.speed = 0.002 + Math.random() * 0.004;
    mesh.userData.float = Math.random() * Math.PI * 2;
    scene.add(mesh);
    shapes.push(mesh);
  });

  // Mouse interaction
  let mx = 0,
    my = 0;
  document.addEventListener("mousemove", (e) => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  });

  // Scroll influence
  let scrollY = 0;
  addEventListener("scroll", () => (scrollY = window.scrollY));

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    stars.rotation.y = t * 0.03 + mx * 0.3;
    stars.rotation.x = my * 0.2;
    stars.position.y = scrollY * 0.02;

    shapes.forEach((s, i) => {
      s.rotation.x += s.userData.speed;
      s.rotation.y += s.userData.speed * 0.8;
      s.position.y += Math.sin(t * 0.6 + s.userData.float) * 0.012;
      s.position.x += Math.cos(t * 0.4 + s.userData.float) * 0.008;
    });

    camera.position.x += (mx * 4 - camera.position.x) * 0.03;
    camera.position.y += (-my * 4 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();

/* ============ CUSTOM CURSOR ============ */
const cursor = document.getElementById("cursor");
addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});
document.querySelectorAll("a,button,.card").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("big"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("big"));
});

/* ============ TYPING EFFECT ============ */
const phrases = [
  "Senior Frontend Engineer",
  "React · Next.js · TypeScript",
  "Angular · AngularJS",
  "Enterprise SaaS Architect",
];
const typedEl = document.getElementById("typed");
let pi = 0,
  ci = 0,
  deleting = false;
function type() {
  const p = phrases[pi];
  typedEl.textContent = p.substring(0, ci);
  if (!deleting) {
    ci++;
    if (ci > p.length) {
      deleting = true;
      setTimeout(type, 1400);
      return;
    }
  } else {
    ci--;
    if (ci < 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      ci = 0;
    }
  }
  setTimeout(type, deleting ? 40 : 85);
}
type();

/* ============ SCROLL REVEAL ============ */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        // animate bars
        e.target.querySelectorAll(".bar i").forEach((b) => {
          b.style.width = b.dataset.w + "%";
        });
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ============ 3D TILT ON CARDS ============ */
document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    const rx = (y / r.height - 0.5) * -12;
    const ry = (x / r.width - 0.5) * 12;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
  });
});

/* ============ NAV ACTIVE + MOBILE ============ */
const sections = document.querySelectorAll("section, header.hero");
const navA = document.querySelectorAll(".nav-links a");
addEventListener("scroll", () => {
  let cur = "home";
  sections.forEach((s) => {
    if (scrollY >= s.offsetTop - 200) cur = s.id;
  });
  navA.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + cur);
  });
});
document.getElementById("menuBtn").addEventListener("click", () => {
  const n = document.getElementById("navLinks");
  n.style.display = n.style.display === "flex" ? "none" : "flex";
  n.style.position = "absolute";
  n.style.top = "64px";
  n.style.right = "6vw";
  n.style.flexDirection = "column";
  n.style.background = "rgba(5,6,10,.95)";
  n.style.padding = "20px";
  n.style.borderRadius = "14px";
  n.style.border = "1px solid rgba(255,255,255,.1)";
});
