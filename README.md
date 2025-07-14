# 🧠 TaskNest – Task & Project Management API

TaskNest is a feature-rich task and project management backend built using **Node.js**, **Express.js**, and **MongoDB**. It supports everything from user authentication to real-time notifications, role-based access, activity logging, audit trails, and more — just like the backend behind apps like Notion, Trello, or Jira.

---

## 🚀 Features

- 🔐 User Registration, Login, OTP-based Password Reset
- 👥 Role-based Project Collaboration (Admin, Member)
- 📌 Tasks with Priority, Tags, Comments, and Followers
- 🧠 Smart Filtering, Search, and Pagination
- 🕵️‍♂️ Activity Logs (What happened, by whom, and when)
- 🧾 Full Audit Trail (What exactly changed and how)
- 🕒 Cron Job Reminders (e.g., due today notifications)
- 📘 Auto-Generated Swagger Docs
- 🧪 Postman Collection included

---

## ⚙️ Tech Stack

| Tech        | Purpose                      |
|-------------|------------------------------|
| Node.js     | JavaScript runtime           |
| Express.js  | Web framework                |
| MongoDB     | NoSQL Database               |
| Mongoose    | ODM for MongoDB              |
| JWT         | Authentication               |
| node-cron   | Scheduled task reminders     |
| Swagger     | API documentation            |

---

## 📂 Folder Structure
tasknest/
├── controllers # All route logic
├── models # Mongoose models
├── routes # API route definitions
├── middlewares # Auth & role-based access
├── utils # Helpers (e.g., cron jobs)
├── config # MongoDB connection
├── socket.js # Socket.IO setup
├── swagger.js # Swagger config
├── server.js # App entry point
├── README.md # Project documentation


---

## 🛠 Tech Stack

| Tech       | Purpose                    |
|------------|----------------------------|
| Node.js    | JavaScript runtime         |
| Express.js | Web framework              |
| MongoDB    | NoSQL database             |
| Mongoose   | MongoDB ODM                |
| JWT        | Authentication             |
| node-cron  | Scheduled jobs             |
| Swagger    | API Documentation          |

---

## 📄 API Documentation

View full API reference via Swagger:

```bash
# After running the server
http://localhost:5000/api-docs


---

## 🧪 How to Run Locally

1. **Clone this repo**
```bash
git clone https://github.com/your-username/tasknest-backend.git
cd tasknest-backend



# ✅ Future Improvements (Optional)
⏳ Email or push notifications

📁 File uploads (attachments to tasks)

🌐 Deploy to Render/Railway

📊 Analytics per project or user

📱 Connect with a frontend like React or Next.js