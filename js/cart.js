
let cart = [];

// Render cart and update UI
function renderCart() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];

  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const clearCartBtn = document.getElementById('clear-cart-btn');

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Košík je prázdny.</p>';
    cartTotal.textContent = '';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    if (clearCartBtn) clearCartBtn.style.display = 'none';
    return;
  }

  let total = 0;
  cartItems.innerHTML = '<ul class="cart-list">' + cart.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `<li>
      <strong>${item.name}</strong> – ${item.quantity} ks × €${item.price.toFixed(2)} = <strong>€${itemTotal.toFixed(2)}</strong>
      <button class="btn-remove" data-index="${index}">Odstrániť</button>
    </li>`;
  }).join('') + '</ul>';

  cartTotal.textContent = `Celková suma: €${total.toFixed(2)}`;
  if (checkoutBtn) checkoutBtn.style.display = 'inline-block';
  if (clearCartBtn) clearCartBtn.style.display = 'inline-block';

  // Remove individual item from cart with fade-out animation
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'));
      btn.parentElement.classList.add('fade-out');
      setTimeout(() => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      }, 400);
    });
  });
}

// Clear all items from cart
document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      const cartList = document.querySelector('.cart-list');
      if (cartList) {
        cartList.classList.add('fade-out-all');
        setTimeout(() => {
          localStorage.removeItem('cart');
          renderCart();
        }, 500);
      } else {
        localStorage.removeItem('cart');
        renderCart();
      }
    });
  }
});


// Animate logo and headings on page load
window.addEventListener('DOMContentLoaded', () => {
  // Logo animation
  const brandName = document.querySelector('.brand-name');
  if (brandName) {
    brandName.classList.add('tracking-in-expand');
  }

  // Animate section headings letter by letter when in viewport
  const h2s = document.querySelectorAll('.animate-heading');
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

  // Trigger heading animation when in viewport
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