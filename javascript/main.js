import { fetchProducts } from './api.js';
import { renderProducts , setupnavigation,  renderCart} from './ui.js';

setupnavigation();

const products =  await fetchProducts();
renderProducts(products);
renderCart();