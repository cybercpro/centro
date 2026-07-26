const canvas = document.getElementById('rain-canvas');
const ctx = canvas.getContext('2d');
let width, height;
const drops = [];
const chars = '0123456789ABCDEFアイウエオカキクケコ0123456789';

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class Drop {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    this.speed = Math.random() * 2 + 1.5;
    this.char = chars[Math.floor(Math.random() * chars.length)];
    this.opacity = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.y += this.speed;
    if (this.y > height) { this.y = -20; this.x = Math.random() * width; this.char = chars[Math.floor(Math.random() * chars.length)]; }
  }
  draw() {
    ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
    ctx.font = '12px monospace';
    ctx.fillText(this.char, this.x, this.y);
    ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity * 0.2})`;
    for (let i = 1; i < 4; i++) { ctx.fillText(this.char, this.x, this.y - i * 14); }
  }
}

function initRain() {
  resize();
  const count = width < 768 ? 30 : 80;
  for (let i = 0; i < count; i++) drops.push(new Drop());
}

function animateRain() {
  ctx.clearRect(0, 0, width, height);
  drops.forEach(d => { d.update(); d.draw(); });
  requestAnimationFrame(animateRain);
}

initRain();
animateRain();

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resize();
    const isMobile = width < 768;
    const target = isMobile ? 30 : 80;
    while (drops.length > target) drops.pop();
    while (drops.length < target) drops.push(new Drop());
  }, 200);
});

/* Navigation */
function showSection(sectionId, navEl) {
  document.querySelectorAll('.section-view').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  if (navEl) {
    document.querySelectorAll('.nav-tabs li').forEach(li => li.classList.remove('active'));
    navEl.classList.add('active');
  }
}

/* Service tabs */
function showService(serviceId, tabEl) {
  document.querySelectorAll('.service-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(serviceId + '-panel').classList.add('active');
  document.querySelectorAll('.service-tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
}

/* Auth */
function openAuthModal() { document.getElementById('authModal').classList.add('open'); }
function closeAuthModal() { document.getElementById('authModal').classList.remove('open'); }

function signInAsGuest() {
  const user = { id: 'guest_' + Date.now(), name: 'Invitado', email: 'invitado@csdsaas.com', picture: 'https://ui-avatars.com/api/?name=Invitado&background=00f0ff&color=0a0a0f', givenName: 'Invitado' };
  localStorage.setItem('csd_user', JSON.stringify(user));
  updateAuthUI();
  closeAuthModal();
  showNotification('Bienvenido, Invitado!');
}

function signOut() {
  localStorage.removeItem('csd_user');
  updateAuthUI();
  toggleUserMenu();
  showNotification('Has cerrado sesion');
}

function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem('csd_user'));
  const loginBtn = document.getElementById('loginBtn');
  const userProfile = document.getElementById('userProfile');
  if (user) {
    loginBtn.style.display = 'none';
    userProfile.style.display = 'flex';
    document.getElementById('userDisplayName').textContent = user.givenName;
  } else {
    loginBtn.style.display = 'block';
    userProfile.style.display = 'none';
  }
}

function toggleUserMenu() {
  const menu = document.getElementById('userMenu');
  menu.classList.toggle('show');
}

document.addEventListener('click', function(e) {
  const profile = document.getElementById('userProfile');
  const menu = document.getElementById('userMenu');
  if (profile && menu && !profile.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('show');
  }
});

/* Notification */
function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 500);
  }, 3000);
}

/* Check session */
function checkExistingSession() {
  if (localStorage.getItem('csd_user')) updateAuthUI();
}

checkExistingSession();