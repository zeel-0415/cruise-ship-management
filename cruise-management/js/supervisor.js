import { auth, db } from "../firebase/firebase-config.js";
import {
  signOut,
  updatePassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {
  ref,
  onValue,
  set,
  push,
  get,
  update,
  child
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// Track current user
let currentUserUID = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserUID = user.uid;
    loadTasks();
    loadRequestStatus();
    loadLogs();
    loadAuditTrail();
  } else {
    window.location.href = "../index.html";
  }
});

// Load Tasks
function loadTasks() {
  const taskRef = ref(db, "assignedTasks/" + currentUserUID);
  onValue(taskRef, (snapshot) => {
    const tbody = document.getElementById("task-body");
    tbody.innerHTML = "";
    snapshot.forEach((child) => {
      const taskId = child.key;
      const { task, status } = child.val();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${task}</td>
        <td>${status}</td>
        <td>
          <select data-id="${taskId}">
            <option value="Pending" ${status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="In Progress" ${status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Completed" ${status === "Completed" ? "selected" : ""}>Completed</option>
          </select>
        </td>`;
      tbody.appendChild(row);
    });

    document.querySelectorAll("select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const id = e.target.dataset.id;
        const statusRef = ref(db, `assignedTasks/${currentUserUID}/${id}`);
        update(statusRef, { status: e.target.value });
        logAction("Updated task status to " + e.target.value);
      });
    });
  });
}

// Submit Request
document.getElementById("submit-request-btn").addEventListener("click", () => {
  const requestText = document.getElementById("request-input").value.trim();
  if (requestText === "") return;
  const requestRef = ref(db, "requests/");
  push(requestRef, {
    uid: currentUserUID,
    request: requestText,
    status: "Pending"
  });
  document.getElementById("request-input").value = "";
  logAction("Submitted a new request");
});

// View Request Status
function loadRequestStatus() {
  const requestRef = ref(db, "requests/");
  onValue(requestRef, (snapshot) => {
    const list = document.getElementById("request-status-list");
    list.innerHTML = "";
    snapshot.forEach((child) => {
      const { uid, request, status } = child.val();
      if (uid === currentUserUID) {
        const li = document.createElement("li");
        li.textContent = `${request} - ${status}`;
        list.appendChild(li);
      }
    });
  });
}

// Logs
function loadLogs() {
  const logRef = ref(db, `logs/${currentUserUID}`);
  onValue(logRef, (snapshot) => {
    const list = document.getElementById("logs-list");
    list.innerHTML = "";
    snapshot.forEach((child) => {
      const { action, timestamp } = child.val();
      const li = document.createElement("li");
      li.textContent = `${action} - ${timestamp}`;
      list.appendChild(li);
    });
  });
}

// Export Logs to CSV
document.getElementById("export-logs-btn").addEventListener("click", () => {
  const logRef = ref(db, `logs/${currentUserUID}`);
  get(logRef).then((snapshot) => {
    let csv = "Action,Timestamp\n";
    snapshot.forEach((child) => {
      const { action, timestamp } = child.val();
      csv += `"${action}","${timestamp}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "supervisor_logs.csv";
    link.click();
  });
});

// Change Password
document.getElementById("change-password-btn").addEventListener("click", () => {
  const newPassword = document.getElementById("new-password").value;
  if (newPassword.length < 6) return alert("Password must be at least 6 characters.");
  updatePassword(auth.currentUser, newPassword)
    .then(() => {
      alert("Password changed successfully");
      logAction("Changed password");
    })
    .catch((error) => alert("Error: " + error.message));
});

// Load Audit Trail
function loadAuditTrail() {
  const auditRef = ref(db, `auditTrail/${currentUserUID}`);
  onValue(auditRef, (snapshot) => {
    const list = document.getElementById("audit-list");
    list.innerHTML = "";
    snapshot.forEach((child) => {
      const { action, timestamp } = child.val();
      const li = document.createElement("li");
      li.textContent = `${action} - ${timestamp}`;
      list.appendChild(li);
    });
  });
}

// Log Action
function logAction(action) {
  const now = new Date().toLocaleString();
  const logRef = push(ref(db, `logs/${currentUserUID}`));
  set(logRef, { action, timestamp: now });

  const auditRef = push(ref(db, `auditTrail/${currentUserUID}`));
  set(auditRef, { action, timestamp: now });
}
