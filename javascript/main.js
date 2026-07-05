import { fetchProducts } from './api.js';
import { setupProducts, setupnavigation, renderCart, setupBudget, 
         setupCopyCart, setupClearCart, setupLogin,
         setupCheckout, renderDashbord, renderAnalytics } from './ui.js';

let appStarted = false;

async function startApp() {
    if (appStarted) return;
    appStarted = true;

    const products = await fetchProducts();
    setupProducts(products);
    renderCart();
    renderDashbord();
    renderAnalytics();
}

setupnavigation();
setupBudget();
setupCopyCart();
setupClearCart();
setupCheckout();
setupLogin(startApp);
