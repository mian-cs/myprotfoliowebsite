/* ==========================================================================
   MIAN MOAZZAM PORTFOLIO - CORE JAVASCRIPT
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. THREE.JS 3D INTERACTIVE BACKGROUND WITH THEME SUPPORT
   -------------------------------------------------------------------------- */
(function initThreeScene() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 28;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Main Group
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // Outer Wireframe Icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(8.5, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const icosahedron = new THREE.Mesh(icoGeo, icoMat);
  coreGroup.add(icosahedron);

  // Inner Counter-Rotating Octahedron
  const octGeo = new THREE.OctahedronGeometry(5.2, 0);
  const octMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.42
  });
  const octahedron = new THREE.Mesh(octGeo, octMat);
  coreGroup.add(octahedron);

  // Glowing Vertex Nodes on Outer Mesh
  const pointsMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.25,
    transparent: true,
    opacity: 0.85
  });
  const vertexNodes = new THREE.Points(icoGeo, pointsMat);
  coreGroup.add(vertexNodes);

  // Ambient Cyber Particles
  const particleCount = 450;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 75;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xa855f7,
    size: 0.16,
    transparent: true,
    opacity: 0.65
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Function to adapt 3D elements to Light vs Dark theme
  window.updateThreeTheme = function (theme) {
    if (theme === 'light') {
      icoMat.color.setHex(0x7c3aed);
      icoMat.opacity = 0.22;

      octMat.color.setHex(0x0284c7);
      octMat.opacity = 0.35;

      pointsMat.color.setHex(0x0284c7);
      pointsMat.opacity = 0.75;

      particleMat.color.setHex(0x7c3aed);
      particleMat.opacity = 0.35;
    } else {
      icoMat.color.setHex(0xa855f7);
      icoMat.opacity = 0.28;

      octMat.color.setHex(0x38bdf8);
      octMat.opacity = 0.42;

      pointsMat.color.setHex(0x38bdf8);
      pointsMat.opacity = 0.85;

      particleMat.color.setHex(0xa855f7);
      particleMat.opacity = 0.65;
    }
  };

  // Initial theme calibration
  const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  window.updateThreeTheme(initialTheme);

  // Position 3D core slightly right on desktop
  function updateCorePosition() {
    if (window.innerWidth > 992) {
      coreGroup.position.set(8.5, 0, -2);
    } else {
      coreGroup.position.set(0, 2, -6);
    }
  }
  updateCorePosition();

  // Mouse Parallax
  let targetX = 0;
  let targetY = 0;
  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 1.4;
    targetY = (e.clientY / window.innerHeight - 0.5) * 1.4;
  });

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    updateCorePosition();
  });

  // Animation Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    icosahedron.rotation.x = elapsed * 0.14;
    icosahedron.rotation.y = elapsed * 0.2;
    vertexNodes.rotation.copy(icosahedron.rotation);

    octahedron.rotation.x = -elapsed * 0.25;
    octahedron.rotation.y = -elapsed * 0.18;

    particles.rotation.y = elapsed * 0.03;

    coreGroup.rotation.y += (targetX - coreGroup.rotation.y) * 0.05;
    coreGroup.rotation.x += (targetY - coreGroup.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }
  animate();
})();

/* --------------------------------------------------------------------------
   2. LIGHT / DARK THEME SWITCHER
   -------------------------------------------------------------------------- */
const themeToggleBtn = document.getElementById('theme-toggle');

function applyTheme(newTheme) {
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('mm_portfolio_theme', newTheme);

  // Update theme toggle button accessibility
  if (themeToggleBtn) {
    const label = newTheme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme';
    themeToggleBtn.setAttribute('title', label);
    themeToggleBtn.setAttribute('aria-label', label);
  }

  // Notify Three.js to adjust particle and wireframe hues
  if (typeof window.updateThreeTheme === 'function') {
    window.updateThreeTheme(newTheme);
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(targetTheme);
  });
}

// System theme listener (if user has not set a preference)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('mm_portfolio_theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

/* --------------------------------------------------------------------------
   3. DYNAMIC TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
(function initTypewriter() {
  const typewriterEl = document.getElementById('typewriter');
  if (!typewriterEl) return;

  const roles = [
    'AI Tools & Prompt Engineering',
    'Critical Thinking in the AI Era',
    'Structured Diagnostic Troubleshooting',
    'BS Computer Science @ VU'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
})();

/* --------------------------------------------------------------------------
   4. SCROLL PROGRESS BAR, NAVBAR STATE & ACTIVE NAV SPY
   -------------------------------------------------------------------------- */
