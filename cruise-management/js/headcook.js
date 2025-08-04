import {
  getAuth,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { app } from "../firebase/firebase-config.js";

const auth = getAuth(app);
const db = getDatabase(app);

function getCurrentUserId() {
  return auth.currentUser ? auth.currentUser.uid : null;
}

function logAction(action) {
  const logRef = ref(db, "logs/headcook");
  push(logRef, {
    user: auth.currentUser.email,
    action,
    timestamp: new Date().toLocaleString()
  });
}

// ✅ View Cooking Tasks
window.viewCookingTasks = function () {
  const uid = getCurrentUserId();
  if (!uid) return alert("Not logged in.");
  const tasksRef = ref(db, `headcook/${uid}/tasks`);
  onValue(tasksRef, (snapshot) => {
    const tasks = snapshot.val();
    alert(tasks ? JSON.stringify(tasks, null, 2) : "No cooking tasks assigned.");
    logAction("Viewed Cooking Tasks");
  }, {
    onlyOnce: true
  });
};

// ✅ Request Inventory
window.requestInventory = function () {
  const uid = getCurrentUserId();
  if (!uid) return alert("Not logged in.");

  const item = prompt("Enter inventory item to request:");
  const quantity = prompt("Enter quantity:");

  if (!item || !quantity) return;

  const requestRef = ref(db, "inventoryRequests");
  push(requestRef, {
    requestedBy: auth.currentUser.email,
    item,
    quantity,
    status: "Pending",
    timestamp: new Date().toISOString()
  });

  alert("Inventory request submitted.");
  logAction(`Requested Inventory: ${item} x${quantity}`);
};

// ✅ View Inventory Status
// ✅ View Inventory Request Status - Formatted View
window.viewInventoryStatus = function () {
  const statusRef = ref(db, "inventoryRequests");
  onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    const relevant = [];

    for (let key in data) {
      if (data[key].requestedBy === auth.currentUser.email) {
        relevant.push(data[key]);
      }
    }

    if (relevant.length === 0) {
      alert("No inventory requests found.");
      return;
    }

    // Format results in a clean table-style string
    let message = "📦 Inventory Request Status:\n\n";
    relevant.forEach((req, index) => {
      message += `#${index + 1}\n`;
      message += `Item: ${req.item}\n`;
      message += `Quantity: ${req.quantity}\n`;
      message += `Status: ${req.status}\n`;
      message += `Time: ${new Date(req.timestamp).toLocaleString()}\n\n`;
    });

    alert(message);
    logAction("Checked Inventory Request Status");
  });
};

// ✅ View Meal Plans
window.viewMealPlans = function () {
  const planRef = ref(db, "mealPlans");
  onValue(planRef, (snapshot) => {
    const plans = snapshot.val();
    alert(plans ? JSON.stringify(plans, null, 2) : "No meal plans available.");
    logAction("Viewed Meal Plans");
  }, {
    onlyOnce: true
  });
};

// ✅ Export Logs to CSV
window.exportLogs = function () {
  const logsRef = ref(db, "logs/headcook");
  onValue(logsRef, (snapshot) => {
    const logs = snapshot.val();
    if (!logs) return alert("No logs available.");

    let csv = "User,Action,Timestamp\n";
    Object.values(logs).forEach(log => {
      csv += `${log.user},${log.action},${log.timestamp}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "headcook_logs.csv";
    a.click();

    logAction("Exported Logs");
  }, {
    onlyOnce: true
  });
};

// ✅ Change Password
window.changePassword = function () {
  const current = prompt("Enter current password:");
  const newPass = prompt("Enter new password:");

  if (!current || !newPass) return;

  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user.email, current);

  reauthenticateWithCredential(user, credential)
    .then(() => updatePassword(user, newPass))
    .then(() => {
      alert("Password changed successfully.");
      logAction("Password Changed");
    })
    .catch((error) => alert("Error: " + error.message));
};

// ✅ Logout & Back
window.onload = () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const backBtn = document.getElementById("backBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          window.location.href = "/index.html";
        })
        .catch((error) => {
          alert("Logout Error: " + error.message);
        });
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
};
