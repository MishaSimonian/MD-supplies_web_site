// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// Product grid layout switcher
const productsGrid = document.querySelector('.products');
const layoutBtns = document.querySelectorAll('.layout-btn');

layoutBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active from all
    layoutBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const layout = btn.getAttribute('data-layout');
    productsGrid.classList.remove('one-column', 'two-columns');
    if (layout === 'one') {
      productsGrid.classList.add('one-column');
    } else {
      productsGrid.classList.add('two-columns');
    }

    // Save choice in localStorage
    localStorage.setItem('productLayout', layout);
  });
});

// Restore layout choice on page load
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('productLayout');
  // Remove active from all layout buttons first
  layoutBtns.forEach(b => b.classList.remove('active'));
  if (saved) {
    productsGrid.classList.add(saved === 'one' ? 'one-column' : 'two-columns');
    document.querySelector(`.layout-btn[data-layout="${saved}"]`)?.classList.add('active');
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

// Add product to cart and transform Add button into quantity controls
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

    // If there's already a qty controls area, update it; otherwise transform the Add button into controls
    const productCard = btn.closest('.product');
    const existingControls = productCard.querySelector('.card-qty-controls');
    if (existingControls) {
      const span = existingControls.querySelector('.qty-value');
      span.textContent = String(cart.find(i => i.id === id).quantity);
    } else {
      btn.style.display = 'none';
      const controls = createCardQtyControls(id, productCard);
      btn.parentElement.appendChild(controls);
    }

    // small added animation on the original button for visual feedback
    btn.classList.add('added');
    setTimeout(() => {
      btn.classList.remove('added');
    }, 800);
  });
});

// Create quantity controls for product card (catalog)
function createCardQtyControls(id, productCard){
  const wrapper = document.createElement('div');
  wrapper.className = 'card-qty-controls';

  const decrease = document.createElement('button'); decrease.className = 'qty-btn'; decrease.type = 'button'; decrease.textContent = '−';
  const value = document.createElement('span'); value.className = 'qty-value'; value.textContent = '1';
  const increase = document.createElement('button'); increase.className = 'qty-btn'; increase.type = 'button'; increase.textContent = '+';

  wrapper.appendChild(decrease);
  wrapper.appendChild(value);
  wrapper.appendChild(increase);

  // read current cart value if present
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = cart.find(i => i.id === id);
  if (item) value.textContent = String(item.quantity);

  decrease.addEventListener('click', ()=>{
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const it = cart.find(i => i.id === id);
    if(!it) return;
    it.quantity = (it.quantity||0) - 1;
    if(it.quantity <= 0){
      // remove and restore Add button
      const addBtn = productCard.querySelector('.btn-cart');
      const controls = productCard.querySelector('.card-qty-controls');
      cart.splice(cart.indexOf(it),1);
      localStorage.setItem('cart', JSON.stringify(cart));
      if(controls) controls.remove();
      if(addBtn) addBtn.style.display = '';
      return;
    }
    value.textContent = String(it.quantity);
    localStorage.setItem('cart', JSON.stringify(cart));
  });

  increase.addEventListener('click', ()=>{
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const it = cart.find(i => i.id === id);
    if(!it) return;
    it.quantity = (it.quantity||0) + 1;
    value.textContent = String(it.quantity);
    localStorage.setItem('cart', JSON.stringify(cart));
  });

  return wrapper;
}

// Initialize product card controls on load if cart already has items
window.addEventListener('DOMContentLoaded', ()=>{
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  document.querySelectorAll('.product').forEach(card => {
    const pid = card.querySelector('.btn-cart')?.getAttribute('data-product-id');
    if(!pid) return;
    const item = cart.find(i => i.id === pid);
    if(item){
      const btn = card.querySelector('.btn-cart');
      if(btn) btn.style.display = 'none';
      const controls = createCardQtyControls(pid, card);
      controls.querySelector('.qty-value').textContent = String(item.quantity);
      card.querySelector('.btn-cart')?.parentElement.appendChild(controls);
    }
  });
});
