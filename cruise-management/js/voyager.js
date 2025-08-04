import { auth } from "../firebase/firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// ✅ Redirects now active!
document.getElementById("orderCateringBtn").addEventListener("click", () => {
  window.location.href = "catering.html";
});

document.getElementById("orderStationeryBtn").addEventListener("click", () => {
  window.location.href = "stationery.html";
});

document.getElementById("bookMovieBtn").addEventListener("click", () => {
  window.location.href = "movie.html";
});

document.getElementById("bookSalonBtn").addEventListener("click", () => {
  window.location.href = "salon.html";
});

document.getElementById("bookGymBtn").addEventListener("click", () => {
  window.location.href = "fitness.html";
});

document.getElementById("bookPartyBtn").addEventListener("click", () => {
  window.location.href = "party.html";
});

// 🔒 Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Logged out!");
      window.location.href = "index.html";
    })
    .catch(err => {
      console.error("Logout error:", err);
      alert("Error logging out.");
    });
});
