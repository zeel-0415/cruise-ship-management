import { auth, db } from "../firebase/firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

import {
  ref as dbRef,
  set,
  get
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// 🔐 Login Handler
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(userCred => {
      const user = userCred.user;
      console.log("✅ Logged in as:", user.email);

      const roleRef = dbRef(db, "users/" + user.uid);
      get(roleRef).then(snapshot => {
        if (snapshot.exists()) {
          let userData = snapshot.val();
          let role = userData.role;

          // 🔁 Fix for missing role (legacy admin)
          if (!role && email === "admin@cruise.com") {
            role = "admin";
            set(roleRef, {
              email: user.email,
              role: role
            });
            console.log("🔁 Admin role auto-assigned.");
          }

          console.log("🎭 User role:", role);
          switch (role) {
            case "admin":
              window.location.href = "admin.html";
              break;
            case "voyager":
              window.location.href = "voyager.html";
              break;
            case "manager":
              window.location.href = "manager.html";
              break;
            case "headcook":
              window.location.href = "headcook.html";
              break;
            case "supervisor":
              window.location.href = "supervisor.html";
              break;
            default:
              alert("Unknown role. Contact support.");
          }
        } else {
          // ❗Fallback for legacy users (admin)
          if (email === "admin@cruise.com") {
            set(roleRef, {
              email: user.email,
              role: "admin"
            }).then(() => {
              window.location.href = "admin.html";
            });
          } else {
            alert("No role assigned. Contact admin.");
          }
        }
      });
    })
    .catch(err => {
      console.error("❌ Login failed:", err.message);
      alert("Login failed: " + err.message);
    });
});

// 📝 Register Handler
document.getElementById("registerBtn").addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCred => {
      const user = userCred.user;
      console.log("✅ Registered:", user.email);

      // 🎭 Assign role
      let role = "voyager";
      if (email === "admin@cruise.com") {
        role = "admin";
      }

      const userRef = dbRef(db, "users/" + user.uid);
      set(userRef, {
        email: user.email,
        role: role
      }).then(() => {
        alert(`Registration successful as ${role}. You can now log in.`);
      });
    })
    .catch(err => {
      console.error("❌ Registration failed:", err.message);
      alert("Registration failed: " + err.message);
    });
});
