document.addEventListener('DOMContentLoaded', function() {
    // Load existing cart items
    loadCartItems();

    // Handle URL parameters to add items
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const price = params.get('price');
    const img = params.get('img');

    if (name && price && img) {
        addItemToCart(name, price, img, 1);
        // Redirect to remove query parameters
        window.history.replaceState(null, '', window.location.pathname);
    }
});

function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.forEach(item => addItemToCart(item.name, item.price, item.img, item.quantity));
    updateCartTotal();
}

function saveCartItems(cartItems) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function addItemToCart(name, price, img, quantity) {
    const cartItems = document.getElementById('cart-items');
    let existingItem = cartItems.querySelector(`.cart-item[data-name="${name}"]`);

    if (existingItem) {
        // Update quantity if item already exists
        const quantityInput = existingItem.querySelector('.quantity');
        quantityInput.value = parseInt(quantityInput.value) + quantity;
        updateTotal(existingItem);
    } else {
        // Add new item if it does not exist
        const itemHTML = createCartItemHTML(name, price, img, quantity);
        cartItems.insertAdjacentHTML('beforeend', itemHTML);
    }

    attachRemoveHandlers();
    updateLocalStorage();
    updateCartTotal();
}

function createCartItemHTML(name, price, img, quantity) {
    price = parseFloat(price).toFixed(2); // Ensure price is a number with two decimal places
    return `
        <div class="cart-item" data-name="${name}">
            <img src="${img}" alt="${name}" class="cart-item-img">
            <div class="cart-item-info">
                <h3>${name}</h3>
                <p>Price: Rs. ${price}</p>
                <p>Quantity: <input type="number" class="quantity" value="${quantity}" min="1"></p>
                <p>Total: Rs. ${price * quantity}</p>
                <button class="remove-btn">Remove</button>
            </div>
        </div>
    `;
}


function attachRemoveHandlers() {
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.cart-item').remove();
            updateLocalStorage();
            updateCartTotal();
        });
    });

    const quantityInputs = document.querySelectorAll('.quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateTotal(this.closest('.cart-item'));
            updateLocalStorage();
            updateCartTotal();
        });
    });
}

function updateTotal(item) {
    const quantityInput = item.querySelector('.quantity');
    const quantity = parseInt(quantityInput.value);
    
    // Correctly extract the price from the text content
    const priceText = item.querySelector('p').textContent;
    const price = parseFloat(priceText.split('Rs. ')[1]);

    if (isNaN(price)) {
        console.error('Price extraction failed', priceText);
        return;
    }

    item.querySelector('p:nth-of-type(3)').textContent = `Total: Rs. ${price * quantity}`;
}


function updateLocalStorage() {
    const cartItems = [];
    document.querySelectorAll('.cart-item').forEach(item => {
        const name = item.getAttribute('data-name');
        
        // Correctly extract and parse price from the text content
        const priceText = item.querySelector('p').textContent;
        const price = parseFloat(priceText.split('Rs. ')[1]);
        
        if (isNaN(price)) {
            console.error('Price extraction failed', priceText);
            return;
        }
        
        const img = item.querySelector('img').src;
        const quantity = parseInt(item.querySelector('.quantity').value);
        
        cartItems.push({ name, price, img, quantity });
    });
    saveCartItems(cartItems);
}


function updateCartTotal() {
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity').value);
        
        // Correctly extract and parse price from the text content
        const priceText = item.querySelector('p').textContent;
        const price = parseFloat(priceText.split('Rs. ')[1]);
        
        if (isNaN(price)) {
            console.error('Price extraction failed', priceText);
            return;
        }
        
        total += price * quantity;
    });
    document.getElementById('checkout-btn').textContent = `Proceed to Checkout - Rs. ${total.toFixed(2)}`;
}

