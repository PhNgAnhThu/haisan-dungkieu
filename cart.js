// cart.js - Quản lý giỏ hàng trong LocalStorage

// 1. Lấy giỏ hàng từ bộ nhớ ra
export function getCart() {
    const cart = localStorage.getItem("dk_cart");
    return cart ? JSON.parse(cart) : [];
}

// 2. Lưu giỏ hàng vào bộ nhớ
function saveCart(cart) {
    localStorage.setItem("dk_cart", JSON.stringify(cart));
    updateCartCount(); // Cập nhật số lượng trên menu
}

// 3. Thêm sản phẩm vào giỏ
export function addToCart(product) {
    let cart = getCart();
    
    // Kiểm tra xem món này đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        // Nếu có rồi thì tăng số lượng lên 1
        existingItem.quantity += 1;
    } else {
        // Nếu chưa có thì thêm mới vào (mặc định số lượng là 1)
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

// 4. Cập nhật số lượng (Tăng/Giảm)
export function updateItemQuantity(id, change) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);

    if (item) {
        item.quantity += change;
        // Nếu giảm về 0 thì xóa luôn
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    
    saveCart(cart);
    return cart; // Trả về giỏ mới để render lại
}

// 5. Xóa hẳn sản phẩm khỏi giỏ
export function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    return cart;
}

// 6. Tính tổng tiền
export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// 7. Cập nhật số lượng nhỏ xíu trên Menu (Nếu có cái vòng tròn đỏ)
export function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById("cart-count");
    if (badge) {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}