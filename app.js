// ----- Active section highlight -----
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sectionIds = navLinks.map(a => a.getAttribute("href")).filter(Boolean);

const sections = sectionIds
  .map(id => document.querySelector(id))
  .filter(Boolean);

function setActiveLink(id) {
  navLinks.forEach(link => {
    const isActive = link.getAttribute("href") === id;
    link.classList.toggle("active", isActive);
  });
}

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveLink(`#${visible.target.id}`);
    },
    { root: null, threshold: [0.25, 0.5, 0.75] }
  );

  sections.forEach(section => observer.observe(section));
}

// ----- Modal logic -----
const backdrop = document.getElementById("modalBackdrop");
const openBtn = document.getElementById("openModalBtn");
const openBtnHero = document.getElementById("openModalBtnHero");
const closeBtn = document.getElementById("closeModalBtn");

const form = document.getElementById("ctaForm");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");

function openModal() {
  if (!backdrop) return;
  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  nameInput?.focus();
}

function closeModal() {
  if (!backdrop) return;
  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (nameError) nameError.textContent = "";
  if (emailError) emailError.textContent = "";
}

openBtn?.addEventListener("click", openModal);
openBtnHero?.addEventListener("click", openModal);
closeBtn?.addEventListener("click", closeModal);

backdrop?.addEventListener("click", (e) => {
  if (e.target === backdrop) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && backdrop?.classList.contains("open")) {
    closeModal();
  }
});

// ----- Form validation -----
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  let ok = true;

  const nameVal = (nameInput?.value || "").trim();
  const emailVal = (emailInput?.value || "").trim();

  if (!nameVal) {
    ok = false;
    if (nameError) nameError.textContent = "Name is required.";
  } else {
    if (nameError) nameError.textContent = "";
  }

  if (!emailVal) {
    ok = false;
    if (emailError) emailError.textContent = "Email is required.";
  } else if (!isValidEmail(emailVal)) {
    ok = false;
    if (emailError) emailError.textContent = "Please enter a valid email.";
  } else {
    if (emailError) emailError.textContent = "";
  }

  if (ok) {
    alert(`Thanks, ${nameVal}! We'll reach out to ${emailVal}.`);
    form.reset();
    closeModal();
  }
});
