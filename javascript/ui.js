import { addToCart, getcart, gettotal, incrementQuantity, decrementQuantity, removeFromCart, clearCart } from './cart.js';
import { isLoggedIn, login, logout, getCurrentUser } from './auth.js';
import { budgetCounter } from './budget.js';
import { addOrder, getOrders, getOrdersTotal ,removeOrder , clearOrders } from './orders.js';

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
         <img src="${product.thumbnail}" class="cart-thumb">
         <span class="cart-name">${product.title} - $${product.price}</span>

         <span class="cart-controls">
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

    renderDashbord();
    renderAnalytics();
}

export function renderBudget() {
    const budget = budgetCounter.getBudget();
    const spend = getOrdersTotal();
    const remaining = budget - spend - gettotal();

    if (remaining < 0) {
    alert('You are over budget!');
    }

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

export function setupClearCart() {
    document.getElementById('clear-cart').addEventListener('click', () => {
        const cart = getcart();

        if(cart.length === 0 ){
            showtoast('Cart is empty. Nothing to clear.');
            return;
        }

        if(confirm('Are you sure you want to clear the cart?')){
            clearCart();
            renderCart();
            showtoast('Cart cleared successfully!');
        }
    });
}

export function setupClearOrders() {
    document.getElementById('clear-orders').addEventListener('click', () => {
        if(getOrders().length === 0){
            showtoast('No orders to clear.');
            return;
        }

        if(confirm('Are you sure you want to clear the orders?')){
            clearOrders();
            renderOrders();
            renderBudget();
            renderDashbord();
            renderAnalytics();
            showtoast('Orders cleared successfully!');
        }
    });
}


export function setupLogin(startApp) {
    const loginPage = document.getElementById('login-page');
    const app = document.getElementById('app');

    function showApp() {
        loginPage.hidden = true;
        app.hidden = false;
        startApp().catch(() => {
            showtoast('Failed to load products. Please refresh the page.');
        });
    }

    function showLogin() {
        loginPage.hidden = false;
        app.hidden = true;
    }

    if (isLoggedIn()) {
        showApp();
    } 
    
    else {
        showLogin();
    }

    document.getElementById('login-btn').addEventListener('click', () => {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!username || !password) {
            showtoast('Please enter a username and password.');
            return;
        }

        if (login(username, password)) {
            showtoast(`Welcome, ${username}!`);
            showApp();
        } 
        
        else {
            showtoast('Invalid username or password.');
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        logout();
        showLogin();
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        showtoast('Logged out.');
    });
}

const CHECKOUT_TAX_RATE = 0.10;
const CHECKOUT_SHIPPING = 5.99;

function fillCheckoutForm(cart) {
    const itemsDiv = document.getElementById('checkout-items');
    itemsDiv.innerHTML = cart.map(item =>
        `<div>${item.title} × ${item.quantity} — $${(item.price * item.quantity).toFixed(2)}</div>`
    ).join('');

    const subtotal = gettotal();
    const tax = subtotal * CHECKOUT_TAX_RATE;
    const total = subtotal + tax + CHECKOUT_SHIPPING;

    document.getElementById('checkout-subtotal').innerText = '$' + subtotal.toFixed(2);
    document.getElementById('checkout-tax').innerText = '$' + tax.toFixed(2);
    document.getElementById('checkout-shipping').innerText = '$' + CHECKOUT_SHIPPING.toFixed(2);
    document.getElementById('checkout-total').innerText = '$' + total.toFixed(2);
}

function showCheckoutStep(activeStep) {
    const formStep = document.getElementById('checkout-form-step');
    const processingStep = document.getElementById('checkout-processing');
    const successStep = document.getElementById('checkout-success');
    const declinedStep = document.getElementById('checkout-declined');

    formStep.hidden = activeStep !== formStep;
    processingStep.hidden = activeStep !== processingStep;
    successStep.hidden = activeStep !== successStep;
    declinedStep.hidden = activeStep !== declinedStep;
}

export function setupCheckout() {
    const modal = document.getElementById('checkout-modal');
    const formStep = document.getElementById('checkout-form-step');
    const processingStep = document.getElementById('checkout-processing');
    const successStep = document.getElementById('checkout-success');
    const declinedStep = document.getElementById('checkout-declined');

    document.getElementById('checkout-btn').addEventListener('click', () => {
        const cart = getcart();

        if (cart.length === 0) {
            showtoast('Cart is empty. Nothing to checkout.');
            return;
        }

        fillCheckoutForm(cart);
        showCheckoutStep(formStep);
        modal.hidden = false;
    });

    document.getElementById('close-checkout').addEventListener('click', () => {
        modal.hidden = true;
    });

    document.getElementById('place-order-btn').addEventListener('click', () => {
        const name = document.getElementById('ship-name').value.trim();
        const email = document.getElementById('ship-email').value.trim();
        const address = document.getElementById('ship-address').value.trim();
        const city = document.getElementById('ship-city').value.trim();
        const zip = document.getElementById('ship-zip').value.trim();

        if (!name || !email || !address || !city || !zip) {
            showtoast('Please fill in all fields.');
            return;
        }

        if (!email.includes('@')) {
            showtoast('Please enter a valid email address.');
            return;
        }

        showCheckoutStep(processingStep);

        setTimeout(() => {
            const subtotal = gettotal();
            const tax = subtotal * CHECKOUT_TAX_RATE;
            const total = subtotal + tax + CHECKOUT_SHIPPING;
            const budget = budgetCounter.getBudget();
            const remaining = budget - getOrdersTotal();

            if (budget > 0 && total > remaining) {
                showCheckoutStep(declinedStep);
                document.getElementById('declined-name').innerText = name;
                document.getElementById('declined-total').innerText = '$' + total.toFixed(2);
                document.getElementById('declined-budget').innerText = '$' + remaining.toFixed(2);
                return;
            }

            const orderNum = 'SC-' + Date.now().toString().slice(-8);

            const cartSnapshot = getcart().map(item => ({
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                thumbnail: item.thumbnail,
                category: item.category,
            }));
            const order = {
                id: orderNum,
                date: new Date().toLocaleString(),
                name: name,
                items: cartSnapshot,
                total: total
            };

            addOrder(order);

            document.getElementById('success-name').innerText = name;
            document.getElementById('order-number').innerText = orderNum;
            document.getElementById('success-total').innerText = '$' + total.toFixed(2);

            showCheckoutStep(successStep);
            clearCart();
            renderCart();
            renderOrders();
        }, 2000);
    });

    document.getElementById('close-success-btn').addEventListener('click', () => {
        modal.hidden = true;
        showCheckoutStep(formStep);
    });

    document.getElementById('close-declined-btn').addEventListener('click', () => {
        modal.hidden = true;
        showCheckoutStep(formStep);
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

export function renderDashbord(){
    const cart = getcart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const spent = getOrdersTotal();
    const remaining = budgetCounter.getBudget() - spent - gettotal();
    const orderCount = getOrders().length;
    
    document.getElementById('summary-items').innerHTML = totalItems;
    document.getElementById('summary-orders').innerHTML = orderCount;
    document.getElementById('summary-spent').innerHTML = spent.toFixed(2);
    document.getElementById('summary-remaining').innerHTML = remaining.toFixed(2);
    document.getElementById('summary-remaining').style.color = remaining < 0 ? 'red' : ''; 
    
}

export function renderOrders(){
    const list = document.getElementById('orders-list');
    const orders = getOrders();

    if(orders.length === 0){
        list.innerHTML = `<p>no orders has been made yet</p>`;
        return;
    }

    list.innerHTML = '';

    orders.forEach(order => {
        const div = document.createElement('div');
        div.className = 'order-card';
        
        const itemsHtml = order.items.map(item => `<div> ${item.title} * ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</div>`).join('');

        div.innerHTML = ` 
            <h3>order #${order.id}</h3>
            <p>${new Date(order.date).toLocaleString()} - ${order.name}</p>
            <div class="order-items">${itemsHtml}</div>
            <div class="order-card-footer">
                <strong>Total: $${order.total.toFixed(2)}</strong>
                <button class="remove-order">Delete</button>
            </div>
        `;
        div.querySelector('.remove-order').addEventListener('click', () => {
            removeOrder(order.id);
            renderOrders();
            renderBudget();
            renderDashbord();
            renderAnalytics();
            showtoast('Order deleted.');
        });

        list.appendChild(div);
    });
}

export function renderAnalytics() {
    const canvas = document.getElementById('spending-chart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const orders = getOrders();

    const spending = {};

    orders.forEach(order => {
        order.items.forEach(item => {
            spending[item.category] = (spending[item.category] || 0) + (item.price * item.quantity);
        });
    });

    const categories = Object.keys(spending);
    const values = Object.values(spending); 

    if (categories.length === 0){
        ctx.fillStyle = '#637271';
        ctx.font = '16px Segoe UI';
        ctx.fillText('no data yet - place an order first', 20, 40);
        return;
    }

    const maxValue = Math.max(...values);
    const barWidth = 60;
    const gap = 40;
    const basey = 260;
    const maxbarHeight = 200;

    categories.forEach((category, index) => {
        const x = 40 + index * (barWidth + gap);
        const barHeight = (values[index] / maxValue) * maxbarHeight;
        const y = basey - barHeight;

        ctx.fillStyle = '#4f46e5';
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = '#2d3436';
        ctx.font = '12px Segoe UI';
        ctx.fillText('$' + values[index].toFixed(2), x, y - 6);
        ctx.fillText(category, x, basey + 16);

    })

}