# How to Run the Mini E-Commerce Application

Step-by-step instructions to run the backend and frontend locally.

---

## Prerequisites

Install the following (or compatible versions):

| Requirement | Version |
|-------------|---------|
| Python      | 3.13    |
| Node.js     | 20+ or 25.x |
| MySQL       | 9.x     |

- **MySQL** must be running and you must be able to create a database and log in (e.g. as `root` or another user).

---

## Step 1: Create the database

1. Open MySQL (command line, MySQL Workbench, or any client).
2. Create a database named `ecommerce`:

```sql
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Step 2: Configure the backend (database connection)

Either set environment variables **or** edit `backend/config/settings.py` (around the `DATABASES` block).

### Option A: Environment variables (Windows PowerShell)

```powershell
$env:MYSQL_DATABASE = "ecommerce"
$env:MYSQL_USER     = "root"
$env:MYSQL_PASSWORD = "your_mysql_password"
$env:MYSQL_HOST     = "127.0.0.1"
$env:MYSQL_PORT     = "3306"
```

Use your actual MySQL password. Run these in the same terminal where you will start the backend.

### Option B: Edit `backend/config/settings.py`

Update the `DATABASES['default']` section with your database name, user, and password.

---

## Step 3: Backend setup and run

1. Open a terminal and go to the project folder, then into `backend`:

```powershell
cd c:\Users\HP\Desktop\ECommerce_website\backend
```

2. Create a virtual environment:

```powershell
python -m venv venv
```

3. Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

If you get an execution policy error, run once (in the same window or as needed):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run the activate command again.

4. Install dependencies:

```powershell
pip install -r requirements.txt
```

5. Create and run migrations (first time only):

```powershell
python manage.py makemigrations api
python manage.py migrate
```

6. Load sample products (first time only):

```powershell
python manage.py seed_products
```

7. Start the backend server:

```powershell
python manage.py runserver
```

Leave this terminal open. The API will be at **http://127.0.0.1:8000**.

---

## Step 4: Frontend setup and run

1. Open a **new** terminal and go to the frontend folder:

```powershell
cd c:\Users\HP\Desktop\ECommerce_website\frontend
```

2. Install dependencies:

```powershell
npm install
```

If you see an error like *“running scripts is disabled on this system”*:

- Use this instead: `npm.cmd install`
- Or fix execution policy (see Step 3, activation note) and try `npm install` again.

3. Start the frontend dev server:

```powershell
npm run dev
```

If `npm` is blocked, use:

```powershell
npm.cmd run dev
```

Leave this terminal open. The app will be at **http://localhost:5173**.

---

## Step 5: Use the application

1. In your browser, open **http://localhost:5173**.
2. **Login**
   - **Password:** Use “Login” with username/password, or “Register” to create an account.
   - **OTP:** Switch to the “OTP” tab → enter phone number → “Send OTP” → check the **backend terminal** for the 6-digit code → enter it and “Verify”.
3. **Catalog:** View products and click “Add to cart” (when logged in).
4. **Cart:** Open “Cart” in the nav, remove items if needed, then “Proceed to order summary”.
5. **Orders:** Open “Orders” to see your order history (no payment; summary only).

---

## Quick reference

| What        | URL or command |
|------------|-----------------|
| Frontend   | http://localhost:5173 |
| Backend API| http://127.0.0.1:8000/api/ |
| Backend admin | http://127.0.0.1:8000/admin/ (after creating a superuser with `python manage.py createsuperuser`) |

**Backend must be running** before using the frontend; the frontend proxies `/api` to the backend.

---

## Troubleshooting

| Issue | What to do |
|-------|-------------|
| `npm` script error (PowerShell) | Use `npm.cmd` instead of `npm`, or set execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| MySQL connection error | Check MySQL is running, database exists, and `MYSQL_*` (or `settings.py`) match your MySQL user and password. |
| Port 8000 or 5173 in use | Stop the other app using that port, or change the port (e.g. `python manage.py runserver 8001` or in `frontend/vite.config.js` for 5173). |
| No products on catalog | Run `python manage.py seed_products` from the `backend` folder with the venv activated. |
| OTP not received | OTP is **not** sent by email/SMS. Check the **backend terminal** where `runserver` is running; the code is printed there. |
