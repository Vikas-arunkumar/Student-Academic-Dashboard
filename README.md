# 🎓 Student Academic Dashboard

A modern full-stack academic management system that enables teachers to manage students, track academic performance, calculate GPA/CGPA automatically, monitor arrears, and analyze classroom statistics through an interactive dashboard.

---

## 🚀 Features

### 👨‍🏫 Teacher Authentication

* Secure teacher login
* Personalized dashboard
* Teacher-specific student management

### 👨‍🎓 Student Management

* Add Student
* Update Student
* Delete Student
* Search Student by Student ID
* View detailed academic records

### 📚 Subject Management

* Add semester subjects
* Update grades and credits
* Delete subjects
* Semester-wise result tracking

### 📈 Academic Analytics

* Automatic GPA Calculation
* Automatic CGPA Calculation
* Arrear Detection & Tracking
* Semester Performance Analysis
* Student Ranking Leaderboard
* Class Statistics Dashboard

### 🏆 Leaderboard System

Students are ranked based on:

1. Lowest arrears
2. Highest CGPA

### 📊 Dashboard Insights

* Total Students
* Average CGPA
* Total Arrears
* Semester Performance Trends
* Student Academic Comparison

---

# 🏗️ System Architecture

```text
React Frontend
       │
       ▼
Axios API Calls
       │
       ▼
Spring Boot REST APIs
       │
       ▼
Service Layer
(Academic Logic)
       │
       ▼
Spring Data JPA
       │
       ▼
MySQL Database
```

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* Axios
* GSAP
* Motion
* OGL
* Lucide React

## Backend

* Java
* Spring Boot
* Spring MVC
* Spring Data JPA
* Maven

## Database

* MySQL

---

# 📂 Project Structure

```text
StudentAcademicDashboard
│
├── crud_project                 # Spring Boot Backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   └── dto
│
└── student-dashboard            # React Frontend
    ├── src
    │   ├── components
    │   ├── assets
    │   └── ui
    └── public
```

---

# 🧮 GPA Calculation

The system automatically calculates GPA using:

[
GPA = \frac{\sum (GradePoint \times Credits)}{\sum Credits}
]

### Grade Mapping

| Grade | Grade Point |
| ----- | ----------- |
| O / S | 10          |
| A+    | 9           |
| A     | 8           |
| B+    | 7           |
| B     | 6           |
| RA    | 0           |
---

# 📸 Major Modules

### Login Page

Teacher authentication and access control.

### Student Dashboard

Manage all students under a teacher account.

### Student Summary

Displays:

* CGPA
* Total Arrears
* Academic Overview

### Subject Management

Manage semester-wise academic records.

### Semester Performance

Visual semester GPA tracking.

### Leaderboard

Academic ranking based on CGPA and arrears.

### Statistics Dashboard

Overall class-level analytics.

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/StudentAcademicDashboard.git
```

```bash
cd StudentAcademicDashboard
```

---

## 2️⃣ Backend Setup

Navigate to backend:

```bash
cd crud_project
```

Configure MySQL database inside:

```properties
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_dashboard
spring.datasource.username=root
spring.datasource.password=your_password
```

Run Backend:

```bash
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

---

## 3️⃣ Frontend Setup

Open new terminal:

```bash
cd student-dashboard
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# 📌 Future Enhancements

* JWT Authentication
* Role-Based Access Control
* Student Attendance Tracking
* Export Reports to PDF
* Email Notifications
* Advanced Charts & Visualizations
* Student Performance Prediction using Machine Learning

---

# 🎯 Learning Outcomes

This project demonstrates:

* Full Stack Development
* REST API Design
* Spring Boot Architecture
* React Component Design
* Database Modeling
* CRUD Operations
* Academic Analytics
* State Management
* Modern UI/UX Development

---

# 👨‍💻 Author

**Vikas Arunkumar**

B.Tech Information Technology
Madras Institute of Technology (MIT), Anna University

---

## ⭐ Support

If you found this project useful, consider giving it a **Star ⭐** on GitHub.