const scrollProgressBar = document.getElementById('scroll-progress');
const navbar = document.getElementById('navbar');
const backToTopBtn = document.getElementById('back-to-top');
const navLinksItems = document.querySelectorAll('.nav-links .nav-link');
const sections = document.querySelectorAll('section[id]');

function handleScrollState() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  // 1. Scroll Progress Bar
  if (scrollProgressBar && docHeight > 0) {
    const progressPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    scrollProgressBar.style.width = `${progressPercent}%`;
  }

  // 2. Navbar Scrolled Shadow & Blur
  if (navbar) {
    if (scrollTop > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // 3. Floating Back to Top Button
  if (backToTopBtn) {
    if (scrollTop > 380) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  // 4. Active Section Nav Spy
  let currentSection = '';
  const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;

  if (isAtBottom) {
    currentSection = 'contact';
  } else {
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
  }

  navLinksItems.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', handleScrollState);
// Initial run on load
handleScrollState();

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   5. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Close when clicking nav links
  navLinksItems.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove('open');
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
}

/* --------------------------------------------------------------------------
   6. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* --------------------------------------------------------------------------
   7. 3D PERSPECTIVE TILT ON CARDS
   -------------------------------------------------------------------------- */
document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -6;
    const rotateY = ((x - rect.width / 2) / rect.width) * 6;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* --------------------------------------------------------------------------
   8. CERTIFICATE LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
const certModal = document.getElementById('cert-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalIssuer = document.getElementById('modal-issuer');
const modalDate = document.getElementById('modal-date');
const modalDesc = document.getElementById('modal-desc');
const modalVerifyBtn = document.getElementById('modal-verify-btn');

function openCertModal(data) {
  if (!certModal) return;
  modalImg.src = data.img || '';
  modalImg.alt = data.title || 'Certificate Preview';
  modalTitle.textContent = data.title || '';
  modalIssuer.textContent = data.issuer || '';
  modalDate.textContent = data.date || '';
  modalDesc.textContent = data.desc || '';
  modalVerifyBtn.href = data.verify || '#';

  certModal.classList.add('active');
  certModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  if (!certModal) return;
  certModal.classList.remove('active');
  certModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.btn-open-modal').forEach((trigger) => {
  const triggerModal = (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    openCertModal({
      img: trigger.dataset.img,
      title: trigger.dataset.title,
      issuer: trigger.dataset.issuer,
      date: trigger.dataset.date,
      desc: trigger.dataset.desc,
      verify: trigger.dataset.verify
    });
  };
  trigger.addEventListener('click', triggerModal);
  if (trigger.tagName !== 'BUTTON') {
    trigger.addEventListener('keydown', triggerModal);
  }
});

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeCertModal);
}

if (certModal) {
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) {
      closeCertModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
      closeCertModal();
    }
  });
}

/* --------------------------------------------------------------------------
   9. COPY GITHUB HANDLE TO CLIPBOARD
   -------------------------------------------------------------------------- */
const copyBtn = document.getElementById('copy-handle-btn');
const copyText = document.getElementById('copy-text');

if (copyBtn && copyText) {
  copyBtn.addEventListener('click', async () => {
    const icon = copyBtn.querySelector('i');
    try {
      await navigator.clipboard.writeText('https://github.com/mian-cs');
      if (icon) {
        icon.className = 'fa-solid fa-check';
        icon.style.color = '#22c55e';
      }
      copyText.textContent = 'Copied: github.com/mian-cs';
      copyBtn.style.borderColor = '#22c55e';

      setTimeout(() => {
        if (icon) {
          icon.className = 'fa-solid fa-copy';
          icon.style.color = '';
        }
        copyText.textContent = 'Copy GitHub: github.com/mian-cs';
        copyBtn.style.borderColor = '';
      }, 2500);
    } catch (err) {
      copyText.textContent = 'github.com/mian-cs';
    }
  });
}

/* --------------------------------------------------------------------------
   10. CONTACT FORM SUBMISSION (WEB3FORMS)
   -------------------------------------------------------------------------- */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';
    formStatus.textContent = '';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        formStatus.style.color = '#10b981';
        formStatus.textContent = 'Message sent successfully! Mian Moazzam will get back to you soon.';
        contactForm.reset();
      } else {
        formStatus.style.color = '#ef4444';
        formStatus.textContent = result.message || 'Error sending message. Please try again later.';
      }
    } catch (error) {
      formStatus.style.color = '#ef4444';
      formStatus.textContent = 'Network error. Please check your connection and try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }
  });
}
