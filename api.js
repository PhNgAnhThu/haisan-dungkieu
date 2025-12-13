import { 
    collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { db, app } from "./firebase.js";

const auth = getAuth(app);

// ==========================================
// 1. PHẦN SẢN PHẨM (PRODUCTS)
// ==========================================

// GET /products (Lấy tất cả sản phẩm)
export async function getAllProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
        throw error;
    }
}

// GET /products/:id (Lấy chi tiết 1 sản phẩm)
export async function getProductById(id) {
    try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Không tìm thấy sản phẩm!");
        }
    } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
        throw error;
    }
}

// POST /products (Thêm sản phẩm mới - Dành cho Admin)
export async function addProduct(productData) {
    try {
        // productData là object chứa: name, price, quantity, description, image...
        const docRef = await addDoc(collection(db, "products"), {
            ...productData,
            created_at: serverTimestamp() // Tự động lấy giờ server
        });
        console.log("Đã thêm sản phẩm với ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Lỗi thêm sản phẩm:", error);
        throw error;
    }
}

// PUT /products/:id (Cập nhật sản phẩm - Dành cho Admin)
export async function updateProduct(id, newData) {
    try {
        const docRef = doc(db, "products", id);
        await updateDoc(docRef, newData);
        console.log("Đã cập nhật sản phẩm:", id);
        return true;
    } catch (error) {
        console.error("Lỗi cập nhật sản phẩm:", error);
        throw error;
    }
}

// DELETE /products/:id (Xóa sản phẩm - Dành cho Admin)
export async function deleteProduct(id) {
    try {
        await deleteDoc(doc(db, "products", id));
        console.log("Đã xóa sản phẩm:", id);
        return true;
    } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        throw error;
    }
}

// ==========================================
// 2. PHẦN ĐƠN HÀNG (ORDERS)
// ==========================================
// Cập nhật trạng thái đơn hàng (VD: pending -> shipped)
export async function updateOrderStatus(orderId, newStatus) {
    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
            status: newStatus
        });
        console.log("Đã cập nhật trạng thái đơn:", orderId);
        return true;
    } catch (error) {
        console.error("Lỗi cập nhật đơn:", error);
        throw error;
    }
}
// POST /orders (Tạo đơn hàng mới)
export async function createOrder(orderData) {
    try {
        // orderData gồm: user_info, items, total_price...
        const docRef = await addDoc(collection(db, "orders"), {
            ...orderData,
            status: "pending", // Mặc định là chờ xác nhận
            created_at: serverTimestamp()
        });
        console.log("Đơn hàng đã tạo thành công:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Lỗi tạo đơn hàng:", error);
        throw error;
    }
}

// GET /orders (Lấy tất cả đơn hàng - Dành cho Admin)
export async function getAllOrders() {
    try {
        // Sắp xếp đơn mới nhất lên đầu
        const q = query(collection(db, "orders"), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        const orders = [];
        querySnapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        return orders;
    } catch (error) {
        console.error("Lỗi lấy danh sách đơn hàng:", error);
        throw error;
    }
}

// GET /orders/:id (Lấy chi tiết đơn hàng)
export async function getOrderById(id) {
    try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Không tìm thấy đơn hàng!");
        }
    } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
        throw error;
    }
}
// 1. Đăng ký tài khoản mới
export async function register(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        throw error; // Ném lỗi ra để bên ngoài bắt (VD: Email đã tồn tại)
    }
}

// 2. Lấy lịch sử đơn hàng của 1 user cụ thể
export async function getMyOrders(userId) {
    try {
        // Chỉ lấy đơn hàng có userId trùng với người đang đăng nhập
        const q = query(
            collection(db, "orders"), 
            where("userId", "==", userId), // Lọc theo ID người dùng
            orderBy("created_at", "desc")
        );
        const querySnapshot = await getDocs(q);
        const orders = [];
        querySnapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        return orders;
    } catch (error) {
        console.error("Lỗi lấy lịch sử đơn:", error);
        return []; // Trả về mảng rỗng nếu lỗi (hoặc chưa index)
    }
}
// Cập nhật trạng thái thanh toán (unpaid -> paid)
export async function updatePaymentStatus(orderId, status) {
    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
            payment_status: status // 'paid' hoặc 'unpaid'
        });
        console.log("Đã cập nhật thanh toán:", orderId);
        return true;
    } catch (error) {
        console.error("Lỗi cập nhật thanh toán:", error);
        throw error;
    }
}
// ==========================================
// 3. PHẦN ĐĂNG NHẬP (AUTH - ADMIN)
// ==========================================

// POST /auth/login (Đăng nhập)
export async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Đăng nhập thành công:", user.email);
        return user;
    } catch (error) {
        console.error("Đăng nhập thất bại:", error.message);
        throw error;
    }
}

// Middleware Verify JWT (Kiểm tra xem đã đăng nhập chưa)
// Trong Firebase client, ta dùng onAuthStateChanged để lắng nghe
export function checkLoginStatus(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            console.log("User đang đăng nhập:", user.email);
            callback(user);
        } else {
            // User is signed out
            console.log("Chưa đăng nhập");
            callback(null);
        }
    });
}

// Đăng xuất
export async function logout() {
    try {
        await signOut(auth);
        console.log("Đã đăng xuất");
    } catch (error) {
        console.error("Lỗi đăng xuất:", error);
    }
}