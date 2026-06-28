let cart = [];

export function addToCart(product) {
    cart.push(product);
}

export function getcart() {
    return cart;
}

export function gettotal() {
    return cart.reduce((sum, product) => sum + product.price, 0);
}
