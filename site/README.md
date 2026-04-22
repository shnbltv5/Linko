# 🎓 Online Learning Platform — EduConnect

A modern web application for creating and taking online courses, built using **Django + Angular**.

---

## 📌 Overview

This platform allows users to register as either:

- 👨‍🎓 **Student** — view, enroll in, and manage courses.
- 👩‍🏫 **Teacher** — create, edit, and delete their own courses.
- 🛠 **Administrator** — manage users, courses, categories, and enrollments via Django Admin.

The application is split into two parts:

- **Backend**: Django + Django REST Framework (REST API)
- **Frontend**: Angular (Standalone Components API)

---

## 👥 Team Members

- **Orazymbetov Zhantore**
- **Nurtaza Ayaulym**
- **Kudryakov Andrey**

---

## 🚀 Key Features

- 🆕 User registration with role selection (Student or Teacher)
- 🔐 JWT-based authentication (Access & Refresh tokens)
- 📚 Browse and view course details
- ✅ Enroll / 🚫 Unenroll in courses
- 🎓 "My Courses" section for students
- 📝 Course creation/editing/deletion by teachers
- 🔐 Frontend route protection based on role and login
- 📦 Auto JWT injection via HTTP Interceptor
- ⚙️ Full management via Django Admin

---

## 🛠 Technologies Used

### 🔧 Backend
- Python 3.x
- Django + Django REST Framework
- djangorestframework-simplejwt
- django-cors-headers
- SQLite (default database)
- pytils / pytranslit (for slug generation)

### 🎨 Frontend
- TypeScript
- Angular (Standalone Components)
- Angular CLI
- RxJS
- Bootstrap 5
- ngx-toastr (notifications)
- jwt-decode (token decoding)

---

## 🧩 Setup & Installation

### 📋 Prerequisites

- Git
- Python 3.8+
- Node.js (LTS version) + npm
- Angular CLI:
  ```bash
  npm install -g @angular/cli

🧱 Installation Steps
1️⃣ Clone the Repository
git clone https://github.com/Zhantoresh/WebDev-project---EduConnect.git
cd WebDev-project---EduConnect

2️⃣ Backend Setup (back/ folder)
cd back
# Create a virtual environment
python -m venv venv

# Activate the environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# (Optional) Create a superuser
python manage.py createsuperuser

3️⃣ Frontend Setup (front/ folder)
cd ../front
npm install

▶️ Running the Application
🖥 Start Backend
cd back
# Activate environment if not active
python manage.py runserver
Visit: http://127.0.0.1:8000/

🌐 Start Frontend
Open a new terminal:
cd front
ng serve 
Visit: http://localhost:4200/

🔐 Django Admin
Access the admin dashboard:

🔗 http://127.0.0.1:8000/admin/
Use credentials of the created superuser.

📫 Contact
Feel free to reach out to any of the team members or open an issue on the repository if you have any questions or suggestions.
