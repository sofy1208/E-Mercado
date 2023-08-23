document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});

//Logeo y guardar sesión

const isLoggedIn = localStorage.getItem("password") !== null && localStorage.getItem("email") !== null;
window.addEventListener("load", () =>{
if (!isLoggedIn){
    window.location.href = "login.html";
  }});

   //Visualización del mail en el navbar

   const logUser = localStorage.getItem('email'); //Agarra el usuario que se guardo en el local al ingresar
   const navUser = document.querySelector('.navbar-nav'); //llama a la lista del navbar
   if (logUser && navUser) {
     const li = document.createElement('li'); //crea elemento li
     li.classList.add('nav-link'); //agrega la clase de boostrap al elemento nuevo
     li.textContent = logUser; //agrega el contenido dentro de logUser (el mail)
     navUser.appendChild(li); //agrega al navbar
   }
