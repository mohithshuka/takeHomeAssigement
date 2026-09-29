# Task API — Take-Home Assignment

A Node.js and Express REST API for managing tasks.

This project was completed as part of a take-home engineering assignment. The main focus was to understand an existing codebase, identify a real bug through testing, fix it, implement a new API feature, and build a reliable unit and integration test suite.

---

## 🚀 What We Implemented

During the assignment, we completed the following:

- 🔍 Explored and understood the existing Task API
- 🐛 Identified and fixed a pagination bug
- ➕ Implemented `PATCH /tasks/:id/assign`
- 🧪 Added API integration tests
- 🧩 Added unit tests for the task service
- ⚠️ Added edge-case and validation tests
- 📊 Achieved **94%+ statement coverage**
- 📝 Documented the discovered bug and its root cause
- 🔗 Pushed the complete project to GitHub

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **JavaScript**
- **Jest**
- **Supertest**
- **UUID**
- **In-memory data store**

---

## 📁 Project Structure

```text
task-api/
│
├── src/
│   ├── app.js
│   │
│   ├── routes/
│   │   └── tasks.js
│   │
│   ├── services/
│   │   └── taskService.js
│   │
│   └── utils/
│       └── validators.js
│
├── tests/
│   ├── task.test.js
│   └── taskService.test.js
│
├── BUGS.md
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
