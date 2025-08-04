// firebase/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDvkEcdwlzTurKDDXrAOqSglGSv05Kab9Y",
  authDomain: "cruise-ship-management-dc1ac.firebaseapp.com",
  projectId: "cruise-ship-management-dc1ac",
  storageBucket: "cruise-ship-management-dc1ac.firebasestorage.app",
  messagingSenderId: "454540763655",
  appId: "1:454540763655:web:5cc7ece3e59d8d9d5a00a2",
  measurementId: "G-L3HN4D8EJZ"
};

// ✅ app initialized
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ✅ Make sure to export `app` too
export { auth, db, app };
