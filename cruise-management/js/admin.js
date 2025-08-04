import { auth, db } from "../firebase/firebase-config.js";
import {
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {
  ref, get, remove, update, onValue, push
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// 🔐 Auth Check
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    const userRef = ref(db, "users/" + user.uid);
    get(userRef).then(snapshot => {
      const userData = snapshot.val();
      if (!userData || userData.role !== "admin") {
        alert("Unauthorized access.");
        window.location.href = "index.html";
      } else {
        loadUsers();
        loadLogs();
      }
    });
  }
});

// 🚪 Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

// 👥 Load Users
function loadUsers() {
  const usersRef = ref(db, "users");
  onValue(usersRef, snapshot => {
    const data = snapshot.val();
    const tbody = document.getElementById("usersTableBody");
    tbody.innerHTML = "";
    let count = 0;

    for (let uid in data) {
      const { email, role } = data[uid];
      count++;
      tbody.innerHTML += `
        <tr>
          <td>${email}</td>
          <td>${role}</td>
          <td>
            <select onchange="updateUserRole('${uid}', '${email}', this.value)">
              <option value="">Change Role</option>
              <option value="admin">Admin</option>
              <option value="voyager">Voyager</option>
              <option value="manager">Manager</option>
              <option value="headcook">Head-Cook</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </td>
          <td>
            <button onclick="deleteUser('${uid}', '${email}')">🗑️ Delete</button>
          </td>
        </tr>
      `;
    }

    document.getElementById("totalUsers").textContent = count;
  });
}

// 🗑️ Delete User
window.deleteUser = function (uid, email) {
  if (confirm(`Delete user ${email}?`)) {
    remove(ref(db, "users/" + uid)).then(() => {
      logAction(`Admin deleted user: ${email}`);
      alert("User deleted.");
    });
  }
};

// 🔄 Update Role
window.updateUserRole = function (uid, email, newRole) {
  if (newRole === "") return;
  const userRef = ref(db, `users/${uid}`);
  update(userRef, { role: newRole })
    .then(() => {
      alert(`Role updated to '${newRole}' for ${email}`);
      logAction(`Admin updated role of ${email} to '${newRole}'`);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to update role.");
    });
};

// 📜 Load Logs
function loadLogs() {
  const logRef = ref(db, "logs");
  onValue(logRef, snapshot => {
    const data = snapshot.val();
    const logList = document.getElementById("logList");
    logList.innerHTML = "";

    for (let id in data) {
      const { action, timestamp } = data[id];
      const li = document.createElement("li");
      li.textContent = `[${timestamp}] ${action}`;
      logList.appendChild(li);
    }
  });
}

// 🧾 Log Action
function logAction(action) {
  const logRef = ref(db, "logs");
  const logEntry = {
    action,
    timestamp: new Date().toLocaleString()
  };
  push(logRef, logEntry);
}

// 📤 Export Logs
document.getElementById("exportBtn").addEventListener("click", () => {
  const logRef = ref(db, "logs");
  get(logRef).then(snapshot => {
    const data = snapshot.val();
    if (!data) {
      alert("No logs found.");
      return;
    }

    let csv = "Timestamp,Action\n";
    for (let id in data) {
      const { timestamp, action } = data[id];
      csv += `"${timestamp}","${action}"\n`;
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "audit_logs.csv";
    a.click();
  });
});
