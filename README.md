# Hospital Management System (DocConnect)

A comprehensive full-stack Hospital Management System built with React.js, Node.js, Express.js, and MongoDB. This system provides a complete solution for managing hospital operations with role-based access for patients, doctors, and administrators.

## 🏥 Features

### 🔐 Authentication & Authorization
- **Multi-role Authentication**: Separate login portals for Patients, Doctors, and Administrators
- **JWT-based Security**: Secure token-based authentication
- **Password Reset**: Email-based password recovery system
- **Role-based Access Control**: Protected routes based on user roles

### 👥 Patient Management
- **Patient Registration**: Complete patient profile creation with medical history
- **Medical Records**: Comprehensive medical history tracking
- **Appointment Booking**: Schedule appointments with available doctors
- **Prescription Management**: View and track prescriptions
- **Billing & Payments**: View bills and payment history
- **Admission Management**: Hospital admission tracking
- **Emergency Contact**: Store emergency contact information
- **Insurance Details**: Manage insurance information

### 👨‍⚕️ Doctor Management
- **Doctor Profiles**: Complete doctor information with qualifications
- **Specialization Tracking**: Multiple medical specialties
- **Availability Management**: Set working hours and availability
- **Patient Management**: View and manage assigned patients
- **Appointment Management**: Schedule and manage appointments
- **Prescription Writing**: Create and manage prescriptions
- **Medical Records**: Access and update patient medical records
- **Admission Management**: Manage patient admissions

### 🏢 Administrative Features
- **Dashboard Analytics**: Comprehensive overview of hospital operations
- **Doctor Management**: Add, edit, and manage doctor profiles
- **Patient Management**: Complete patient database management
- **Bed Management**: Track bed availability and assignments
- **Inventory Management**: Medical supplies and equipment tracking
- **Billing System**: Complete billing and payment processing
- **Admission Management**: Hospital admission oversight
- **Reporting**: Generate various reports and analytics

### 📊 Core Modules

#### Appointment System
- Schedule appointments with doctors
- Appointment status tracking (Scheduled, Completed, Cancelled, No-Show)
- Appointment notes and documentation
- Real-time availability checking

#### Bed Management
- Bed availability tracking
- Different bed types (General, Semi-Private, Private, ICU, Emergency)
- Ward management
- Bed status monitoring (Available, Reserved, Occupied, Maintenance)

#### Medical Records
- Comprehensive patient medical history
- Prescription management

## 🛠️ Technology Stack

### Frontend
- **React.js** - User interface framework
- **React Router** - Client-side routing
- **Ant Design** - UI component library
- **Material-UI** - Additional UI components
- **Bootstrap** - CSS framework
- **React Icons** - Icon library
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email functionality
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling

### Development Tools
- **Nodemon** - Development server with auto-restart
- **Concurrently** - Run multiple commands simultaneously

## 📁 Project Structure

```
hospital_management/
├── backend/
│   ├── controllers/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── doctor.js
│   │   └── patient.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Admission.js
│   │   ├── Appointment.js
│   │   ├── Bed.js
│   │   ├── Billing.js
│   │   ├── Doctor.js
│   │   ├── Inventory.js
│   │   ├── MedicalRecord.js
│   │   ├── Patient.js
│   │   ├── Prescription.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── doctor.js
│   │   ├── doctors.js
│   │   └── patient.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   │   ├── background.jpg
│   │   │   ├── doctors/
│   │   │   └── image.jpg
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── SocketContext.js
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.css
│   │   │   └── DashboardLayout.js
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── doctor/
│   │   │   ├── patient/
│   │   │   ├── LandingPage.css
│   │   │   └── LandingPage.js
│   │   ├── App.js
│   │   ├── config.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
├── package.json
├── server.js
└── vite.config.js
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd hospital_management
```

### Step 2: Install Dependencies

#### Option A: Install All Dependencies (Recommended)
```bash
npm install
```

#### Option B: Install Separately
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Environment Setup

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=""
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=""
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Step 4: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Start MongoDB service
mongod
```

### Step 5: Run the Application

#### Development Mode (Recommended)
```bash
# Run both frontend and backend concurrently
npm run dev
```

#### Separate Mode
```bash
# Terminal 1: Start backend server
npm run server

# Terminal 2: Start frontend development server
npm run client
```

### Step 6: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👥 User Roles & Access

### Patient Access (`/patient`)
- Dashboard with personal health overview
- Appointment booking and management
- Medical records viewing
- Prescription history
- Billing and payment tracking
- Admission status

### Doctor Access (`/doctor`)
- Patient management dashboard
- Appointment scheduling and management
- Prescription writing
- Medical records access
- Patient admission management

### Admin Access (`/admin`)
- Complete hospital management dashboard
- Doctor and patient database management
- Bed allocation and management
- Inventory tracking
- Billing system administration
- Admission oversight

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Run both frontend and backend
npm run server       # Run backend only
npm run client       # Run frontend only

# Installation
npm run install      # Install all dependencies
npm run install-server # Install backend dependencies
npm run install-client # Install frontend dependencies

# Production
npm start           # Start production server
npm run build       # Build frontend for production
```

## 📊 Database Models

### Core Models
- **User**: Base user model with authentication
- **Patient**: Patient-specific information and medical history
- **Doctor**: Doctor profiles with specializations
- **Admin**: Administrative user management

### Operational Models
- **Appointment**: Patient-doctor appointment scheduling
- **MedicalRecord**: Patient medical history and records
- **Prescription**: Doctor prescriptions and medications
- **Billing**: Payment and billing management
- **Admission**: Hospital admission tracking
- **Bed**: Bed availability and management
- **Inventory**: Medical supplies and equipment

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Role-based Access**: Protected routes and features
- **Input Validation**: Server-side data validation
- **CORS Protection**: Cross-origin request handling
- **Environment Variables**: Secure configuration management

## 📱 Features Overview

### Patient Features
- ✅ User registration and authentication
- ✅ Profile management with medical history
- ✅ Appointment booking with doctors
- ✅ Medical records viewing
- ✅ Prescription tracking
- ✅ Billing and payment history
- ✅ Hospital admission tracking

### Doctor Features
- ✅ Professional profile management
- ✅ Patient appointment management
- ✅ Medical record access and updates
- ✅ Prescription writing and management
- ✅ Patient admission management
- ✅ Availability scheduling

### Admin Features
- ✅ Comprehensive dashboard analytics
- ✅ Doctor and patient database management
- ✅ Bed allocation and ward management
- ✅ Inventory tracking and management
- ✅ Billing system administration
- ✅ Hospital admission oversight
- ✅ Reporting and analytics

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common issues

## 🔄 Updates

Stay updated with the latest features and improvements by regularly pulling from the main branch:
```bash
git pull origin main
npm install
```

---

**Note**: This is a comprehensive Hospital Management System designed for educational and demonstration purposes. For production use, ensure proper security measures, data validation, and compliance with healthcare regulations. 
