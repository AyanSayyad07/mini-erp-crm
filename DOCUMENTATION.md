# Loop Distribution.co - Official Project Documentation

## 1. Project Overview
**Loop Distribution.co** (formerly Mini ERP/CRM) is a modern, full-stack Enterprise Resource Planning and Customer Relationship Management web application. It is designed to manage users, customers, product inventory, and sales orders (challans) through a highly interactive, premium user interface.

---

## 2. System Architecture

The application follows a decoupled client-server architecture.

### Frontend (Client)
*   **Framework:** React 18 with Vite
*   **Language:** TypeScript
*   **Routing:** React Router v6
*   **State Management:** React Hooks (`useState`, `useEffect`) and Context API
*   **Styling:** Custom CSS with Glassmorphism and CSS Variables for dynamic Dark/Light theming
*   **Key Libraries:**
    *   `lucide-react`: SVG Icons
    *   `recharts`: Dashboard Analytics Charts
    *   `@hello-pangea/dnd`: Drag-and-Drop Kanban Board
    *   `react-hot-toast`: Toast notifications
    *   `jspdf` & `jspdf-autotable`: Client-side PDF generation
    *   `react-confetti`: Micro-interactions

### Backend (Server)
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Database:** `pg-mem` (An in-memory PostgreSQL instance used for rapid prototyping and deployment without a dedicated database server)
*   **Authentication:** JSON Web Tokens (JWT) and `bcryptjs` for password hashing

---

## 3. Database Schema

The system uses a relational PostgreSQL schema (simulated via `pg-mem`).

1.  **Users:** `id`, `email`, `password_hash`, `role` (Admin, Sales, Warehouse, Accounts)
2.  **Customers:** `id`, `name`, `mobile`, `email`, `business_name`, `customer_type`, `status`
3.  **Products:** `id`, `name`, `sku`, `category`, `unit_price`, `current_stock`
4.  **Challans (Orders):** `id`, `challan_number`, `customer_id`, `total_quantity`, `status`, `created_by`
5.  **Challan Items:** `id`, `challan_id`, `product_id`, `product_name_snapshot`, `unit_price_snapshot`, `quantity`

---

## 4. REST API Endpoints

The backend exposes a RESTful API under the `http://localhost:5000/` namespace. All endpoints (except login) require a Bearer token in the `Authorization` header.

### Authentication
*   `POST /auth/login` - Authenticates a user and returns a JWT.

### Customers
*   `GET /customers` - Fetch all customers (supports search queries)
*   `POST /customers` - Create a new customer
*   `PUT /customers/:id` - Update a customer
*   `DELETE /customers/:id` - Delete a customer

### Products
*   `GET /products` - Fetch all products
*   `POST /products` - Add a new product
*   `PUT /products/:id` - Update product details
*   `DELETE /products/:id` - Delete a product

### Sales Challans
*   `GET /challans` - Fetch all challans with their associated items
*   `POST /challans` - Create a new challan and deduct product inventory
*   `PUT /challans/:id/status` - Update the status of a challan (Draft, Confirmed, Delivered, Paid)
*   `DELETE /challans/:id` - Delete a challan and restore product inventory

---

## 5. Core Features & UX

### Role-Based Access Control (RBAC)
The application dynamically adjusts the UI based on the logged-in user's role:
*   **Admin:** Full read/write access everywhere.
*   **Sales:** Can manage customers and create challans, but cannot edit products.
*   **Warehouse:** Can manage product inventory, but cannot see customer details.
*   **Accounts:** Read-only access to sales and analytics.

### Dynamic UX Capabilities
*   **Command Palette (`Cmd/Ctrl + K`):** A global search modal allowing users to instantly navigate to any route or execute system commands (like toggling dark mode).
*   **Skeleton Loaders:** Replaces native browser loading spinners with pulsing skeleton blocks that mimic the shape of the data table, enhancing perceived performance.
*   **Drag-and-Drop Kanban:** The Sales Challan page offers a "Board View" where users can physically drag orders across columns to update their status via the API.
*   **Micro-interactions:** Actions like moving an order to "Paid" trigger celebratory Confetti animations to boost user engagement.

### Export & Reporting
*   **PDF Generation:** Users can click "Download PDF" on any Sales Challan to generate a formatted invoice containing their company details, customer details, and an itemized receipt.
*   **CSV Export:** Datagrids (like Customers and Products) feature an "Export CSV" button to download raw data for Excel processing.
