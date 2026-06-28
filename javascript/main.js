import { fetchProducts } from './api.js';
import { renderProducts , setupnavigation } from './ui.js';

setupnavigation();

const products =  await fetchProducts();
renderProducts(products);