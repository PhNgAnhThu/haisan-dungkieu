// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDD_3xrt1ryUxzLOBrJFCZcZRpMRYAApVc",
    authDomain: "dk-shop-cf8e3.firebaseapp.com",
    projectId: "dk-shop-cf8e3",
    storageBucket: "dk-shop-cf8e3.firebasestorage.app",
    messagingSenderId: "531289164354",
    appId: "1:531289164354:web:74b1cbae1d7562f0f33bdb",
    measurementId: "G-MDWZNKB1ZT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };