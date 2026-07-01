import { fetchProducts } from './api.js';
import { renderProducts , setupnavigation , renderCart , setupBudget , renderBudget } from './ui.js';

setupnavigation();
setupBudget();

const products =  await fetchProducts();
renderProducts(products);
renderCart();
renderBudget();