
const url = "https://japceibal.github.io/emercado-api/cats_products/101.json";

async function fetchProducts(){

    const response = await fetch(url);
    const data = await response.json();

        const productsList = document.getElementById("products-list");
        data.products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "card mb-3";
            productCard.innerHTML = 
            `<div class="row g-0">
                <div class="col-md-4">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h3 class="card-title">${product.name} - ${product.currency} ${product.cost}</h3>
                            <p class="card-text">${product.soldCount} vendidos</p>
                        </div>
                        <p class="card-text">${product.description}</p>
                    </div>
                </div>
            </div>`
                    ;
            productsList.appendChild(productCard);
        });
    };

    fetchProducts();
