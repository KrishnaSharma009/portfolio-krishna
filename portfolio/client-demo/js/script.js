/* ============================================================
   ANIMATION PORTFOLIO — SCRIPT.JS
   Lightweight vanilla JavaScript. No libraries, no backend.
   ------------------------------------------------------------
   CONTENTS
   01. Project data (edit your project details here)
   02. Navbar (scroll state + mobile menu)
   03. Scroll reveal (IntersectionObserver)
   04. Project filters (projects page)
   05. Project detail modal
   06. Contact form (client-side validation + mailto)
   07. Back to top
   ============================================================ */

"use strict";

/* ============================================================
   01. PROJECT DATA
   Edit this array to update the project detail pop-ups.
   Each object MUST have a unique "id" that matches the
   data-project attribute on the matching card in the HTML.
   ============================================================ */
const PROJECTS = {
  "the-lost-frame": {
    title: "The Lost Frame",
    category: "3D Animation",
    year: "2026",
    tools: ["Blender", "After Effects", "Photoshop"],
    // Replace with your video (assets/videos/the-lost-frame.mp4) or keep the image
    image: "assets/images/project-01.svg",
    video: "", // e.g. "assets/videos/the-lost-frame.mp4" — leave "" to use the image
    description:
      "A short animated film following a forgotten photograph that wakes up inside an abandoned archive. " +
      "Placeholder text — replace with a short synopsis of your own project: the idea, the mood and what you wanted to explore.",
    process: [
      "Concept & story beats",
      "Storyboard / animatic",
      "Modeling & texturing",
      "Character animation",
      "Lighting & compositing",
      "Final render & sound",
    ],
    gallery: [
      "assets/images/project-01.svg",
      "assets/images/project-03.svg",
      "assets/images/project-05.svg",
    ],
    credits: "Directed, modeled and animated by [ARTIST NAME]. Sound placeholder.",
  },
  midnight: {
    title: "Midnight",
    category: "2D Animation",
    year: "2026",
    tools: ["After Effects", "Photoshop", "Premiere Pro"],
    image: "assets/images/project-02.svg",
    video: "",
    description:
      "A hand-drawn loop series about a city that only wakes up after midnight. " +
      "Placeholder text — describe your film, its style and the feeling you were going for.",
    process: [
      "Moodboard & style frames",
      "Key illustrations",
      "Rigging / frame-by-frame",
      "Secondary animation",
      "Grading & export",
    ],
    gallery: [
      "assets/images/project-02.svg",
      "assets/images/project-04.svg",
      "assets/images/project-06.svg",
    ],
    credits: "Animation and design by [ARTIST NAME]. Music placeholder.",
  },
  "motion-studies": {
    title: "Motion Studies",
    category: "Motion Graphics",
    year: "2025",
    tools: ["After Effects", "Illustrator"],
    image: "assets/images/project-03.svg",
    video: "",
    description:
      "A growing collection of typographic and shape-based motion experiments exploring rhythm, " +
      "timing and easing. Placeholder text — swap in your own description.",
    process: [
      "Reference & rhythm boards",
      "Style frames",
      "Animation tests",
      "Refined loops",
    ],
    gallery: [
      "assets/images/project-03.svg",
      "assets/images/project-01.svg",
      "assets/images/project-02.svg",
    ],
    credits: "Design & animation by [ARTIST NAME].",
  },
  "character-lab": {
    title: "Character Lab",
    category: "Character Design",
    year: "2025",
    tools: ["Photoshop", "Blender", "Illustrator"],
    image: "assets/images/project-04.svg",
    video: "",
    description:
      "An ongoing character design practice: silhouettes, expressions, turnarounds and " +
      "small 3D sculpts. Placeholder text — describe your own character work here.",
    process: [
      "Silhouette exploration",
      "Expression sheets",
      "Turnarounds",
      "Color & styling",
      "3D sculpt tests",
    ],
    gallery: [
      "assets/images/project-04.svg",
      "assets/images/project-06.svg",
      "assets/images/project-02.svg",
    ],
    credits: "All characters designed by [ARTIST NAME].",
  },
  beyond: {
    title: "Beyond",
    category: "Short Film",
    year: "2025",
    tools: ["Blender", "After Effects", "Premiere Pro"],
    image: "assets/images/project-05.svg",
    video: "",
    description:
      "A one-minute short about leaving a familiar world behind. " +
      "Placeholder text — replace with your film's logline and intent.",
    process: [
      "Story & script",
      "Storyboard",
      "Previz",
      "Production",
      "Post & sound",
    ],
    gallery: [
      "assets/images/project-05.svg",
      "assets/images/project-01.svg",
      "assets/images/project-03.svg",
    ],
    credits: "A film by [ARTIST NAME]. Made as an academic project.",
  },
  "visual-experiments": {
    title: "Visual Experiments",
    category: "Illustration",
    year: "2024",
    tools: ["Photoshop", "Illustrator", "Blender"],
    image: "assets/images/project-06.svg",
    video: "",
    description:
      "Sketches, illustrations and visual development pieces created between projects — " +
      "studies of light, color and atmosphere. Placeholder text — make it yours.",
    process: [
      "Daily sketches",
      "Color studies",
      "Finished pieces",
    ],
    gallery: [
      "assets/images/project-06.svg",
      "assets/images/project-04.svg",
      "assets/images/project-05.svg",
    ],
    credits: "Artwork by [ARTIST NAME].",
  },
};

/* ============================================================
   02. NAVBAR — condensed state on scroll + mobile menu
   ============================================================ */
const header = document.querySelector(".site-header");

