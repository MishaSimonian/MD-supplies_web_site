// Mobilné menu toggle
// Анимация логотипа при загрузке
window.addEventListener('DOMContentLoaded', () => {
  // Старая анимация логотипа (целиком)
  const brandName = document.querySelector('.brand-name');
  if (brandName) {
    brandName.classList.add('tracking-in-expand');
  }

  // По-буквенная анимация заголовков секций при появлении в поле зрения
  const h2s = document.querySelectorAll('.section h2');
  h2s.forEach(h2 => {
    const text = h2.textContent;
    h2.textContent = '';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.classList.add('slide-in-letter');
      span.style.animationDelay = (i * 0.06) + 's';
      span.style.animationPlayState = 'paused';
      h2.appendChild(span);
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.slide-in-letter').forEach(span => {
            span.style.animationPlayState = 'running';
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    h2s.forEach(h2 => observer.observe(h2));
  } else {
    h2s.forEach(h2 => h2.querySelectorAll('.slide-in-letter').forEach(span => {
      span.style.animationPlayState = 'running';
    }));
  }
});
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
    if (!expanded) {
      navList.style.maxHeight = navList.scrollHeight + 'px';
    } else {
      navList.style.maxHeight = null;
    }
  });
  // Закрытие меню при клике вне навигации
  document.addEventListener('click', (e) => {
    if (
      navList.classList.contains('show') &&
      !navList.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      navList.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
      navList.style.maxHeight = null;
    }
  });
}

// Klik na "Do košíka"
document.querySelectorAll('.btn-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-product-id');
    // TODO: pridať do košíka (localStorage / backend API)
    btn.classList.add('added');
    btn.textContent = 'Pridané';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.textContent = 'Do košíka';
    }, 1500);
  });
});
