# 🏥 Medical Appointments
  

### Lightweight Digital OPD Queue Management System
  

Medical Appointments is a Next.js (TypeScript) based project aimed at building a lightweight digital OPD queue management system for hospitals.
  

This repository currently contains the **project initialization and base folder structure** for Sprint 1.
  

---


## 📁 Folder Structure

  
src/

├── app/ # Routes and pages using Next.js App Router

│ ├── page.tsx # Home page

│ ├── layout.tsx # Root layout

│ └── globals.css # Global styles

│

├── components/ # Reusable UI components

│ └── Header.tsx

│

├── lib/ # Utility functions and helpers

│ └── constants.ts

  
---
  

## 📂 Folder Explanation


-  **app/**

Contains application routes and layouts using Next.js App Router.

  
-  **components/**

Stores reusable UI components for better maintainability.

  
-  **lib/**

Contains shared utilities and constants used across the app.

  
This structure ensures clarity and scalability for future sprints.

  
---
  

## ⚙️ Setup Instructions


### Install dependencies

```bash

npm  install

```

=======


## 🖥️ Local Development Screenshot

![Local App Running](./image.png)

---

## 🧪 TypeScript & ESLint Configuration

### Strict TypeScript
Strict TypeScript mode is enabled to catch potential bugs early by enforcing strong typing, preventing unused variables, and avoiding implicit `any` types. This helps reduce runtime errors and improves overall code reliability.

### ESLint & Prettier
ESLint is configured to enforce consistent coding standards such as avoiding unnecessary console logs and maintaining consistent syntax.  
Prettier ensures uniform code formatting across the project for better readability and maintainability.

### Pre-Commit Hooks
Husky and lint-staged are configured to run ESLint and Prettier automatically before every commit. This ensures that only clean, formatted, and lint-free code is committed to the repository, improving team collaboration and code quality.

---


## 🔐 Environment Variable Management

This project uses environment variables to manage configuration and sensitive information securely.

### Environment Files
- **.env.local**  
  Stores actual secret values such as database URLs and API keys.  
  This file is ignored by Git and is never committed.

- **.env.example**  
  Acts as a template listing all required environment variables with placeholder values.  
  This helps other developers replicate the setup safely.

### Server-side vs Client-side Variables
- Variables without a prefix (e.g., `DATABASE_URL`) are **server-side only**.
- Variables prefixed with `NEXT_PUBLIC_` are safe to use on the client side.


### Security Practices
- Secrets are never exposed to the browser.
- `.env.local` is protected using `.gitignore`.
- Only non-sensitive configuration is shared via `.env.example`.
=======
---


## 🐳 Docker Setup

This project is containerized using Docker and Docker Compose.  

It includes three services:  

## Next.js app, 
## PostgreSQL database,
## Redis cache.  

The Dockerfile builds the app, installs dependencies, and runs `npm start`.  

`docker-compose.yml` sets up all services, networks, and persistent volumes.  

Run `docker-compose up --build` to start all containers locally.  

The app is then accessible at http://localhost:3000, with database and cache ready to use.

---
