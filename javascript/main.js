import { fetchProducts } from './api.js';
import { setupProducts, setupnavigation, renderCart, setupBudget, 
         setupCopyCart, setupClearCart, setupLogin,
         setupCheckout, renderDashbord, renderAnalytics , renderOrders , setupClearOrders } from './ui.js';

let appStarted = false;

async function startApp() {
    if (appStarted) return;
    appStarted = true;

    const products = await fetchProducts();
    setupProducts(products);
    renderCart();
    renderDashbord();
    renderAnalytics();
    renderOrders();
}

setupnavigation();
setupBudget();
setupCopyCart();
setupClearCart();
setupClearOrders();
setupCheckout();
setupLogin(startApp);
