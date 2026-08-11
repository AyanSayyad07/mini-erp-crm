# Loop Distribution.co (Enterprise ERP & CRM)

![Loop Distribution.co](frontend/public/logo.svg)

Loop Distribution.co is a modern, premium, and highly dynamic Enterprise Resource Planning (ERP) and Customer Relationship Management (CRM) application. It is designed to handle retail, wholesale, and distribution operations with an unparalleled user experience.

## 🚀 Key Features

*   **Global Command Palette:** Press `Ctrl + K` (or `Cmd + K`) anywhere to instantly search, navigate pages, and execute commands without touching the mouse.
*   **Dynamic Kanban Board:** Manage Sales Challans using a beautiful drag-and-drop board. Move orders from *Draft* to *Confirmed*, *Delivered*, and *Paid*.
*   **Automated PDF Invoices:** Generate beautifully formatted, downloadable PDF invoices for any Sales Challan with a single click.
*   **CSV Data Export:** Export your complete Customers and Products databases into Excel-ready `.csv` files.
*   **Role-Based Access Control (RBAC):** Secure user management supporting distinct roles (`Admin`, `Sales`, `Warehouse`, `Accounts`), determining exactly what data a user can view or mutate.
*   **Premium Glassmorphic UI:** A meticulously crafted, responsive interface featuring dynamic Dark/Light modes, pulsing skeleton loaders, and micro-interactions (including celebratory confetti!).
*   **In-Memory Mock Database:** Powered by `pg-mem` to simulate a full PostgreSQL environment entirely in memory, making it incredibly fast to boot up and test.

## 🛠️ Technology Stack

*   **Frontend:** React 18, TypeScript, Vite, Framer Motion, `@hello-pangea/dnd`, `react-hot-toast`, `jspdf`, `lucide-react`.
*   **Backend:** Node.js, Express, TypeScript, `pg` (PostgreSQL), `pg-mem`, `bcryptjs`, `jsonwebtoken`.

## 📦 Local Setup Instructions

This project is separated into a `frontend` and a `backend`. Follow the steps below to run both servers concurrently.

### 1. Clone the repository
```bash
git clone https://github.com/AyanSayyad07/mini-erp-crm.git
cd mini-erp-crm
```

### 2. Start the Backend
The backend utilizes an in-memory PostgreSQL database (`pg-mem`), which is automatically seeded with mock data and test users on startup.
```bash
cd backend
npm install
npm run dev
```
*(The backend runs on `http://localhost:5000`)*

### 3. Start the Frontend
Open a new terminal window/tab:
```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs on `http://localhost:5174`)*

## 🔐 Test Accounts

Use the following accounts to test the Role-Based Access Control (RBAC) features. All accounts use the password: `password123`

| Role | Email | Permissions |
| :--- | :--- | :--- |
| **Admin** | `admin@test.com` | Full access. Can create users, edit products, manage all challans. |
| **Sales** | `sales@test.com` | Can manage Customers and create Sales Challans. Cannot edit products. |
| **Warehouse**| `warehouse@test.com`| Can view and edit Products/Inventory. Cannot manage customers. |
| **Accounts** | `accounts@test.com` | Can view Sales Challans and export data. |

## 🌟 Acknowledgements
Built by Ayan Sayyad.
