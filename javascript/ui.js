import {addToCart , getcart, gettotal} from './cart.js';


export function renderProducts(products) {
    const productlist = document.getElementById('product-list');

    products.forEach(product =>{
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.thumbnail}" width="200">
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
            <p>${product.category}</p>
            <button>Add to Cart</button>
        `;

        const button = card.querySelector('button');
        button.addEventListener('click', () => {
            addToCart(product);
            renderCart();
            alert(`${product.title} has been added to the cart!`);
        });

        productlist.appendChild(card);
    });
}

export function renderCart() {
    const cartitem = document.getElementById('cart-items');
    cartitem.innerHTML = ``;

    getcart().forEach(product => {
        const item = document.createElement('div');
        item.innerHTML = ` ${product.title} - $${product.price}`;
        cartitem.appendChild(item);
    });

    document.getElementById('cart-total').innerText = `Total: $${gettotal().toFixed(2)}`;
}


export function setupnavigation() {
    const menuitem  = document.querySelectorAll('.menu-item');
    const views = document.querySelectorAll('.view');

    menuitem.forEach(item => {
        item.addEventListener('click', () => {
            menuitem.forEach(view => {
                view.classList.remove('active');
            })
            
            item.classList.add('active');

            views.forEach(view => {
                if(view.dataset.view === item.id){
                    view.style.display = 'block';
                } else {
                    view.style.display = 'none';
                }
            });

        });
    });
}