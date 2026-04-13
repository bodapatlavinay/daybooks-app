# 🚀 DayBooks – Shop Ledger App

DayBooks is a full-stack web application designed for small shop owners to easily track daily income, expenses, and profits in real time.

🔗 Live App: https://daybooks-app.vercel.app/

---

## ✨ Features

- 🔐 Secure authentication (Signup/Login)
- 📧 Email verification flow (Supabase Auth)
- 🏪 Shop setup and onboarding
- 💰 Add & manage income entries
- 💸 Track expenses with categories
- 📊 Real-time profit dashboard
- 👥 Partner management with equity tracking
- 🛠 Service tracking (custom shop services)
- ⚡ Fast and responsive UI

---

## 🧠 Problem Solved

Many small shop owners still rely on manual notebooks or spreadsheets to track daily business transactions.  
DayBooks provides a **simple, digital, and real-time solution** to manage shop finances efficiently.

---

## 🛠 Tech Stack

**Frontend**
- React (Vite)
- JavaScript (ES6+)
- CSS

**Backend / Services**
- Supabase (Auth + PostgreSQL)
- REST APIs

**Deployment**
- Vercel

---

## 🔐 Authentication Flow

- User signs up with email & password
- Verification email is sent
- User must confirm email before accessing the app
- Session is refreshed after verification
- Protected routes ensure secure access

---




# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
