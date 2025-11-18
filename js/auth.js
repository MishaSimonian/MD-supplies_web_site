// Simple client-side auth (for demo only)
(function(){
  function uid() {
    // simple UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getUsers() { return JSON.parse(localStorage.getItem('users')||'[]'); }
  function saveUsers(u){ localStorage.setItem('users', JSON.stringify(u)); }
  function getSessionUserId(){ return localStorage.getItem('sessionUserId'); }
  function setSessionUserId(id){ if(id) localStorage.setItem('sessionUserId', id); else localStorage.removeItem('sessionUserId'); }

  function register(data){
    const users = getUsers();
    if(users.find(u=>u.email===data.email)) return { ok:false, error:'Email už existuje' };
    const user = { id: uid(), name: data.name, email: data.email, password: data.password, createdAt: new Date().toISOString() };
    users.push(user); saveUsers(users);
    setSessionUserId(user.id);
    return { ok:true, user };
  }

  function login(data){
    const users = getUsers();
    const u = users.find(x => x.email===data.email && x.password===data.password);
    if(!u) return { ok:false, error:'Neplatné prihlasovacie údaje' };
    setSessionUserId(u.id);
    return { ok:true, user:u };
  }

  function logout(){ setSessionUserId(null); updateHeaderAuthUI(); }

  function getCurrentUser(){
    const id = getSessionUserId(); if(!id) return null;
    return getUsers().find(u=>u.id===id) || null;
  }

  function updateHeaderAuthUI(){
    const container = document.getElementById('auth-links');
    if(!container) return;
    container.innerHTML = '';
    const user = getCurrentUser();
    if(user){
      // create anchors so styles match other nav links
      const account = document.createElement('a');
      account.href = 'account.html';
      account.textContent = 'Môj účet';
      account.className = 'nav-link';

      const logoutLink = document.createElement('a');
      logoutLink.href = '#';
      logoutLink.textContent = 'Odhlásiť sa';
      logoutLink.className = 'nav-link logout-link';
      logoutLink.addEventListener('click', (e) => { e.preventDefault(); logout(); window.location.reload(); });

      container.appendChild(account);
      container.appendChild(logoutLink);
    } else {
      const authLink = document.createElement('a');
      authLink.href = 'auth.html';
      authLink.textContent = 'Prihlásiť sa / Registrovať';
      authLink.className = 'nav-link';
      container.appendChild(authLink);
    }
  }

  // Bind auth form handlers if present
  document.addEventListener('DOMContentLoaded', ()=>{
    updateHeaderAuthUI();

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginPanel = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');

    if(tabLogin && tabRegister){
      tabLogin.addEventListener('click', ()=>{ tabLogin.classList.add('active'); tabRegister.classList.remove('active'); loginPanel.style.display='block'; registerPanel.style.display='none'; });
      tabRegister.addEventListener('click', ()=>{ tabRegister.classList.add('active'); tabLogin.classList.remove('active'); registerPanel.style.display='block'; loginPanel.style.display='none'; });
    }

    if(loginForm){
      loginForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const form = new FormData(loginForm);
        const res = login({ email: form.get('email').trim(), password: form.get('password') });
        const err = document.getElementById('login-error');
        if(!res.ok){ if(err) err.textContent = res.error; return; }
        updateHeaderAuthUI();
        window.location.href = 'account.html';
      });
    }

    if(registerForm){
      registerForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const form = new FormData(registerForm);
        const name = form.get('name').trim();
        const email = form.get('email').trim();
        const password = form.get('password');
        const err = document.getElementById('register-error');
        if(password.length < 6){ if(err) err.textContent = 'Heslo musí mať aspoň 6 znakov'; return; }
        const res = register({ name, email, password });
        if(!res.ok){ if(err) err.textContent = res.error; return; }
        updateHeaderAuthUI();
        window.location.href = 'account.html';
      });
    }
  });

  // Expose helpers globally
  window.__auth = { register, login, logout, getCurrentUser, updateHeaderAuthUI, getSessionUserId };
})();

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