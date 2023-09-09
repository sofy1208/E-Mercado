const catID = localStorage.getItem("catID"); // Se obtiene el ID de categoría de productos almacenado en el almacenamiento local bajo la clave (key) "catID".
const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`; // Se construye la URL para obtener los datos de productos de la categoría especificada 

let productsData = []; // Variable para almacenar los datos de los productos
let currentSortCriteria = "sortByCount"; // Criterio de orden actual
let searchQuery = ""; // Consulta de búsqueda actual


// Función asincrónica para obtener y mostrar los productos
async function fetchProducts() {
    const response = await fetch(url); // Se obtiene la respuesta de la URL
    const data = await response.json(); // Los datos JSON se convierten en un objeto

    productsData = data.products; // Se almacenan los datos de productos

    // Se actualiza el título de la sección con el nombre de la categoría
    const titleSection = document.getElementById("title-section");
    titleSection.innerHTML = ` 
    <h2 class="alert-heading">Productos</h2>
    <p>Verás aquí todos los productos de la categoría ${data.catName}</p>  
`;

    // Se filtran y muestran los productos
    filterAndDisplayProducts();

}


// Resto del código para mostrar los productos y la sección de filtros

// Función para filtrar y mostrar productos
function filterAndDisplayProducts() {
    // Se obtienen los valores actuales de los elementos de rango de precio y búsqueda
    const minPrice = parseFloat(document.getElementById("rangeFilterPriceMin").value) || 0;
    const maxPrice = parseFloat(document.getElementById("rangeFilterPriceMax").value) || Infinity;

    // Se filtran los productos en base a rango de precio y búsqueda
    const filteredProducts = productsData.filter(product => {   //filteredProducts almacenará un nuevo array de productos filtrados a partir del array productsData
        const productPrice = parseFloat(product.cost); //Para cada producto en el array productsData, se obtiene el precio del producto y se convierte en un número de utilizando parseFloat().
        return productPrice >= minPrice && productPrice <= maxPrice && // La función de filtro devuelve true o false para cada producto según si cumple o no con las condiciones de filtrado. 
            (product.name.toLowerCase().includes(searchQuery) || // La descripción del producto, convertida a minúsculas, también debe incluir la searchQuery.
                product.description.toLowerCase().includes(searchQuery));
    });


    // Los productos filtrados se ordenan según el criterio de orden actual
    const sortedProducts = sortProducts(filteredProducts, currentSortCriteria);

    
    const productsList = document.getElementById("products-list"); // Se obtiene el contenedor de lista de productos
    productsList.innerHTML = ""; // Se limpia la lista antes de agregar los productos ordenados y filtrados

    // Por cada producto en los productos ordenados, se crea y agrega una tarjeta de producto al contenedor
    sortedProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "card mb-3";
        productCard.innerHTML = ` 
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${product.image}" alt="${product.name}" class="img-thumbnail">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h3 class="card-title">${product.name} - ${product.currency} ${product.cost}</h3>
                        <p class="card-text text-muted">${product.soldCount} vendidos</p>
                    </div>
                    <p class="card-text">${product.description}</p>
                </div>
            </div>
        </div>
    `;
        productsList.appendChild(productCard);
    });
}

// Función para ordenar productos según el criterio proporcionado
function sortProducts(productsArray, criteria) { // esta funcion toma como parámetros un array de productos (productsArray) y un criterio de ordenamiento (criteria)
    return productsArray.slice().sort((a, b) => { // devuelve un nuevo array ordenado, basado en el array de productos original (productsArray).Se crea una copia superficial (slice) del array de productos para evitar modificar el array original. Luego, se utiliza sort() para realizar el ordenamiento. 
        if (criteria === "sortAscPrice") { // Se verifica el criterio de ordenamiento proporcionado. Si es "sortAscPrice", se realizará un orden ascendente por precio.
            return parseFloat(a.cost) - parseFloat(b.cost); //Para orden ascendente por precio, se resta el precio del producto a del precio del producto b. Esto crea una comparación numérica que ordenará los productos por precio ascendente.
        } else if (criteria === "sortDescPrice") { //  Si el criterio es "sortDescPrice", se realizará un orden descendente por precio.
            return parseFloat(b.cost) - parseFloat(a.cost); // Para orden descendente por precio, se resta el precio del producto b del precio del producto a. Esto crea una comparación numérica que ordenará los productos por precio descendente.
        } else if (criteria === "sortDescRelevance") { //Si el criterio es "sortDescRelevance", se realizará un orden descendente por relevancia (cantidad vendida).
            return parseInt(b.soldCount) - parseInt(a.soldCount); //Para orden descendente por relevancia, se resta la cantidad vendida del producto b de la cantidad vendida del producto a. Esto ordenará los productos por cantidad vendida descendente.
        } else {
            return 0; // No hay ordenamiento, mantiene el orden actual
        }
    });
}

// Evento que se activa cuando el DOM se ha cargado completamente
document.addEventListener("DOMContentLoaded", function () {
    fetchProducts(); // Se obtienen y muestran los productos iniciales

    // Agrega listeners para los botones de ordenamiento y filtros
    document.getElementById("sortAscPrice").addEventListener("click", function () { // Cuando el botón "Ordenar Ascendente" es clickeado
        currentSortCriteria = "sortAscPrice";  // Se actualiza el criterio de orden actual
        filterAndDisplayProducts();   // Se llama a la función filterAndDisplayProducts() para aplicar el nuevo orden y mostrar los productos
    });

    document.getElementById("sortDescPrice").addEventListener("click", function () { // Cuando el botón "Ordenar Descendente" es clickeado
        currentSortCriteria = "sortDescPrice"; // Se actualiza el criterio de orden actual
        filterAndDisplayProducts();  // Se llama a la función filterAndDisplayProducts() para aplicar el nuevo orden y mostrar los productos
    });

    document.getElementById("sortDescRelevance").addEventListener("click", function () { // Cuando el botón "Ordenar por Relevancia" es clickeado
        currentSortCriteria = "sortDescRelevance"; // Se actualiza el criterio de orden actual
        filterAndDisplayProducts();  // Se llama a la función filterAndDisplayProducts() para aplicar el nuevo orden y mostrar los productos
    });

    // Escuchador de evento para la entrada de búsqueda
    document.getElementById("searchInput").addEventListener("input", function () {  
        searchQuery = this.value.toLowerCase(); // Se actualiza la consulta de búsqueda actual en minúsculas
        filterAndDisplayProducts();   // Se llama a la función filterAndDisplayProducts() para aplicar la nueva búsqueda y mostrar los productos
    });

    // Escuchadores de evento para los botones de limpieza y rango de precio
    document.getElementById("clearRangeFilter").addEventListener("click", function () { // Cuando el botón "Limpiar" es clickeado
        document.getElementById("rangeFilterPriceMin").value = "";  // Se limpian los valores de los elementos de rango de precio
        document.getElementById("rangeFilterPriceMax").value = "";  // Se limpian los valores de los elementos de rango de precio
        filterAndDisplayProducts();  // Se llama a la función filterAndDisplayProducts() para aplicar los cambios y mostrar los productos
    });

    // Cuando ocurre un evento de click en los elementos relacionados con el rango de precio
    document.getElementById("rangeFilterPrice").addEventListener("click", filterAndDisplayProducts);
    document.getElementById("rangeFilterPriceMin").addEventListener("click", filterAndDisplayProducts);
    document.getElementById("rangeFilterPriceMax").addEventListener("click", filterAndDisplayProducts);

});


const logUser = localStorage.getItem('email'); //Agarra el usuario que se guardo en el local al ingresar
const navUser = document.querySelector('.navbar-nav'); //llama a la lista del navbar
if (logUser && navUser) {
    const li = document.createElement('li'); //crea elemento li
    li.classList.add('nav-link'); //agrega la clase de boostrap al elemento nuevo
    li.textContent = logUser; //agrega el contenido dentro de logUser (el mail)
    navUser.appendChild(li); //agrega al navbar
}