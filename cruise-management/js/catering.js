import { auth, db } from "../firebase/firebase-config.js";
import {
  push,
  ref
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) {
    alert("You must be logged in.");
    window.location.href = "index.html";
  }

  const form = document.getElementById("stationeryForm");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const item = document.getElementById("itemName").value.trim();
    const qty = parseInt(document.getElementById("quantity").value);

    const orderRef = ref(db, `orders/stationery`);
    push(orderRef, {
      item,
      quantity: qty,
      user: user.email,
      uid: user.uid,
      timestamp: Date.now()
    });

    alert("✅ Order placed!");
    form.reset();
  });
});
