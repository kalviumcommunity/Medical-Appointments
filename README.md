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
