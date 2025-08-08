// --- iPhone Lock Screen Overlay Script ---
// Set current time and date
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('lock-time').textContent = `${hours}:${minutes}`;
  document.getElementById('status-time').textContent = `${hours}:${minutes}`;
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  document.getElementById('lock-date').textContent = now.toLocaleDateString(undefined, options);
}
updateTime();
setInterval(updateTime, 10000);

// Slide to unlock logic
const slider = document.getElementById('slider');
const slideContainer = document.getElementById('slide-container');
const slideText = document.getElementById('slide-text');
const landingOverlay = document.getElementById('landingOverlay');
const mainContent = document.getElementById('mainContent');
let isDragging = false;
let startX = 0;
let currentX = 0;
let maxTranslate = slideContainer.offsetWidth - slider.offsetWidth - 4;

function setSliderPosition(x) {
  slider.style.transform = `translateX(${x}px)`;
  
  // Fade out text as slider moves
  const slideText = document.getElementById('slide-text');
  const fadeProgress = x / maxTranslate;
  slideText.style.opacity = Math.max(0, 0.8 - fadeProgress);
  
  // Stop animation when sliding
  if (x > 0) {
    slideText.style.animationPlayState = 'paused';
  } else {
    slideText.style.animationPlayState = 'running';
  }
}

function unlock() {
  slideContainer.style.transition = 'opacity 0.5s';
  slideContainer.style.opacity = 0;
  setTimeout(() => {
    landingOverlay.classList.add('hidden');
    mainContent.style.opacity = 1;
  }, 400);
}

function onDragStart(e) {
  isDragging = true;
  startX = (e.touches ? e.touches[0].clientX : e.clientX) - currentX;
  slider.style.transition = 'none';
  slideText.style.transition = 'none';
}
function onDragMove(e) {
  if (!isDragging) return;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let dx = clientX - startX;
  dx = Math.max(0, Math.min(dx, maxTranslate));
  currentX = dx;
  setSliderPosition(dx);
}
function onDragEnd() {
  if (!isDragging) return;
  isDragging = false;
  if (currentX > maxTranslate * 0.85) {
    setSliderPosition(maxTranslate);
    unlock();
  } else {
    slider.style.transition = 'transform 0.3s';
    slideText.style.transition = 'opacity 0.3s';
    setSliderPosition(0);
    currentX = 0;
  }
}
slider.addEventListener('mousedown', onDragStart);
slider.addEventListener('touchstart', onDragStart);
window.addEventListener('mousemove', onDragMove);
window.addEventListener('touchmove', onDragMove);
window.addEventListener('mouseup', onDragEnd);
window.addEventListener('touchend', onDragEnd);
window.addEventListener('resize', () => {
  maxTranslate = slideContainer.offsetWidth - slider.offsetWidth - 4;
  setSliderPosition(0);
  currentX = 0;
});
// Hide main content until unlocked
mainContent.style.opacity = 0;

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 100; // Adjust for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Contact navigation functionality
const contactNav = document.querySelector('.nav-links a[href="#contact"]');
const phoneOverlay = document.querySelector('.phone-contact-overlay');
const closePhone = document.querySelector('.close-phone');

contactNav.addEventListener('click', (e) => {
  e.preventDefault();
  phoneOverlay.classList.add('active');
});

closePhone.addEventListener('click', () => {
  phoneOverlay.classList.remove('active');
});

phoneOverlay.addEventListener('click', (e) => {
  if (e.target === phoneOverlay) {
    phoneOverlay.classList.remove('active');
  }
});

// Lock screen button functionality
const lockScreenBtn = document.querySelector('.lock-screen-btn');

lockScreenBtn.addEventListener('click', () => {
  mainContent.style.opacity = 0;
  landingOverlay.classList.remove('hidden');
  lockScreenBtn.classList.remove('show');
  
  // Reset slider position
  setSliderPosition(0);
  currentX = 0;
  slideContainer.style.opacity = 1;
});

// Show lock screen button when unlocked
function unlock() {
  slideContainer.style.transition = 'opacity 0.5s';
  slideContainer.style.opacity = 0;
  setTimeout(() => {
    landingOverlay.classList.add('hidden');
    mainContent.style.opacity = 1;
    lockScreenBtn.classList.add('show');
  }, 400);
}

// Wallpaper switcher functionality
const lockscreen = document.getElementById('lockscreen');
const wallpaperDots = document.querySelectorAll('.wallpaper-dot');

wallpaperDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const wallpaperClass = dot.getAttribute('data-wallpaper');
    lockscreen.classList.remove('wallpaper-1', 'wallpaper-2', 'wallpaper-3', 'wallpaper-4');
    lockscreen.classList.add(`wallpaper-${wallpaperClass}`);
    wallpaperDots.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
  });
});

// Animated Stats
const statNumbers = document.querySelectorAll('.stat-number');

function animateStat(element, target) {
  let current = 0;
  const duration = 2000; // 2 seconds
  const startTime = performance.now();

  function update() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    current = Math.floor(progress * target);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  update();
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumber = entry.target;
      const target = parseInt(statNumber.getAttribute('data-target'));
      animateStat(statNumber, target);
      statsObserver.unobserve(statNumber);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(number => {
  statsObserver.observe(number);
});

// Enhanced card hover effects
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-8px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
  });
}); 