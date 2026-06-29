export function savecart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart)); //array to text
}

export function loadcart(){
    const data = localStorage.getItem('cart'); //text to array
    return data ? JSON.parse(data) : [];
}

export function savebudget(budget) {
    localStorage.setItem('budget', JSON.stringify(budget)); 
}

export function loadbudget(){
    const data = localStorage.getItem('budget'); 
    return data ? JSON.parse(data): 0 ;
}