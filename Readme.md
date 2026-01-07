# 🏥 PulseStack

### Lightweight Digital OPD Queue Management System

> *PulseStack* is a lightweight *QR + SMS–based digital queueing system* built using a modern *full-stack Next.js architecture*, designed for Tier-2 and Tier-3 hospitals where physical queues, overcrowding, and manual token systems are still common.

---

## 📌 Problem Statement

In many small and mid-sized hospitals, OPD queues are managed using *manual tokens and physical waiting lines*. This leads to:

* Overcrowded waiting areas
* Uncertain and unfair wait times
* Poor visibility into queue status
* Increased workload for hospital staff

Most existing digital queueing systems are *expensive, hardware-dependent, or operationally complex*, making them unsuitable for hospitals with limited infrastructure.

---

## 💡 Solution Overview

*PulseStack* replaces physical OPD queues with a *QR-based digital registration system* backed by *SMS notifications*.

Patients scan a QR code, register instantly, and receive a *token number via SMS*.
Hospital staff manage doctor-wise queues through a *secure web-based admin dashboard*.

No mobile app. No kiosks. No heavy infrastructure.

---

## 🎯 Target Users

* *Patients:* Walk-in OPD visitors (including non-smartphone users)
* *Hospital Staff:* Receptionists and nurses managing queues
* *OPD Administrators:* Supervising doctor-wise patient flow

---

## ✅ Value Proposition

* Reduced physical crowding in OPDs
* Transparent and fair queue progression
* Minimal setup and training
* Low operational cost
* Works in low-tech, low-bandwidth environments

---

## ✨ Core Features

* QR-based patient registration
* Automatic token generation
* SMS delivery of token numbers
* Doctor-wise queue separation
* Live queue visibility for admins
* Secure admin authentication
* Web-based dashboard (no app required)

---

## 📦 Scope & Boundaries

### ✅ In Scope (MVP)

* Walk-in registration via QR code
* SMS-based token notification
* Admin dashboard for queue control
* Multiple doctor / OPD queues
* Polling-based live queue updates

### ❌ Out of Scope (Intentional)

* Native mobile applications
* Online payments or billing
* Advanced analytics and reporting
* Full Hospital Management System (HMS) integration

> Scope is intentionally controlled to ensure *reliable delivery within a 4-week sprint*.

---

## 🛠️ Technology Stack (Sprint-Aligned)

### Frontend & Backend (Unified)

* *Next.js (App Router)*

  * UI rendering using Server and Client Components
  * Backend APIs using Route Handlers
  * Middleware for authentication and route protection
* *React* (via Next.js)
* *Tailwind CSS* for rapid and consistent UI styling

---

### Database Layer

* *PostgreSQL*

  * Structured storage for patients, tokens, doctors, and queues
* *Prisma*

  * Type-safe database access
  * Schema-based data modeling

---

### Caching Layer

* *Redis*

  * Temporary queue state caching
  * Reduced database load
  * Faster queue updates

---

### Authentication

* JWT-based admin authentication
* HTTP-only cookies
* Protected routes using Next.js Middleware

---

### Notifications

* SMS Gateway (free-tier or mocked for MVP)
* Retry handling for failed deliveries

---

### Containerization

* *Docker*

  * Ensures consistent behavior across environments
  * Simplifies local development and deployment

---

### Deployment & Cloud

* *Amazon Web Services* or
  *Microsoft Azure*
* CI/CD using *GitHub Actions*
* Environment-based configuration for secrets

---

## 🧩 System Architecture Overview


Next.js (UI + APIs)
   ↕
Prisma ORM
   ↕
PostgreSQL Database
   ↕
Redis Cache
   ↕
Docker Containers
   ↕
AWS / Azure Cloud


This architecture mirrors *real-world full-stack production systems*, not academic demos.

---

## 🚀 MVP Deliverables

By the end of the sprint, PulseStack delivers:

* QR-based patient onboarding
* Unique token generation per doctor
* SMS delivery of token numbers
* Admin dashboard to call next patient
* Doctor-wise queue handling
* Live queue updates

---

## ⏱️ Sprint Timeline (4 Weeks)

| Week   | Focus Area            | Deliverables                              |
| ------ | --------------------- | ----------------------------------------- |
| Week 1 | Planning & Design     | Requirements, architecture, DB schema     |
| Week 2 | Core Development      | Next.js APIs, dashboard UI                |
| Week 3 | Integration & Testing | End-to-end flows, error handling          |
| Week 4 | Deployment & Demo     | Feature freeze, deployment, documentation |

---

## ⚙️ Functional Requirements

* Patients register via QR code
* System generates unique tokens per doctor
* Tokens are delivered via SMS
* Admin can view and manage live queues
* Admin can call the next patient
* Secure authentication for admins

---

## 🔐 Non-Functional Requirements

* API response time under *300ms*
* Supports *100+ concurrent users*
* Conflict-free token handling
* Secure authentication and protected routes
* Simple and accessible UI

---

## 📊 Success Criteria

* Fully deployed application on cloud infrastructure
* Successful end-to-end demo
* All core user flows functional
* Reduced reliance on physical queues during testing

---


## 🔹 One-Line Summary

> *PulseStack is a QR and SMS-based digital OPD queue management system built with a modern Next.js full-stack architecture for low-infrastructure hospitals.*

=======
## 📊 Success Metrics

* Fully deployed and working MVP
* Successful end-to-end demo
* All core user flows functional
* Reduced dependency on physical queues during testing

---
