function redirectToCartWithToken() {
  const cartLink = document.querySelector('a[href="cart.html"]');
  if (cartLink) {
    cartLink.addEventListener("click", (event) => {
      event.preventDefault();
      const token = localStorage.getItem("token");

      if (token) {
        // Redirige a cart.html incluyendo el token como parámetro de consulta
        window.location.href = `http://localhost:3000/cart.html?token=${token}`;
      } else {
        console.log('No se encontró un token en el localStorage');
        Swal.fire({
          title: '¡Error!',
          text: 'Acceso denegado.',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        });
      }
    });
  }
}


