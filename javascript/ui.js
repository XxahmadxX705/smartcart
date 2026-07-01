import {addToCart , getcart, gettotal, incrementQuantity, decrementQuantity, removeFromCart} from './cart.js';
import { budgetCounter } from './budget.js';


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
            showtoast(`${product.title} has been added to the cart!`);
        });

        productlist.appendChild(card);
    });
}

export function showtoast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    document.body.appendChild(toast);

    
    setTimeout(() => toast.classList.add('show'), 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export function renderCart() {
    const cartitem = document.getElementById('cart-items');
    cartitem.innerHTML = ``;

    getcart().forEach(product => {
        const item = document.createElement('div');
        item.className = 'cart-row';
        item.innerHTML = `
         ${product.title} - $${product.price}

         <span>
            <button class="minus">-</button>
            <span style="font-size: 16px;">${product.quantity}</span>
            <button class="plus">+</button>
            <button class="remove">Remove</button>
         </span>
         `;
        
         item.querySelector('.plus').addEventListener('click', () =>{
            incrementQuantity(product.id);
            renderCart();
        });

        item.querySelector('.minus').addEventListener('click', () =>{
            decrementQuantity(product.id);
            renderCart();
        });

        item.querySelector('.remove').addEventListener('click', () =>{
            removeFromCart(product.id);
            renderCart();
        });

        cartitem.appendChild(item);
    });

    document.getElementById('cart-total').innerText = `Total: $${gettotal().toFixed(2)}`;
    renderBudget();
}
export function renderBudget() {
    const budget = budgetCounter.getBudget();
    const spend = gettotal();
    const remaining = budget - spend;

    document.getElementById('budget-amount').innerText = budget.toFixed(2);
    document.getElementById('spend-amount').innerText = spend.toFixed(2);
    
    const remainingElement = document.getElementById('remaining-amount');
    remainingElement.innerText = remaining.toFixed(2);
    remainingElement.style.color = remaining < 0 ? 'red' : ''; 

}

export function setupBudget() {
    const button = document.getElementById('save-budget');
    button.addEventListener('click', () => {
        const amount = parseFloat((document.getElementById('budget-input').value) || 0);
        budgetCounter.setBudget(amount);
        renderBudget();
    });
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