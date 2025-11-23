document.addEventListener('DOMContentLoaded', () => {
  // Ensure auth UI is up to date
  if (window.__auth) window.__auth.updateHeaderAuthUI();

  const user = window.__auth ? window.__auth.getCurrentUser() : null;
  if (!user) {
    window.location.href = 'auth.html';
    return;
  }

  const profileCard = document.getElementById('profile-card');
  const ordersList = document.getElementById('orders-list');

  if (profileCard) {
    profileCard.innerHTML = `\
      <h3>Profil</h3>\
      <p><strong>Meno:</strong> ${user.name}</p>\
      <p><strong>Email:</strong> ${user.email}</p>\
      <p><strong>Registrovaný:</strong> ${new Date(user.createdAt).toLocaleString()}</p>`;
  }

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const myOrders = orders.filter(o => o.userId === user.id);

  if (ordersList) {
    if (myOrders.length === 0) {
      ordersList.innerHTML += '<p>Ešte žiadne objednávky.</p>';
    } else {
      const ul = document.createElement('ul');
      ul.className = 'account-orders';

      myOrders.forEach(o => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `order.html?id=${encodeURIComponent(o.id)}`;
        a.className = 'order-link';

        const date = document.createElement('span');
        date.className = 'order-date';
        date.textContent = new Date(o.createdAt).toLocaleString();

        const total = document.createElement('span');
        total.className = 'order-total';
        total.textContent = `€${o.total.toFixed(2)}`;

        const count = document.createElement('span');
        count.className = 'order-count';
        const itemCount = o.items.length;

        // Slovak forms: 1 položka, 2–4 položky, 5+ položiek
        let label;
        if (itemCount === 1) {
          label = 'položka';
        } else if (itemCount >= 2 && itemCount <= 4) {
          label = 'položky';
        } else {
          label = 'položiek';
        }

        count.textContent = `${itemCount} ${label}`;

        a.appendChild(date);
        a.appendChild(total);
        a.appendChild(count);
        li.appendChild(a);
        ul.appendChild(li);
      });

      ordersList.appendChild(ul);
    }
  }
});

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
      if (char === ' ') span.classList.add('space');
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
