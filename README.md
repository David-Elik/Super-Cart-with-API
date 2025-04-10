Super Cart with API
A modern e-commerce application built with React, Node.js, and MongoDB, featuring a responsive design and secure authentication system.

🚀 Features
User authentication (signup/login)
Product browsing and search
Shopping cart functionality
Responsive design with Tailwind CSS
Secure API endpoints
MongoDB database integration


🛠️ Tech Stack

Frontend - 
React 19
Vite
Tailwind CSS 4
React Router DOM
Axios
React Icons

Backend - 
Node.js
Express.js
MongoDB with Mongoose
JWT Authentication
Bcrypt for password hashing
CORS enabled
Support for Environment Variables


📋 Prerequisites
Before running this project, ensure you have the following installed:
Node.js (v18 or higher)
MongoDB
npm or yarn package manager


🔧 Installation
1. Clone the Repository
Clone the repository and navigate to the project directory:

<pre>git clone <repository-url>
cd Super-Cart-with-API</pre>

2. Install Frontend Dependencies
Go to the frontend directory and install the required dependencies:

<pre>cd frontend
npm install</pre>

3. Install Backend Dependencies
Go to the backend directory and install the required dependencies:

<pre>cd backend
npm install</pre>

4. Set Up Environment Variables
Create a .env file in the backend directory and add the following variables:

<pre>PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret</pre>

Make sure to replace your_mongodb_connection_string and your_jwt_secret with your actual MongoDB URI and JWT secret.


🚀 Running the Application
1. Start the Backend Server
In the backend directory, start the backend server:

<pre>cd backend
npm run dev</pre>

This will start the server on http://localhost:5000.

2. Start the Frontend Development Server
In the frontend directory, start the frontend development server:

<pre>cd frontend
npm run dev</pre>

This will open the application in your browser at http://localhost:5173.


📁 Project Structure
The project is organized into two main directories: frontend and backend.
<pre>
Super-Cart-with-API/
├── frontend/             # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   ├── api/          # Custom React hooks
│   │   └── App.jsx       # Main application component
│   └── package.json
│
├── backend/             # Node.js backend application
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Entry point
│
└── README.md
</pre>

🔒 Environment Variables
Backend (.env)
PORT: Server port number (default: 5000)
MONGODB_URI: MongoDB connection string (replace with your own)
JWT_SECRET: Secret key for JWT token generation (use a strong secret)


🛠️ Development
Frontend runs on port 5173
Backend runs on port 5000
ESLint is used for code linting
Hot reloading is enabled for both frontend and backend


📝 Available Scripts
Frontend - 
npm run dev: Start the frontend development server
npm run build: Build the frontend for production
npm run preview: Preview the production build
npm run lint: Run ESLint to check code quality

Backend - 
npm run dev: Start the backend development server with nodemon
npm start: Start the backend production server


🤝 Contributing
Fork the repository


Create your feature branch: <pre>git checkout -b feature/AmazingFeature</pre>

Commit your changes: <pre>git commit -m 'Add some AmazingFeature'</pre>

Push to your branch: <pre>git push origin feature/AmazingFeature</pre>

Open a Pull Request

📄 License
This project is licensed under the ISC License.

