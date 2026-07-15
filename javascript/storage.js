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

export function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

export function loadUser(){
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
}

export function clearUser(){
    localStorage.removeItem('user');
}
export function saveOrder(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

export function loadOrders(){
    const data = localStorage.getItem('orders');
    return data ? JSON.parse(data) : [];
}
export function saveTransactions(transactions) {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

export function loadTransactions() {
    const data = localStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
}