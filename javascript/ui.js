import {addToCart , getcart, gettotal, incrementQuantity, decrementQuantity, removeFromCart} from './cart.js';
import { budgetCounter } from './budget.js';

let allProducts = [];

export function renderProducts(products) {
    const productlist = document.getElementById('product-list');
    productlist.innerHTML = ``;

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

export function setupProducts(products) {
    allProducts = products;
    renderProducts(products);
    populateCategories(products);
 
    document.getElementById('search-input').addEventListener('input', applyFilters);
    document.getElementById('category-filter').addEventListener('change', applyFilters);
}

function populateCategories(products) {
    const select = document.getElementById('category-filter');
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = category;
        select.appendChild(option);
    });
}

function applyFilters() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;

    const filtered = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(search);
        const matchesCategory = category === 'all' || product.category === category;

        return matchesSearch && matchesCategory;
    });
    renderProducts(filtered);
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
        const input = document.getElementById('budget-input');
        try{
            const amount = parseFloat(input.value);
            if (isNaN(amount) || amount < 0){
                throw new Error('Please enter a valid budget amount.');
            }

        budgetCounter.setBudget(amount);
        renderBudget();
        showtoast('budget saved');
        }

        catch (error) {
            showtoast(error.message);
        }
    });
}


export function setupCopyCart() {
    document.getElementById('copy-cart').addEventListener('click', async() => {
        const cart = getcart();

        if (cart.length === 0) {
            showtoast('Cart is empty. Nothing to copy.');
            return;
        }

        const text = cart.map(item => `${item.title} * ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n');

        try {
            await navigator.clipboard.writeText(text);
            showtoast('Cart list copied to clipboard!');
        }
        catch (error){
            showtoast('Failed to copy cart list. Please try again.');
        }

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