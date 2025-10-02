// Animate logo and headings on page load
window.addEventListener('DOMContentLoaded', () => {
  const brandName = document.querySelector('.brand-name');
  if (brandName) {
    brandName.classList.add('tracking-in-expand');
  }

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

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('show');
    navList.style.maxHeight = !expanded ? navList.scrollHeight + 'px' : null;
  });

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

// Product filtering by category
document.querySelectorAll('.btn-filter').forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.getAttribute('data-filter');

    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.product').forEach(card => {
      const category = card.getAttribute('data-category');
      card.style.display = (selected === 'all' || category === selected) ? 'block' : 'none';
    });
  });
});

// Add product to cart and animate button
document.querySelectorAll('.btn-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-product-id');
    const name = btn.parentElement.querySelector('h3').textContent;
    const price = parseFloat(btn.parentElement.querySelector('.price').textContent.replace('€', ''));

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    btn.classList.add('added');
    setTimeout(() => {
      btn.classList.remove('added');
    }, 1600);
  });
});
