**Project Name:** Vehicle Rental System API

**Live URL:**  https://vehicle-rental-system-beta-teal.vercel.app/

---

**Project Overview**

This project is a backend REST API for a Vehicle Rental System. It supports vehicle management, user management, booking operations, and secure role-based authentication. The system enforces proper business rules such as vehicle availability tracking, booking cancellation rules, and automatic booking returns.

---

**Key Features**

* User authentication using JWT
* Role-based access control (Admin and Customer)
* Vehicle management with availability status
* Booking creation with automatic price calculation
* Customers can cancel bookings before the rental start date
* Admins can mark bookings as returned
* System automatically marks bookings as returned when the rental period ends
* Prevent deletion of users or vehicles with active bookings

---

**Technology Stack**

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* JWT (jsonwebtoken)
* bcrypt

---

**Setup & Usage Instructions**

1. Clone the repository and install dependencies.
2. Configure environment variables for database connection and JWT secret.
3. Start the server.
4. For creating an admin, at first signup as a user.
5. Then go to your database and to `users' table and update the role to admin.
6. When you log into the system, a json token will be returned, which can be used to gain access to different parts of the api system.

> 📖 **For more details, see the [Project Detail Information](https://github.com/Apollo-Level2-Web-Dev/B6A2/blob/main/README.md)**

> 📖 **For detailed request/response specifications, see the [API Reference](https://github.com/Apollo-Level2-Web-Dev/B6A2/blob/main/API_REFERENCE.md)**

---




