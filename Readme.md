# 🏥 PulseStack

**Lightweight Digital Queueing System for OPDs**


 PulseStack is a low-cost **QR + SMS–based digital queueing system** designed to replace physical OPD queues in Tier-2/3 hospitals without expensive infrastructure or mobile apps.

---

## 📌 Problem Statement

In many Tier-2 and Tier-3 cities, hospital OPDs still depend on **physical queues and manual token systems**. This causes overcrowding, long and uncertain wait times, poor queue visibility, and operational strain on hospital staff.
Most existing digital solutions are costly, hardware-heavy, or complex to deploy—making them impractical for smaller hospitals.

---

## 💡 Solution Overview

**PulseStack** digitizes OPD queues using **QR codes and SMS notifications**, allowing patients to join queues easily while enabling hospital staff to manage queues through a simple web dashboard.

### Target Users

* **Patients:** Walk-in OPD visitors
* **Hospital Staff:** Receptionists and nurses managing queues
* **OPD Admins:** Supervising doctor-wise queues

### Value Delivered

* Reduced physical crowding
* Clear and fair queue flow
* Minimal setup and training
* Low operational cost

---

## ✨ Key Features

* QR-based patient registration
* Automatic token generation
* SMS notification with token number
* Doctor-wise queue management
* Web-based admin dashboard
* Secure admin authentication

---

## 📦 Scope & Boundaries

### ✅ In Scope

* QR-based walk-in registration
* SMS token notifications
* Admin dashboard for queue control
* Multiple doctor / OPD queues


### ❌ Out of Scope

* Native mobile applications
* Online payments or billing
* Advanced analytics and reporting
* Full hospital management system integration

This controlled scope ensures **reliable delivery within a 4-week sprint**.

---

## 🛠️ Tech Stack

**Frontend**

* React.js
* HTML, CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB Atlas

**Authentication**

* JWT (Admin access)

**Notifications**

* SMS gateway (free-tier / mock for MVP)

**Deployment**

* Frontend: Vercel
* Backend: Render / Railway

---

## 🚀 MVP (Minimum Viable Product)

By the end of the sprint, PulseStack will deliver a **fully functional MVP** with:

* QR-based patient registration
* Unique token generation
* SMS delivery of tokens
* Admin dashboard to call next patient
* Doctor-wise queue handling
* Live queue updates (polling-based)

---

## ⏱️ Sprint Timeline (4 Weeks)

| Week   | Focus Area            | Deliverables                              |
| ------ | --------------------- | ----------------------------------------- |
| Week 1 | Planning & Design     | Requirements, system design, DB schema    |
| Week 2 | Core Development      | Backend APIs, frontend base components    |
| Week 3 | Integration & Testing | API integration, error handling, testing  |
| Week 4 | Deployment & Demo     | Feature freeze, deployment, documentation |

Frontend and backend development will proceed **in parallel** where feasible.

---

## ⚙️ Functional Requirements

* Patients can register via QR code
* System generates unique tokens per queue
* Tokens are delivered via SMS
* Admin can view and manage live queues
* Admin can call the next token
* Multiple doctor-wise queues are supported
* Secure JWT-based admin authentication

---

## 🔐 Non-Functional Requirements

* API response time under **300ms**
* Support for **100+ concurrent users**
* Secure authentication and protected routes
* Reliable and conflict-free token handling
* Simple and accessible UI
=======

### ❌ Out of Scope

* Native mobile applications
* Online payments or billing
* Advanced analytics and reporting
* Full hospital management system integration

This controlled scope ensures **reliable delivery within a 4-week sprint**.

---

## 🛠️ Tech Stack

**Frontend**

* React.js
* HTML, CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB Atlas

**Authentication**

* JWT (Admin access)

**Notifications**

* SMS gateway (free-tier / mock for MVP)

**Deployment**

* Frontend: Vercel
* Backend: Render / Railway

---

## 🚀 MVP (Minimum Viable Product)

By the end of the sprint, PulseStack will deliver a **fully functional MVP** with:

* QR-based patient registration
* Unique token generation
* SMS delivery of tokens
* Admin dashboard to call next patient
* Doctor-wise queue handling
* Live queue updates (polling-based)

---

## ⏱️ Sprint Timeline (4 Weeks)

| Week   | Focus Area            | Deliverables                              |
| ------ | --------------------- | ----------------------------------------- |
| Week 1 | Planning & Design     | Requirements, system design, DB schema    |
| Week 2 | Core Development      | Backend APIs, frontend base components    |
| Week 3 | Integration & Testing | API integration, error handling, testing  |
| Week 4 | Deployment & Demo     | Feature freeze, deployment, documentation |

Frontend and backend development will proceed **in parallel** where feasible.

---

## ⚙️ Functional Requirements

* Patients can register via QR code
* System generates unique tokens per queue
* Tokens are delivered via SMS
* Admin can view and manage live queues
* Admin can call the next token
* Multiple doctor-wise queues are supported
* Secure JWT-based admin authentication

---

## 🔐 Non-Functional Requirements

* API response time under **300ms**
* Support for **100+ concurrent users**
* Secure authentication and protected routes
* Reliable and conflict-free token handling
* Simple and accessible UI

---

## 📊 Success Metrics

* Fully deployed and working MVP
* Successful end-to-end demo
* All core user flows functional
* Reduced dependency on physical queues during testing

---

## ⚠️ Risks & Mitigation

| Risk                | Impact                  | Mitigation      |
| ------------------- | ----------------------- | --------------- |
| Backend delays      | Slows frontend progress | Use mock APIs   |
| Network instability | SMS failures            | Retry handling  |
| Scope creep         | Missed deadlines        | Strict MVP lock |

---

## 🔹 One-Line Summary

> **PulseStack is a lightweight QR and SMS-based digital queueing system that replaces physical OPD queues in Tier-2/3 hospitals without expensive infrastructure.**

---

## 📊 Success Metrics

* Fully deployed and working MVP
* Successful end-to-end demo
* All core user flows functional
* Reduced dependency on physical queues during testing
---