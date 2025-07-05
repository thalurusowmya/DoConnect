# Hospital Management System (HMS)

A comprehensive Hospital Management System built with React.js, Node.js, Express.js, and MongoDB.

## Project Structure

\`\`\`
hospital-management-system/
├── frontend/             # React frontend
│   ├── public/           # Static files
│   ├── src/              # React source code
│   ├── .env              # Frontend environment variables
│   └── package.json      # Frontend dependencies
├── backend/              # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── .env              # Backend environment variables
│   └── package.json      # Backend dependencies
├── package.json          # Root package.json for scripts
└── README.md             # Project documentation
\`\`\`

## Features

- Patient Portal: Appointments, medical records, prescriptions, billing, admission
- Doctor Portal: Appointments, patient management, prescriptions
- Admin Portal: Doctor management, patient management, billing, inventory, bed management
- Authentication & Authorization
- Role-based access control

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Set up environment variables:
   - Create `.env` file in the `frontend` directory
   - Create `.env` file in the `backend` directory

4. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

## Environment Variables

### Frontend (.env)
\`\`\`
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

### Backend (.env)
\`\`\`
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hms
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
\`\`\`

## License

MIT
