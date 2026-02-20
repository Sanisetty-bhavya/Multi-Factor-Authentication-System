 # Multi-Factor Authentication System
 
 Full-stack multi-factor authentication (MFA) system using email OTP, mobile OTP (via Firebase), and basic KYC data collection. The app is split into a React client and a Node/Express API backed by MongoDB.
 
 ## Features
 
 - User registration with email and password
 - Secure password storage with hashing
 - Email-based OTP login
 - Firebase phone number verification with SMS OTP
 - JSON Web Token (JWT) based session token
 - KYC form to collect user profile details
 - MongoDB persistence for users, OTPs, and KYC records
 
 ## Tech Stack
 
 - Frontend: React, React Router, React Bootstrap, React Toastify, Tailwind CSS, axios
 - Phone OTP: Firebase Authentication (phone auth + reCAPTCHA)
 - Backend: Node.js, Express, Nodemailer, bcrypt, JWT, Mongoose
 - Database: MongoDB (Atlas or self-hosted)
 
 ## Project Structure
 
 ```text
 Multi-Factor Authentication System/
 ├─ client/                # React SPA
 │  ├─ public/
 │  └─ src/
 │     ├─ components/
 │     ├─ pages/           # Login, Register, OTP, Mobile, Dashboard, Error
 │     ├─ services/        # API helpers and backend URL
 │     └─ styles/
 ├─ server/                # Node/Express API
 │  ├─ DB/                 # Mongo connection
 │  ├─ Routes/             # Express routers
 │  ├─ controllers/        # Auth and KYC controllers
 │  └─ models/             # Mongoose schemas
 ├─ package.json           # Root package (firebase dependency)
 └─ README.md
 ```
 
 ## Prerequisites
 
 - Node.js and npm installed
 - MongoDB connection string (e.g. MongoDB Atlas)
 - Gmail (or compatible SMTP) account for sending OTP emails
 - Firebase project configured for:
   - Web app
   - Phone Authentication enabled
   - reCAPTCHA configured for web
 
 ## Backend Setup (server)
 
 1. Install dependencies:
 
    ```bash
    cd server
    npm install
    ```
 
 2. Configure environment variables in `server/.env`:
 
    ```env
    DATABASE=your_mongodb_connection_string
    EMAIL=youremail@example.com
    PASSWORD=your_email_app_password
    ```
 
    - `DATABASE` is used in [conn.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/server/DB/conn.js#L1-L9) to connect Mongoose.
    - `EMAIL` and `PASSWORD` are used by Nodemailer in [userControllers.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/server/controllers/userControllers.js#L8-L15) to send OTP emails.
    - Do not commit actual secrets to version control.
 
 3. Start the API server:
 
    ```bash
    cd server
    node app.js
    ```
 
    The API listens on `http://localhost:4002` by default (see [app.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/server/app.js#L1-L19)).
 
 ## Frontend Setup (client)
 
 1. Install dependencies:
 
    ```bash
    cd client
    npm install
    ```
 
 2. Configure Firebase in `client/src/pages/firebase.config.js`:
 
    ```js
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```
 
    - The exported `auth` instance is used by the Mobile OTP page in [Mobile.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/client/src/pages/Mobile.js#L1-L150).
 
 3. Ensure the backend URL is correct in `client/src/services/helper.js`:
 
    ```js
    export const BACKEND_URL = "http://localhost:4002";
    ```
 
 4. Start the React dev server:
 
    ```bash
    cd client
    npm start
    ```
 
    The client runs on `http://localhost:3000` by default.
 
 ## Authentication Flow
 
 ### 1. Registration
 
 - Page: [Register.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/client/src/pages/Register.js#L1-L87)
 - API: `POST /user/register`
 - Data: `fname`, `email`, `password`
 - Behavior:
   - Validates fields (non-empty, email format, password length).
   - Calls `registerfunction` from [Apis.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/client/src/services/Apis.js#L1-L21), which sends the request to the backend.
   - Backend controller: `userregister` in [userControllers.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/server/controllers/userControllers.js#L18-L43).
   - Server checks for existing user and stores hashed password via Mongoose pre-save hook in [userSchemas.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/server/models/userSchemas.js#L1-L68).
 
 ### 2. Email + Password Login (OTP request)
 
 - Page: [Login.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/client/src/pages/Login.js#L1-L75)
 - API: `POST /user/sendotp`
 - Data: `email`, `password`
 - Behavior:
   - Validates email and password locally.
   - Calls `sentOtpFunction` in [Apis.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/client/src/services/Apis.js#L1-L21).
   - Backend controller: `userOtpSend` in [userControllers.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/server/controllers/userControllers.js#L49-L101).
   - Server:
     - Looks up user by email.
     - Verifies password with bcrypt.
     - Generates a 6-digit OTP and stores it in the `userotps` collection ([userOtp.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/server/models/userOtp.js#L1-L26)).
     - Sends the OTP to the user's email using Nodemailer.
 
 ### 3. Email OTP Verification
 
 - Page: [Otp.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/client/src/pages/Otp.js#L1-L61)
 - API: `POST /user/login`
 - Data: `email` (from navigation state), `otp`
 - Behavior:
   - Validates OTP format and length.
   - Calls `userVerify` in [Apis.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/client/src/services/Apis.js#L1-L21).
   - Backend controller: `userLogin` in [userControllers.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/server/controllers/userControllers.js#L103-L126).
   - Server:
     - Fetches stored OTP for the email.
     - Compares with the provided OTP.
     - On success, generates a JWT via `generateAuthtoken` method on the user model and returns it to the client.
   - Client:
     - Stores the JWT in `localStorage` under `userdbtoken`.
     - Shows success toast.
     - Navigates to the mobile OTP page after a short delay.
 
 ### 4. Mobile OTP Verification (Firebase)
 
 - Page: [Mobile.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/client/src/pages/Mobile.js#L1-L150)
 - Behavior:
   - User enters their phone number using `react-phone-input-2`.
   - On "Send code via SMS":
     - Creates an invisible reCAPTCHA instance.
     - Calls `signInWithPhoneNumber` using Firebase Auth to send an SMS OTP.
   - On "Verify OTP":
     - Uses `confirmationResult.confirm(otp)` to verify the OTP.
     - On success, sets the `user` state and displays a success message.
     - Navigates to `/dashboard` after a short delay.
 
 ## KYC Flow
 
 - Page: [Dashboard.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/client/src/pages/Dashboard.js#L1-L354)
 - Client:
   - Presents a form for `fname`, `email`, `dob`, `gender`, `nationality`, and `address`.
   - Validates required fields.
   - Calls `kycRegister` from [Apis.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/client/src/services/Apis.js#L1-L21), which posts to `${BACKEND_URL}/dashboard`.
 - Server:
   - KYC controller `KYCdetails` in [userControllers.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/server/controllers/userControllers.js#L154-L171) uses the [kycModel.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/server/models/kycModel.js#L1-L40) schema to persist KYC information.
   - Ensure you register a corresponding route in `server/Routes/router.js` if you want `/dashboard` (or another path) to handle KYC submissions.
 
 ## API Endpoints (Current Router)
 
 Defined in [router.js](file:///c:/Users/sanis/Downloads/Multi-Factor%20Authentication%20System/server/Routes/router.js#L1-L9):
 
 - `POST /user/register` – Register a new user
 - `POST /user/sendotp` – Send email OTP after verifying password
 - `POST /user/login` – Verify OTP and return JWT
 
 You can extend the router to add:
 
 - `POST /dashboard` (or `/kyc`) – Persist KYC details via `KYCdetails`
 - `POST /user/mobile-verify` – Optional endpoint if you want server-side mobile verification using `MobileVerification`
 
 ## Running the App
 
 1. Start MongoDB (or ensure your Atlas cluster is accessible).
 2. Start the backend:
 
    ```bash
    cd server
    node app.js
    ```
 
 3. Start the frontend:
 
    ```bash
    cd client
    npm start
    ```
 
 4. Open the client in your browser at `http://localhost:3000`.
 
 ## Notes and Recommendations
 
 - Replace all placeholder values in `.env` and Firebase config before running.
 - Do not commit real credentials or connection strings.
 - Consider adding proper error handling and rate limiting for OTP endpoints in production.
 - Add route protection on the client and server using the JWT stored in `localStorage`.
 - Configure HTTPS and secure cookies if you adapt this for production use.
 
