export function renderProducts(products) {
    const productlist = document.getElementById('product-list');

    products.forEach(product =>{
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.thumbnail}" width="200">
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
            <p>${product.category}</p>
        `;
        productlist.appendChild(card);
    });
}

export function setupnavigation() {
    const menuitem  = document.querySelectorAll('.menu-item');
    const views = document.querySelectorAll('.view');

    menuitem.forEach(item => {
        item.addEventListener('click', () => {
            menuitem.forEach(view => {
                view.classList.remove('active');
            })
            
            item.classList.add('active');

            views.forEach(view => {
                if(view.dataset.view === item.id){
                    view.style.display = 'block';
                } else {
                    view.style.display = 'none';
                }
            });

        });
    });
}