import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js"; 

// 1. Hàm tải Banner (Giữ nguyên)
async function loadBanner() {
    try {
        const bannerRef = doc(db, "images", "trang-chu");
        const bannerSnap = await getDoc(bannerRef);

        if (bannerSnap.exists()) {
            const data = bannerSnap.data();
            document.getElementById("main-banner").style.backgroundImage = `url('${data.image1}')`;
        }
    } catch (error) {
        console.log("Chưa có banner custom:", error);
    }
}

// 2. Hàm tải Sản phẩm (ĐÃ SỬA LỖI TÊN)
async function loadFeaturedProducts() {
    const container = document.getElementById("featuredProducts");
    if (!container) return; 

    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        
        container.innerHTML = ""; 
        let count = 0;

        querySnapshot.forEach(doc => {
            if (count >= 4) return; 
            const p = doc.data();
            const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price);

            container.innerHTML += `
            <div class="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition duration-300 group">
                <div class="h-64 w-full overflow-hidden relative">
                    <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="${p.name}">
                    
                    <!-- Nhãn giảm giá hoặc bán chạy nếu muốn (Optional) -->
                    <span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">HOT</span>
                </div>
                <div class="p-4 text-center">
                    <!-- SỬA Ở ĐÂY: Đổi p.productName thành p.name -->
                    <h3 class="font-serif font-bold text-xl text-gray-800 line-clamp-1">${p.name}</h3>
                    
                    <p class="text-red-600 font-bold mt-2 text-lg">${price}</p>
                    <button class="mt-3 bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800 transition transform hover:scale-105">Xem chi tiết</button>
                </div>
            </div>
            `;
            count++;
        });
    } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
    }
}

loadBanner();
loadFeaturedProducts();