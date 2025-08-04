
# 🚢 Cruise Ship Management System

A secure, role-based web application that streamlines operations onboard a cruise ship — including staff task assignment, service bookings, inventory requests, and centralized admin control. Built using **HTML**, **CSS**, **JavaScript**, and **Firebase**.


---

## 🔥 Features by Role

### 👨‍✈️ Admin
- 👥 Add / Delete users
- 🔁 Reset user passwords
- 🛡️ Change own password
- 📊 View real-time dashboard stats
- 📂 View & Export audit logs (CSV)
- 🚪 Secure login/logout with session tracking

### 🧳 Voyager
- 🛏️ Book cruise services
- 🥗 Order food / ✏️ stationery
- 📋 Track all orders & bookings
- 📆 Validations for future booking only

### 🧑‍🍳 Head Cook
- 📋 View assigned cooking tasks
- 📦 Request inventory from supervisor
- 📥 View inventory request status
- 🍽️ View meal plans
- 📤 Export logs to CSV
- 🔐 Change password

### 🛠️ Supervisor
- 📋 View & update task statuses
- 📨 Submit and view requests
- 📊 Log all activities
- 🔑 Change password
- ⬇️ Export activity logs

### 🧑‍💼 Manager
- 👥 View staff members
- ✅ Assign tasks to supervisors/head cooks
- 📈 Track task progress
- 📨 Approve or reject submitted requests
- 📤 Export logs to CSV
- 🔐 Change password

---

## 🛠️ Tech Stack

| Layer        | Tech                        |
|--------------|-----------------------------|
| Frontend     | HTML, CSS, JavaScript       |
| Backend/Auth | Firebase Authentication     |
| Database     | Firebase Realtime Database  |
| Hosting      | Firebase Hosting / Vercel   |

---

## 🗂️ Project Structure

```

CruiseShipManagement/
├── index.html
├── login.html
├── register.html
├── firebase/
│   └── firebase-config.js
├── js/
│   ├── admin.js
│   ├── voyager.js
│   ├── manager.js
│   ├── supervisor.js
│   └── headcook.js
├── dashboard.html
├── css/
│   └── styles.css

````

---

## 🚀 Getting Started

1. **Clone the Repository**
```bash
git clone https://github.com/zeel-0415/cruise-ship-management.git
````

2. **Set Up Firebase**

   * Create a project on [Firebase Console](https://console.firebase.google.com/)
   * Enable **Authentication (Email/Password)**
   * Set up **Realtime Database**
   * Replace config in `firebase/firebase-config.js`

3. **Run Locally**

   * Use Live Server in VS Code
   * Or open `index.html` in browser

---

## 📈 Deployment Options

* Firebase Hosting
* Vercel
* GitHub Pages (for static hosting)

---
images--
![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)
![alt text](image-8.png)
![alt text](image-9.png)
![alt text](image-10.png)

## 🧩 Future Enhancements

* ✉️ Email alerts on status changes
* 📱 Make it a PWA (Progressive Web App)
* 🧠 Add AI/ML-based resource suggestions
* 📦 Role-based analytics dashboard

---

## 👨‍💻 Developer

**Akil Pathan**
💼 FullStack Developer (React | Node.js | Firebase | Django)
🌍 Mumbai, India
🔗 [Portfolio Website](https://portfolio-akil.vercel.app)
📧 [mulaniakil154@gmail.com]

---

## 📄 License

This project is licensed under the **MIT License**.

```

---
