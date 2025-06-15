# 📝 ThoughtDrop - Personal Journal Web Application

## 🚀 Introduction
ThoughtDrop is a **full-stack journal application** that allows users to securely store their personal thoughts, memories, and experiences. With user authentication and rich text entries, it provides a private space for your daily reflections.

![Tech Stack](https://img.shields.io/badge/Full_Stack-React.js_+_Node.js_+_Supabase-blue)

---

## 🛠 Tech Stack

### Frontend
- ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
- ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
- ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
- ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### Backend
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

### Database & Authentication
- ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
- ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

---

## 📁 Project Structure

### Frontend (Client)
```
client/
├── public/
│ ├── favicon.ico                             # Application favicon
│ ├── index.html                              # Main HTML file
│ └── logo.png                                # Application logo
├── src/
│ ├── components/
│ │ ├── Auth/
│ │ │ ├── ForgotPassword.jsx                  # Password reset form
│ │ │ ├── Login.jsx                           # User login form
│ │ │ └── Signup.jsx                          # User registration form
│ │ ├── Home/
│ │ │ ├── AddJournal.jsx                      # Form to create new journal entries
│ │ │ ├── MyJournals.jsx                      # Displays all user journals
│ │ │ └── UserInfoCard.jsx                    # User profile information
│ │ ├── Footer.jsx                            # Application footer
│ │ └── Navbar.jsx                            # Application navigation bar
│ ├── context/
│ │ └── AuthContext.jsx                       # Authentication context provider
│ ├── hooks/
│ │ └── useAuth.js                            # Custom auth hook
│ ├── pages/
│ │ ├── ForgotPassword.jsx                    # Password reset page
│ │ ├── Home.jsx                              # Main application page
│ │ ├── Login.jsx                             # Login page
│ │ └── Signup.jsx                            # New USer Registration page
│ ├── utils/
│ │ └── api.js                                # API service for backend communication
│ ├── App.jsx                                 # Main application component
│ ├── index.css                               # Global styles
│ └── index.js                                # Application entry point
├── package-lock.json
├── package.json
├── tailwind.config.js                        # Tailwind CSS configuration
└── vercel.json                               # Vercel deployment configuration
```
### Backend (Server)
```
server/
├── config/
│ └── supabaseClient.js                       # Supabase client configuration
├── controllers/
│ ├── authController.js                       # Authentication logic
│ └── journalController.js                    # Journal CRUD operations
├── middlewares/
│ └── authMiddleware.js                       # Authentication middleware
├── routes/
│ ├── authRoutes.js                           # Authentication routes
│ └── journalRoutes.js                        # Journal routes
├── package-lock.json
├── package.json
├── server.js                                 # Server entry point
└── vercel.json                               # Vercel deployment configuration
```
---

## 📦 Dependencies

### Frontend (Client)
```json
"dependencies": {
  "@supabase/supabase-js": "^2.50.0",        # Supabase client library
  "axios": "^1.9.0",                         # HTTP client for API requests
  "formik": "^2.4.6",                        # Form handling library
  "framer-motion": "^12.18.1",               # Animation library
  "react": "^19.1.0",                        # React core library
  "react-dom": "^19.1.0",                    # React DOM rendering
  "react-hot-toast": "^2.5.2",               # Notification system
  "react-icons": "^4.12.0",                  # Icon library
  "react-router-dom": "^6.30.1",             # Routing library
  "yup": "^1.6.1"                           # Form validation
}
```

### Backend (Server)
```json
"dependencies": {
  "@supabase/supabase-js": "^2.49.5",        // Client library to interact with Supabase services.
  "bcryptjs": "^3.0.2",                      // Library to hash and compare passwords securely.
  "cors": "^2.8.5",                          // Middleware to enable Cross-Origin Resource Sharing.
  "dotenv": "^16.5.0",                       // Loads environment variables from a .env file.
  "express": "^5.1.0",                       // Minimal and flexible Node.js web application framework.
  "google-auth-library": "^9.15.1",          // Google API and OAuth 2.0 authentication library.
  "jsonwebtoken": "^9.0.2",                  // Creates and verifies JSON Web Tokens (JWTs).
  "serverless-http": "^3.2.0"                // Adapter to run Node.js frameworks (like Express) on serverless platforms.
}
```

## 🎯 Key Features

### 🔐 Authentication
- **Secure user registration** with email validation  
- **Password requirements** with real-time validation  
- **JWT-based authentication** for secure sessions  
- **Password reset** functionality  
- **Persistent sessions** with token storage  

### 📔 Journal Management
- **Create journal entries** with titles and rich content  
- **Image uploads** for visual journaling  
- **Edit existing entries** with version tracking  
- **Delete entries** with confirmation  
- **Organized view** of all journals  

### 👤 User Profile
- **Profile management** with personal details  
- **Secure password changes**  
- **Account deletion** with confirmation  
- **Responsive design** for all devices  

### 🎨 UI Features
- **Clean, modern interface** with Tailwind CSS  
- **Animations and transitions** with Framer Motion  
- **Responsive layout** for all screen sizes  
- **Interactive form validation**  
- **Toast notifications** for user feedback  

## 🔧 System Logic

### Authentication Flow
- Users register with email, password, and personal details  
- Passwords are hashed before storage  
- JWT tokens are issued upon successful login  
- All protected routes verify the token  
- Password reset generates secure token with expiration  

### Journal Management
- Journals are stored with user association  
- Images are uploaded to Supabase storage  
- CRUD operations are protected by user ownership  
- All changes are tracked with timestamps  
- Data is fetched efficiently with pagination support  

### Security Measures
- Password hashing with bcrypt  
- JWT token expiration  
- Protected routes middleware  
- CSRF protection  
- Input sanitization  

## 🎉 Conclusion
ThoughtDrop provides a secure, private space for personal journaling with all the features needed for meaningful reflection. The application combines robust backend security with a delightful frontend experience.


## 🌐 Check the Live App  
[Click here to view the app on Vercel!]()
