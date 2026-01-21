// Products Data
const products = [
    {
        id: 1,
        name: 'مقياس ضغط الدم الرقمي',
        price: 150,
        category: 'devices',
        emoji: '🩺',
        desc: 'جهاز قياس ضغط دقيق'
    },
    {
        id: 2,
        name: 'ميزان طبي ذكي',
        price: 200,
        category: 'devices',
        emoji: '⚖️',
        desc: 'بتقنية الاتصال الذكي'
    },
    {
        id: 3,
        name: 'ترمومتر رقمي',
        price: 45,
        category: 'supplies',
        emoji: '🌡️',
        desc: 'قياس سريع ودقيق'
    },
    {
        id: 4,
        name: 'كمامات طبية (50)',
        price: 30,
        category: 'supplies',
        emoji: '😷',
        desc: 'حماية عالية الجودة'
    },
    {
        id: 5,
        name: 'قفازات طبية (100)',
        price: 25,
        category: 'supplies',
        emoji: '🧤',
        desc: 'قفازات معقمة'
    },
    {
        id: 6,
        name: 'جهاز الأكسجين المحمول',
        price: 800,
        category: 'devices',
        emoji: '🫁',
        desc: 'أكسجين آمن وفعال'
    },
    {
        id: 7,
        name: 'عصابات ضاغطة',
        price: 35,
        category: 'supplies',
        emoji: '🩹',
        desc: 'للإسعافات الأولية'
    },
    {
        id: 8,
        name: 'جهاز قياس السكر',
        price: 180,
        category: 'devices',
        emoji: '💉',
        desc: 'دقة عالية جداً'
    },
    {
        id: 9,
        name: 'مجموعة إسعافات أولية',
        price: 120,
        category: 'offers',
        emoji: '⚕️',
        desc: 'شاملة وكاملة'
    },
    {
        id: 10,
        name: 'عكاز طبي قابل للتعديل',
        price: 100,
        category: 'devices',
        emoji: '🦵',
        desc: 'مريح وآمن'
    },
    {
        id: 11,
        name: 'حقن معقمة (100)',
        price: 40,
        category: 'supplies',
        emoji: '🩸',
        desc: 'معقمة 100%'
    },
    {
        id: 12,
        name: 'مجموعة خاصة للعناية',
        price: 99,
        category: 'offers',
        emoji: '🎁',
        desc: 'خصم 30% اليوم فقط'
    }
];

// Global Variables
let cart = [];
let currentCategory = 'all';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupCategoryButtons();
    loadCartFromStorage();
    updateCartBadge();
});

// Load products based on current category
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    const filteredProducts = products.filter(p =>
        currentCategory === 'all' || p.category === currentCategory
    );

    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">لا توجد منتجات متاحة</div>';
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <span class="product-emoji">${product.emoji}</span>
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.desc}</div>
            <div class="product-price">${product.price} ريال</div>
            <div class="product-actions">
                <input type="number" class="qty-input" id="qty${product.id}" value="1" min="1" max="99">
                <button class="add-btn" onclick="addToCart(${product.id})">أضف</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Setup category button event listeners
function setupCategoryButtons() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.category;
            loadProducts();
        });
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const qtyInput = document.getElementById(`qty${productId}`);
    const qty = parseInt(qtyInput.value) || 1;

    if (qty < 1) {
        showNotification('⚠️ الكمية يجب أن تكون أكبر من صفر');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({ ...product, quantity: qty });
    }

    saveCartToStorage();
    updateCartBadge();
    showNotification(`✓ تمت إضافة ${product.name} للسلة`);
    qtyInput.value = '1';
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalQty;
}

// Open cart modal
function openCart() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">السلة فارغة 😢</div>';
        document.getElementById('cartSummary').style.display = 'none';
    } else {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <button class="remove-btn" onclick="removeFromCart(${index})">حذف</button>
                <span class="cart-item-price">${item.price * item.quantity} ريال</span>
                <span class="cart-item-name">${item.name} (x${item.quantity})</span>
            `;
            cartItems.appendChild(cartItem);
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('totalPrice').textContent = total + ' ريال';
        document.getElementById('cartSummary').style.display = 'block';
    }

    modal.classList.add('active');
}

// Close cart modal
function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

// Remove item from cart
function removeFromCart(index) {
    const item = cart[index];
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartBadge();
    showNotification(`✓ تم حذف ${item.name} من السلة`);
    openCart();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('السلة فارغة');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.length;
    const message = `شكراً لك!\n\n✓ تم تأكيد طلبك\n\nعدد المنتجات: ${itemCount}\nالإجمالي: ${total} ريال\n\nسيتم التوصيل قريباً`;

    alert(message);
    cart = [];
    saveCartToStorage();
    updateCartBadge();
    closeCart();
    loadProducts();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Save cart to localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem('medistore_cart', JSON.stringify(cart));
    } catch (e) {
        console.log('localStorage not available');
    }
}

// Load cart from localStorage
function loadCartFromStorage() {
    try {
        const saved = localStorage.getItem('medistore_cart');
        if (saved) {
            cart = JSON.parse(saved);
        }
    } catch (e) {
        console.log('Error loading cart from storage');
    }
}

// Toggle menu
function toggleMenu() {
    console.log('Menu toggled');
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('cartModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCart();
        }
    });
});