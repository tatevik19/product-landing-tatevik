// ===============================
// Active section highlight (Navbar)
// ===============================
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sectionIds = navLinks.map(link => link.getAttribute("href")).filter(Boolean);
const sections = sectionIds
  .map(id => document.querySelector(id))
  .filter(Boolean);

function setActiveLink(id) {
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === id);
  });
}

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) {
        setActiveLink(`#${visible.target.id}`);
      }
    },
    { threshold: [0.25, 0.5, 0.75] }
  );

  sections.forEach(section => observer.observe(section));
}

// ===============================
// Modal (CTA)
// ===============================
const backdrop = document.getElementById("modalBackdrop");
const openBtn = document.getElementById("openModalBtn");
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
  nameError.textContent = "";
  emailError.textContent = "";
}

openBtn?.addEventListener("click", openModal);
closeBtn?.addEventListener("click", closeModal);

backdrop?.addEventListener("click", e => {
  if (e.target === backdrop) closeModal();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && backdrop?.classList.contains("open")) {
    closeModal();
  }
});

// Form validation
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form?.addEventListener("submit", e => {
  e.preventDefault();

  let valid = true;
  const nameVal = nameInput.value.trim();
  const emailVal = emailInput.value.trim();

  if (!nameVal) {
    valid = false;
    nameError.textContent = "Name is required.";
  } else {
    nameError.textContent = "";
  }

  if (!emailVal) {
    valid = false;
    emailError.textContent = "Email is required.";
  } else if (!isValidEmail(emailVal)) {
    valid = false;
    emailError.textContent = "Enter a valid email.";
  } else {
    emailError.textContent = "";
  }

  if (valid) {
    alert(`Thanks, ${nameVal}! We'll contact you at ${emailVal}.`);
    form.reset();
    closeModal();
  }
});

// ===============================
// Gallery filters + Lightbox
// ===============================
const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let visibleItems = [...galleryItems];
let currentIndex = 0;

function setVisibleItems(filter) {
  galleryItems.forEach(item => {
    const show = filter === "all" || item.dataset.category === filter;
    item.style.display = show ? "" : "none";
  });
  visibleItems = galleryItems.filter(item => item.style.display !== "none");
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    setVisibleItems(btn.dataset.filter);
  });
});

function openLightbox(index) {
  if (!visibleItems.length) return;
  currentIndex = (index + visibleItems.length) % visibleItems.length;
  lightboxImg.src = visibleItems[currentIndex].dataset.src;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

galleryItems.forEach(item => {
  item.addEventListener("click", () => {
    openLightbox(visibleItems.indexOf(item));
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => openLightbox(currentIndex - 1));
lightboxNext?.addEventListener("click", () => openLightbox(currentIndex + 1));

lightbox?.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", e => {
  if (!lightbox?.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") openLightbox(currentIndex - 1);
  if (e.key === "ArrowRight") openLightbox(currentIndex + 1);
});

// Init
setVisibleItems("all");
