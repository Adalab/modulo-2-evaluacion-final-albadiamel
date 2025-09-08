"use strict";

console.log(">> Hola mundo!");

const productsList = document.querySelector('.products-list');
const cartList = document.querySelector('.cart-list');

let cart = []; // Creo la variable de tipo array para almacenar los productos del carrito


const cartButton = (button, isInCart) => {
  if (isInCart) {
    button.textContent = "Eliminar";
    button.classList.add('delete-button');
    button.classList.remove('buy-button');
  } else {
    button.textContent = "Comprar";
    button.classList.add('buy-button');
    button.classList.remove('delete-button');
  }
};


// AQUÍ EL RENDERIZADO DE LOS PRODUCTOS
const renderProducts = (products) => {
  productsList.innerHTML = "";
    products.forEach ((product) => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = 
              `<img src="${product.image}" alt="${product.title}">
              <p class="product-name">${product.title}</p>
              <p class="product-price">${product.price} €</p>
              <button class="buy-button">Comprar</button>`;
    // AQUÍ AGREGO LA LÓGICA PARA EL BOTÓN DE COMPRAR
    const buyButton = productCard.querySelector('.buy-button');
    buyButton.addEventListener('click', () => {
      const isInCart = cart.find(item => item.id === product.id);
      if (isInCart) {
        cart = cart.filter(item => item.id !== product.id);
        cartButton(buyButton, false);
      } else {
        cart.push(product);
        cartButton(buyButton, true);
      }
      renderCart();
    })
    cartButton(buyButton, cart.find(item => item.id === product.id) ? true : false);
    productsList.appendChild(productCard);
  });
};

let products = []; // Creo un array vacío para los productos

fetch ('https://fakestoreapi.com/products')
  .then((response) => response.json())
  .then((data) => {
    products = data;
    renderProducts(products);
    renderCart();
});


// AQUÍ EL RENDERIZADO DE LOS PRODUCTOS EN EL CARRITO
const renderCart = () => {
  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartList.innerHTML = `<p class="no-products-alert">No hay productos en el carrito</p>`;
    return;
  }
  cart.forEach(product => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = 
      `<button class="cart-button">x</button>
      <img src="${product.image}" alt="${product.title}">
      <p class="product-name">${product.title}</p>
      <p class="product-price">${product.price} €</p>`;
    // AQUÍ AGREGO LA LÓGICA PARA EL BOTÓN DE BORRAR
    const deleteButton = cartItem.querySelector('.cart-button');
    deleteButton.addEventListener('click', () => {
      cart = cart.filter(item => item.id !== product.id);
      renderCart();
      renderProducts(products);
    });
    cartList.appendChild(cartItem);
  });
  // AQUÍ EMPIEZA LA LÓGICA PARA EL BOTÓN DE "VACIAR CARRO"
  const emptyCartButton = document.createElement('button');
  emptyCartButton.textContent = "Vaciar carrito";
  emptyCartButton.classList.add('empty-cart-button');
  emptyCartButton.addEventListener('click', () => {
    cart = [];
    renderCart();
    renderProducts(products);
  });
  cartList.appendChild(emptyCartButton);
};

renderCart();

// AQUÍ EMPIEZA LA LÓGICA PARA EL INPUT Y EL BOTÓN DE BÚSQUEDA
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

const handleClickSearch = (event) => {
  event.preventDefault(); // Para evitar que se recargue la página al pulsar el botón
  const searchInputValue = searchInput.value.toLowerCase();
  const productsFiltered = products.filter((product) => product.title.toLowerCase().includes(searchInputValue));
  renderProducts(productsFiltered);
};

searchButton.addEventListener("click", handleClickSearch);
    