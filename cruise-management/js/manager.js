// js/manager.js
import { getAuth, signOut, updatePassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, ref, onValue, set, push, update, get } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { auth, db } from "../firebase/firebase-config.js";


// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

// LOAD STAFF LIST
const staffListDiv = document.getElementById("staffList");
function loadStaffList() {
  const usersRef = ref(db, 'users');
  onValue(usersRef, snapshot => {
    let html = `<table><tr><th>Name</th><th>Email</th><th>Role</th></tr>`;
    snapshot.forEach(child => {
      const user = child.val();
      if (user.role !== 'manager') {
        html += `<tr><td>${user.name}</td><td>${user.email}</td><td>${user.role}</td></tr>`;
      }
    });
    html += `</table>`;
    staffListDiv.innerHTML = html;
  });
}
loadStaffList();

// ASSIGN TASK
const assignTaskForm = document.getElementById("assignTaskForm");
assignTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskTo = document.getElementById("taskTo").value;
  const taskContent = document.getElementById("taskContent").value;

  const taskRef = push(ref(db, `tasks/${taskTo.replace('.', '_')}`));
  set(taskRef, {
    content: taskContent,
    status: "Pending",
    assignedAt: new Date().toISOString()
  }).then(() => {
    document.getElementById("taskStatus").innerText = "✅ Task assigned successfully!";
    logActivity(`Task assigned to ${taskTo}`);
    assignTaskForm.reset();
    loadTaskTracker();
  });
});

// LOAD TASK TRACKER
function loadTaskTracker() {
  const trackerDiv = document.getElementById("taskTracker");
  const tasksRef = ref(db, 'tasks');
  onValue(tasksRef, snapshot => {
    let html = `<table><tr><th>Assigned To</th><th>Task</th><th>Status</th></tr>`;
    snapshot.forEach(user => {
      const email = user.key.replace('_', '.');
      user.forEach(task => {
        const t = task.val();
        html += `<tr><td>${email}</td><td>${t.content}</td><td>${t.status}</td></tr>`;
      });
    });
    html += `</table>`;
    trackerDiv.innerHTML = html;
  });
}
loadTaskTracker();

// APPROVE REQUESTS
function loadRequests() {
  const reqDiv = document.getElementById("approvalRequests");
  const reqRef = ref(db, 'requests');
  onValue(reqRef, snapshot => {
    let html = '';
    snapshot.forEach(child => {
      const req = child.val();
      html += `<div><b>${req.user}</b>: ${req.request} <button onclick="approve('${child.key}')">Approve</button> <button onclick="reject('${child.key}')">Reject</button></div>`;
    });
    reqDiv.innerHTML = html;
  });
}
window.approve = (key) => {
  update(ref(db, `requests/${key}`), { status: 'Approved' });
  logActivity(`Request ${key} approved`);
};
window.reject = (key) => {
  update(ref(db, `requests/${key}`), { status: 'Rejected' });
  logActivity(`Request ${key} rejected`);
};
loadRequests();

// LOGS AND EXPORT
const logsDiv = document.getElementById("logs");
const exportBtn = document.getElementById("exportLogsBtn");
function loadLogs() {
  const logsRef = ref(db, 'logs');
  onValue(logsRef, snapshot => {
    let html = `<ul>`;
    snapshot.forEach(child => {
      html += `<li>${child.val()}</li>`;
    });
    html += `</ul>`;
    logsDiv.innerHTML = html;
  });
}
exportBtn.addEventListener("click", () => {
  const logsRef = ref(db, 'logs');
  get(logsRef).then(snapshot => {
    let csv = 'Log\n';
    snapshot.forEach(child => {
      csv += `"${child.val()}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'logs.csv';
    link.click();
  });
});
loadLogs();

// CHANGE PASSWORD
const passwordForm = document.getElementById("changePasswordForm");
passwordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newPassword = document.getElementById("newPassword").value;
  updatePassword(auth.currentUser, newPassword).then(() => {
    logActivity('Password changed successfully');
    alert("Password changed!");
    passwordForm.reset();
  });
});

// AUDIT TRAIL
function loadAuditTrail() {
  const auditDiv = document.getElementById("auditTrail");
  const refAudit = ref(db, 'audit');
  onValue(refAudit, snapshot => {
    let html = '<ul>';
    snapshot.forEach(child => {
      html += `<li>${child.val()}</li>`;
    });
    html += '</ul>';
    auditDiv.innerHTML = html;
  });
}
loadAuditTrail();

function logActivity(msg) {
  const logRef = push(ref(db, 'logs'));
  const auditRef = push(ref(db, 'audit'));
  const logMsg = `${new Date().toLocaleString()} - Manager: ${msg}`;
  set(logRef, logMsg);
  set(auditRef, logMsg);
}
