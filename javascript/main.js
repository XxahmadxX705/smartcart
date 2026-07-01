import { fetchProducts } from './api.js';
import { setupProducts , setupnavigation , renderCart , setupBudget , renderBudget , setupCopyCart , renderDashbord , renderAnalytics} from './ui.js';

setupnavigation();
setupBudget();
setupCopyCart();

const products =  await fetchProducts();
setupProducts(products);
renderCart();
renderBudget();
renderDashbord();
renderAnalytics();
