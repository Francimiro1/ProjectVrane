// ===== NAVIGATION SCROLL EFFECT =====
var nav = document.getElementById('main-nav');
window.addEventListener('scroll', function() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== INTERSECTION OBSERVER FOR REVEAL ANIMATIONS =====
var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(function(el) {
  observer.observe(el);
});

// ===== BEFORE/AFTER SLIDER =====
var comparison = document.getElementById('comparison');
var afterEl = document.getElementById('comparison-after');
var divider = document.getElementById('divider');
var isDragging = false;
var currentPercent = 50;

function setSliderPosition(percent) {
  percent = Math.max(5, Math.min(95, percent));
  currentPercent = percent;
  afterEl.style.clipPath = 'inset(0 ' + (100 - percent) + '% 0 0)';
  divider.style.left = percent + '%';
}

setSliderPosition(50);

comparison.addEventListener('mousedown', function(e) {
  isDragging = true;
  e.preventDefault();
});

comparison.addEventListener('touchstart', function(e) {
  isDragging = true;
}, { passive: true });

window.addEventListener('mousemove', function(e) {
  if (!isDragging) return;
  var rect = comparison.getBoundingClientRect();
  setSliderPosition(((e.clientX - rect.left) / rect.width) * 100);
});

window.addEventListener('touchmove', function(e) {
  if (!isDragging) return;
  var rect = comparison.getBoundingClientRect();
  setSliderPosition(((e.touches[0].clientX - rect.left) / rect.width) * 100);
}, { passive: true });

window.addEventListener('mouseup', function() { isDragging = false; });
window.addEventListener('touchend', function() { isDragging = false; });

// Auto-animate slider
var sliderAnimated = false;
var sliderObserver = new IntersectionObserver(function(entries) {
  if (entries[0].isIntersecting && !sliderAnimated) {
    sliderAnimated = true;
    setTimeout(function() {
      var pos = 50;
      var animateLeft = setInterval(function() {
        pos -= 1.5;
        setSliderPosition(pos);
        if (pos <= 15) {
          clearInterval(animateLeft);
          setTimeout(function() {
            var animateRight = setInterval(function() {
              pos += 1.5;
              setSliderPosition(pos);
              if (pos >= 50) clearInterval(animateRight);
            }, 20);
          }, 600);
        }
      }, 20);
    }, 800);
  }
}, { threshold: 0.5 });

if (comparison) sliderObserver.observe(comparison);

// ===== TAB SWITCHING =====
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(function(tab) {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  document.getElementById('tab-' + tabName).classList.add('active');
}

// ===== PARALLAX =====
var heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', function() {
  var scrollY = window.scrollY;
  if (scrollY < window.innerHeight && heroBg) {
    heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
  }
}, { passive: true });

// ===== AUDIO PLAYBACK =====
document.querySelectorAll('.play-button').forEach(function(btn) {
  btn.addEventListener('click', function() {
    // Pause all audios first
    document.querySelectorAll('audio').forEach(function(audio) {
      audio.pause();
      audio.currentTime = 0;
    });
    var card = btn.closest('.noise-card');
    if (card.querySelector('.noise-badge.original')) {
      document.getElementById('original-audio').play();
    } else if (card.querySelector('.noise-badge.processed')) {
      document.getElementById('processed-audio').play();
    }
  });
});