document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('auth-form');
  const title = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  const toggleLink = document.getElementById('toggle-link');
  const toggleText = document.getElementById('toggle-text');
  const nameField = document.getElementById('name-field');
  let isLogin = true;

  const setupToggle = () => {
    document.getElementById('toggle-link')?.removeEventListener('click', setupToggle);
    document.getElementById('toggle-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      isLogin = !isLogin;

      if (isLogin) {
        title.textContent = 'Login';
        submitBtn.textContent = 'Login';
        toggleText.innerHTML = `Don't have an account? <a href="#" id="toggle-link">Register</a>`;
        nameField.style.display = 'none';
      } else {
        title.textContent = 'Register';
        submitBtn.textContent = 'Register';
        toggleText.innerHTML = `Already have an account? <a href="#" id="toggle-link">Login</a>`;
        nameField.style.display = 'block';
      }
      setupToggle();
    });
  };
  setupToggle();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const name = isLogin ? null : document.getElementById('name').value.trim();

    if (!email || !password || (!isLogin && !name)) {
      alert('Please fill all fields');
      return;
    }

    const endpoint = isLogin ? '/.netlify/functions/login' : '/.netlify/functions/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        window.location.href = data.redirect;
      } else {
        alert(data.msg || 'Error occurred');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Try again.');
    }
  });
});
