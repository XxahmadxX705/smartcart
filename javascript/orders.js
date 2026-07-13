import { saveOrder , loadOrders } from "./storage.js";

let orders = loadOrders();

export function getOrders(){
    return orders;
}

export function addOrder(order){
    orders.push(order);
    saveOrder(orders);
}

export function getOrdersTotal(){
    return orders.reduce((total, order) => total + order.total, 0);
}
export function removeOrder(id){
    orders = orders.filter(order => order.id !== id);
    saveOrder(orders);
}
export function clearOrders(){
    orders = [];
    saveOrder(orders);
}