
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile Menu Toggle
            const hamburger = document.getElementById('hamburger');
            const navLinks = document.querySelector('.nav-links');
            const overlay = document.getElementById('overlay');

            hamburger.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('active');
                overlay.classList.toggle('active');
            });

            // Close mobile menu when clicking on overlay
            overlay.addEventListener('click', function() {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                overlay.classList.remove('active');
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
            });

            // Cart Toggle
            const cartToggle = document.getElementById('cart-toggle');
            const cartSidebar = document.getElementById('cart-sidebar');
            const closeCart = document.getElementById('close-cart');

            cartToggle.addEventListener('click', function(e) {
                e.preventDefault();
                cartSidebar.classList.toggle('active');
                overlay.classList.toggle('active');
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });

            closeCart.addEventListener('click', function() {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
            });

            // Cart Functionality
            let cart = [];
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            const cartItemsContainer = document.getElementById('cart-items');
            const cartTotalElement = document.getElementById('cart-total');
            const cartCountElement = document.querySelector('.cart-count');

            // Add to cart
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const name = this.getAttribute('data-name');
                    const price = parseFloat(this.getAttribute('data-price'));
                    const img = this.getAttribute('data-img');

                    // Check if item already exists in cart
                    const existingItem = cart.find(item => item.id === id);

                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({
                            id,
                            name,
                            price,
                            img,
                            quantity: 1
                        });
                    }

                    updateCart();
                    showCartNotification(name);
                });
            });

            // Update cart
            function updateCart() {
                renderCartItems();
                updateCartTotal();
                updateCartCount();
                saveCartToLocalStorage();
            }

            // Render cart items
            function renderCartItems() {
                cartItemsContainer.innerHTML = '';

                if (cart.length === 0) {
                    cartItemsContainer.innerHTML = '<p style="text-align: center;">Your cart is empty</p>';
                    return;
                }

                cart.forEach(item => {
                    const cartItemElement = document.createElement('div');
                    cartItemElement.classList.add('cart-item');
                    cartItemElement.innerHTML = `
                        <div class="cart-item-img">
                            <img src="${item.img}" alt="${item.name}">
                        </div>
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                });

                // Add event listeners to quantity buttons
                document.querySelectorAll('.decrease').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const item = cart.find(item => item.id === id);
                        if (item.quantity > 1) {
                            item.quantity -= 1;
                            updateCart();
                        }
                    });
                });

                document.querySelectorAll('.increase').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const item = cart.find(item => item.id === id);
                        item.quantity += 1;
                        updateCart();
                    });
                });

                document.querySelectorAll('.quantity-input').forEach(input => {
                    input.addEventListener('change', function() {
                        const id = this.getAttribute('data-id');
                        const item = cart.find(item => item.id === id);
                        const newQuantity = parseInt(this.value);
                        if (newQuantity >= 1) {
                            item.quantity = newQuantity;
                            updateCart();
                        } else {
                            this.value = item.quantity;
                        }
                    });
                });

                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        cart = cart.filter(item => item.id !== id);
                        updateCart();
                    });
                });
            }

            // Update cart total
            function updateCartTotal() {
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                cartTotalElement.textContent = `$${total.toFixed(2)}`;
            }

            // Update cart count
            function updateCartCount() {
                const count = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCountElement.textContent = count;
            }

            // Show notification when item is added to cart
            function showCartNotification(itemName) {
                const notification = document.createElement('div');
                notification.classList.add('notification');
                notification.innerHTML = `
                    <div style="position: fixed; bottom: 20px; right: 20px; background: var(--success-color); color: white; padding: 15px 25px; border-radius: 5px; box-shadow: 0 3px 10px rgba(0,0,0,0.2); z-index: 1000; animation: slideIn 0.5s, fadeOut 0.5s 2.5s forwards;">
                        <i class="fas fa-check-circle"></i> ${itemName} added to cart!
                    </div>
                `;
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.remove();
                }, 3000);
            }

            // Save cart to localStorage
            function saveCartToLocalStorage() {
                localStorage.setItem('cart', JSON.stringify(cart));
            }

            // Load cart from localStorage
            function loadCartFromLocalStorage() {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    cart = JSON.parse(savedCart);
                    updateCart();
                }
            }

            // Initialize cart
            loadCartFromLocalStorage();

            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();

                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });

                        // Close mobile menu if open
                        navLinks.classList.remove('active');
                        hamburger.classList.remove('active');
                        overlay.classList.remove('active');
                    }
                });
            });
        });
