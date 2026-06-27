export function savecart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart)); //array to text
}

export function loadcart(){
    const data = localStorage.getItem('cart'); //text to array
    return data ? JSON.parse(data) : [];
}