function onScroll() {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Mobile hamburger menu */
const menuToggle = document.querySelector(".nav__toggle");
const mobileMenu = document.querySelector(".mobile-menu");

function closeMobileMenu() {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  // Close when a link or the CTA inside the menu is used
  mobileMenu.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", closeMobileMenu);
  });

  // Close if resized up to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMobileMenu();
  });
}

/* ============================================================
   03. SCROLL REVEAL
   Any element with class="reveal" fades up when it scrolls
   into view. Add reveal--d1 … reveal--d5 for stagger.
   ============================================================ */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealItems.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target); // reveal once, keep it light
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealItems.forEach((el) => io.observe(el));
} else {
  // Very old browsers: just show everything
  revealItems.forEach((el) => el.classList.add("in-view"));
}

/* ============================================================
   04. PROJECT FILTERS (projects page)
   Cards carry data-category="3d" etc.; buttons data-filter.
   ============================================================ */
const filterBar = document.querySelector(".filters");
const filterCards = document.querySelectorAll("[data-filterable]");

if (filterBar && filterCards.length) {
  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;

    // Update active pill
    filterBar
      .querySelectorAll("button")
      .forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const filter = btn.dataset.filter;

    filterCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !show);
    });
  });
}

/* ============================================================
   05. PROJECT DETAIL MODAL
   Any element with data-project="<id>" opens the matching
   project from the PROJECTS object above.
   ============================================================ */
const modal = document.querySelector(".modal");
let lastFocused = null;

function buildModalBody(p) {
  // Hero media: video if provided, otherwise image
  const media = p.video
    ? `<video src="${p.video}" controls muted loop playsinline preload="metadata" poster="${p.image}"></video>`
    : `<img src="${p.image}" alt="${p.title} — main visual" loading="lazy">`;

  return `
    <h2>${p.title}</h2>
    <div class="modal__meta">
      <span><b>Category</b> — ${p.category}</span>
      <span><b>Year</b> — ${p.year}</span>
    </div>
    <div class="modal__media">${media}</div>

    <h3>Overview</h3>
    <p>${p.description}</p>

    <h3>Tools Used</h3>
    <ul class="chips">${p.tools.map((t) => `<li>${t}</li>`).join("")}</ul>

    <h3>Process</h3>
    <ol class="steps">
      ${p.process
        .map((s, i) => `<li><b>${String(i + 1).padStart(2, "0")}</b> ${s}</li>`)
        .join("")}
    </ol>

    <h3>Final Output — Gallery</h3>
    <div class="gallery">
      ${p.gallery.map((g) => `<img src="${g}" alt="${p.title} — gallery image" loading="lazy">`).join("")}
    </div>

    <p class="modal__credits">${p.credits}</p>
  `;
}

function openModal(id, trigger) {
  const project = PROJECTS[id];
  if (!project || !modal) return;

  modal.querySelector(".modal__dialog .modal__body").innerHTML = buildModalBody(project);
  modal.classList.add("is-open");
  document.body.style.overflow = "hidden"; // freeze page scroll
  lastFocused = trigger;
  modal.querySelector(".modal__close").focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

// Wire up every card / button that references a project
document.querySelectorAll("[data-project]").forEach((el) => {
  el.addEventListener("click", () => openModal(el.dataset.project, el));
});

if (modal) {
  modal.querySelector(".modal__close").addEventListener("click", closeModal);
  modal.querySelector(".modal__backdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
}

/* ============================================================
   06. CONTACT FORM
   Static-site friendly: validates on the client, shows a
   confirmation, and opens the visitor's email app via mailto
   with the message pre-filled (no backend, no paid service).
   ============================================================ */
const form = document.querySelector("[data-contact-form]");

if (form) {
  const note = form.querySelector(".form__note");
  const fields = {
    name: form.querySelector("#cf-name"),
    email: form.querySelector("#cf-email"),
    subject: form.querySelector("#cf-subject"),
    message: form.querySelector("#cf-message"),
  };

  const validators = {
    name: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    subject: (v) => v.trim().length >= 3,
    message: (v) => v.trim().length >= 10,
  };

  function validateField(key) {
    const input = fields[key];
    const field = input.closest(".field");
    const ok = validators[key](input.value);
    field.classList.toggle("is-invalid", !ok);
    return ok;
  }

  // Re-validate as the user types after a first error
  Object.keys(fields).forEach((key) => {
    fields[key].addEventListener("input", () => {
      const field = fields[key].closest(".field");
      if (field.classList.contains("is-invalid")) validateField(key);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const allValid = Object.keys(fields)
      .map((key) => validateField(key))
      .every(Boolean);

    if (!allValid) {
      form.querySelector(".field.is-invalid input, .field.is-invalid textarea")?.focus();
      return;
    }

    /* EDIT: your email address here */
    const TO_EMAIL = "hello@example.com";

    const body =
      `Name: ${fields.name.value.trim()}\n` +
      `Email: ${fields.email.value.trim()}\n\n` +
      fields.message.value.trim();

    const mailto =
      `mailto:${TO_EMAIL}` +
      `?subject=${encodeURIComponent(fields.subject.value.trim())}` +
      `&body=${encodeURIComponent(body)}`;

    if (note) {
      note.textContent = "Thanks! Your message has been prepared.";
      note.classList.add("is-visible");
    }
    form.reset();

    // Opens the visitor's own email app with everything pre-filled
    window.location.href = mailto;
  });
}

/* ============================================================
   07. BACK TO TOP (footer button)
   ============================================================ */
document.querySelectorAll(".to-top").forEach((btn) => {
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
