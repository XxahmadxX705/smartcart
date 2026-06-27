import {savecart, loadcart} from './storage.js';

let cart = loadcart();

export function addToCart(product) {
    const exsisting = cart.find(item => item.id === product.id);

    if (exsisting) {
        exsisting.quantity = exsisting.quantity +1;
        savecart(cart);
    }
    else {
        cart.push({...product, quantity: 1});
        savecart(cart);
    }
    savecart(cart);
}


export function getcart() {
    return cart;
}


export function gettotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function incrementQuantity(id) {
    const item = cart.find(item => item.id === id);

    if (item){
        item.quantity = item.quantity + 1;
        savecart(cart);
    }
}

export function decrementQuantity(id) {
    const item = cart.find(item => item.id === id);

    if (item) {
        item.quantity = item.quantity - 1;
        savecart(cart);
        if (item.quantity === 0) {
            removeFromCart(id);
        }
    }
}

export function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    savecart(cart);
}
