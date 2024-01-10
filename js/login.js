const savedEmail = localStorage.getItem('email');
const savedPassword = localStorage.getItem('password');
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginForm = document.getElementById("login-form");

window.addEventListener("load", () => {
  if (savedEmail !== null && savedPassword != null) {
    password.value = savedPassword;
    email.value = savedEmail;
    location.assign("index.html");
  } loginForm.addEventListener("submit", () => {
      localStorage.setItem('email', email.value);
      localStorage.setItem('password', password.value);
    }
  )});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe automáticamente

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // Verifica que los campos de correo electrónico y contraseña no estén vacíos
  if (email.trim() !== '' && password.trim() !== '') {
    const data = {
      email,
      password
    };
    // Realiza una solicitud POST al servidor con los datos de inicio de sesión
    fetch('http://localhost:3000/login.html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Respuesta del servidor:', data);

        // Si hay un token en la respuesta, almacena el token y redirige a index.html
        if (data && data.token) {
          console.log(data.token);
          localStorage.setItem('token', data.token);
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
          location.assign("index.html");
        }
      })
      .catch(error => {
        console.error('Error al enviar la solicitud:', error);
      });
  } else {
    console.log('Por favor, ingresa tu correo y contraseña');
  }
});

   /*!
 Inicio del codigo darkmode/light/auto
 */

(() => {
  'use strict'

  const storedTheme = localStorage.getItem('theme')

  const getPreferredTheme = () => {
    if (storedTheme) {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = function (theme) {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  }

  setTheme(getPreferredTheme())

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')

    if (!themeSwitcher) {
      return
    }

    const themeSwitcherText = document.querySelector('#bd-theme-text')
    const activeThemeIcon = document.querySelector('.theme-icon-active use')
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
    const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')
    activeThemeIcon.setAttribute('href', svgOfActiveBtn)
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
      themeSwitcher.focus()
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (storedTheme !== 'light' || storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme())

    document.querySelectorAll('[data-bs-theme-value]')
      .forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value')
          localStorage.setItem('theme', theme)
          setTheme(theme)
          showActiveTheme(theme, true)
        })
      })
  })
})()

/*!
Fin del codigo darkmode/light/auto
*/




