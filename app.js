// CONFIGURACIÓN DE LA BODA
const WEDDING_DATE = new Date('2026-08-16T16:30:00').getTime();

// 1. CUENTA REGRESIVA EN VIVO
function updateCountdown() {
  const now = new Date().getTime();
  const distance = WEDDING_DATE - now;

  if (distance < 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// 1b. MENÚ HAMBURGUESA (MOBILE)
function toggleMenu() {
  const links = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');
  const btn = document.getElementById('hamburgerBtn');
  const isOpen = links.classList.contains('open');
  links.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  btn.setAttribute('aria-expanded', String(!isOpen));
  // Cerrar al hacer click en un link del menú
  if (!isOpen) {
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        overlay.classList.remove('open');
      }, { once: true });
    });
  }
}

// 2. REPRODUCTOR DE MÚSICA DE FONDO ALEATORIO ("I was Born To Love You.mp3" & "Ganas de ti.mp3")
const playlist = [
  {
    src: encodeURI("I was Born To Love You.mp3"),
    title: "I was Born To Love You"
  },
  {
    src: encodeURI("Ganas de ti.mp3"),
    title: "Ganas de ti"
  }
];

let currentSongIndex = Math.floor(Math.random() * playlist.length);
let hasUserInteracted = false;

function initAudioPlayer() {
  const audio = document.getElementById('weddingAudio');
  if (!audio) return;

  // Seleccionar canción inicial de forma aleatoria
  audio.src = playlist[currentSongIndex].src;

  // Al terminar una canción, pasar automáticamente a la otra
  audio.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    audio.src = playlist[currentSongIndex].src;
    audio.play().then(() => {
      updateMusicUI(true);
      showToast(`🎵 Reproduciendo: ${playlist[currentSongIndex].title}`);
    }).catch(() => {});
  });

  // Intentar reproducir automáticamente
  audio.play().then(() => {
    updateMusicUI(true);
  }).catch(() => {
    // Si el navegador requiere interacción previa, reproducir en el primer toque, clic o scroll
    const startAudioOnInteraction = () => {
      if (!hasUserInteracted && audio.paused) {
        hasUserInteracted = true;
        audio.play().then(() => {
          updateMusicUI(true);
        }).catch(() => {});
      }
      document.removeEventListener('click', startAudioOnInteraction);
      document.removeEventListener('touchstart', startAudioOnInteraction);
      document.removeEventListener('scroll', startAudioOnInteraction);
    };

    document.addEventListener('click', startAudioOnInteraction, { once: true });
    document.addEventListener('touchstart', startAudioOnInteraction, { once: true });
    document.addEventListener('scroll', startAudioOnInteraction, { once: true });
  });
}

function toggleMusic() {
  const audio = document.getElementById('weddingAudio');
  if (!audio) return;

  hasUserInteracted = true;
  if (audio.paused) {
    audio.play();
    updateMusicUI(true);
    showToast(`🎵 Reproduciendo: ${playlist[currentSongIndex].title}`);
  } else {
    audio.pause();
    updateMusicUI(false);
    showToast('🔇 Música pausada');
  }
}

function updateMusicUI(isPlaying) {
  const btn = document.getElementById('musicToggle');
  if (!btn) return;
  const icon = btn.querySelector('.music-icon');
  const label = btn.querySelector('.music-label');
  if (isPlaying) {
    btn.classList.add('playing');
    if (icon) icon.textContent = '⏸';
    if (label) label.textContent = 'Pausar canción';
  } else {
    btn.classList.remove('playing');
    if (icon) icon.textContent = '♪';
    if (label) label.textContent = 'DALE PLAY para escuchar nuestra canción';
  }
}

window.addEventListener('DOMContentLoaded', initAudioPlayer);

// 3. COPIADO RÁPIDO DE DATOS BANCARIOS (Mesa de Regalos)
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`✨ ${label} copiado al portapapeles`);
  }).catch(() => {
    showToast(`📋 ${text}`);
  });
}

// 4. CONFIRMACIÓN DE ASISTENCIA VÍA WHATSAPP
function confirmDirectWhatsApp() {
  const phone = '595984881701';
  const message = '¡Hola Gabi y Maxi! Quiero confirmar mi asistencia a su boda. \n👤 Mi nombre es: \n🎟️ Cantidad de personas: ';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  showToast(`✨ Abriendo WhatsApp...`);
  window.open(url, '_blank');
}

// 5. SISTEMA DE NOTIFICACIONES TOAST
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}

// 6. SISTEMA DE GALERÍA DE FOTOS (LIGHTBOX)
function openLightbox(item) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg) {
    const imgSrc = item.querySelector('img').src;
    lightboxImg.src = imgSrc;
    lightbox.classList.add('open');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('open');
  }
}
