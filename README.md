# User Management System

This project is a simple user management system developed as a case study for Usersdot.

## Technologies Used

- **Frontend:**
    - Vite
    - React
    - TypeScript
    - Ant Design
    - React Router
    - React Hook Form
    - Zod
    - Tanstack Query

- **Backend:**
    - Nest.js
    - TypeScript

- **Database:**
    - PostgreSQL

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended)
- PostgreSQL

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ksergenozel/usersdot-case-study.git
```

### 2. Backend Setup

1. Navigate to the server directory:

```bash
   cd usersdot-case-study/server
   ```

2. Install the dependencies:

  ```bash
   npm install
  ```

3. Set up the environment variables:

    - Copy the `.env.example` file to `.env`:

  ```bash
     cp .env.example .env
  ```

- Fill in the required values in the `.env` file (e.g., database connection details).

4. Start the backend server:

  ```bash
   npm run start:dev
  ```

This will start the backend server on `http://localhost:3000`.

### 3. Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd ../client
   ```

2. Install the dependencies:

  ```bash
   npm install
  ```

3. Set up the environment variables:

    - Copy the `.env.example` file to `.env`:

    ```bash
     cp .env.example .env
    ```

    - Fill in the required values in the `.env` file (e.g., API URL).

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

   This will start the frontend on `http://localhost:5173`.

### 4. Usage

- **View the user list:** Navigate to `http://localhost:5173` to view the list of users.
- **Add a new user:** Click the "Add New User" button to add a new user.
- **Edit an existing user:** Click the edit icon next to a user to update their information.
- **Delete a user:** Click the delete icon next to a user to remove them.

## Notes

- Ensure that both the backend and frontend servers are running so the application functions properly.
- PostgreSQL must be running locally, and the database connection details must be correctly set in the `.env` files.

---

This README provides all the necessary steps to get the project up and running on your local machine.
