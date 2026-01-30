# 🛡️ ThreatChain - Cyber Threat Detection System

A real-time cyber threat detection dashboard built with React, Node.js, MongoDB Atlas, and optional blockchain integration.

**Built for AU Hackathon 2026** | Cybersecurity + Blockchain

---

## 📋 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [Our Solution](#-our-solution)
3. [Features](#-features)
4. [Tech Stack](#-tech-stack)
5. [Project Structure](#-project-structure)
6. [Local Development Setup](#-local-development-setup)
7. [Deployment Guide](#-deployment-guide)
8. [Demo Script for Judges](#-demo-script-for-judges)
9. [API Documentation](#-api-documentation)
10. [How It Works](#-how-it-works)

---

## 🎯 Problem Statement

### Real-World Cyber Attacks

Today's applications and websites face constant cyber attacks:

- **Brute Force Attacks** - Attackers try many wrong passwords to break into accounts
- **OTP Flooding** - Too many OTP requests sent to overwhelm the system
- **Password Reset Abuse** - Repeated password reset requests to harass users
- **Request Flooding (DDoS)** - Overwhelming the server with too many requests
- **Session Hijacking Risk** - Stealing user sessions to access accounts
- **Suspicious Login Patterns** - Odd time logins, new devices

### The Problems We Face

✅ **Early Detection Failure** - We don't detect attacks until it's too late  
✅ **No Monitoring Dashboard** - No way to see live attacks happening  
✅ **Evidence Tampering** - Logs can be modified or deleted by attackers  
✅ **Proof Difficulty** - Hard to prove an attack happened for legal purposes

---

## 💡 Our Solution

**ThreatChain** is a Real-time Cyber Threat Detection Dashboard that:

✅ **Collects Security Events** - Monitors login attempts, OTP requests, password resets, API calls  
✅ **Applies Detection Rules** - Uses threshold-based algorithms to detect attacks  
✅ **Generates Alerts** - Creates alerts with severity levels (LOW/MEDIUM/HIGH/CRITICAL)  
✅ **Live Dashboard** - Beautiful UI showing all events and alerts in real-time  
✅ **Test Data Generator** - One-click buttons to simulate attacks for demos  
✅ **Persistent Storage** - All data saved in MongoDB Atlas cloud database  
✅ **Optional Blockchain** - Store alert hashes on blockchain for tamper-proof evidence

---

## ⚡ Features

### Attack Detection (4 Types)

| Attack Type          | Detection Rule                            | Severity    |
| -------------------- | ----------------------------------------- | ----------- |
| **Brute Force**      | Failed logins > 10 in 60 sec from same IP | HIGH        |
| **OTP Flooding**     | OTP requests > 8 in 60 sec from same IP   | MEDIUM/HIGH |
| **Reset Abuse**      | Reset requests > 5 in 60 sec from same IP | MEDIUM      |
| **Request Flooding** | Requests > 200 per min from same IP       | HIGH        |

### Dashboard Features

- 🎯 **Test Buttons** - One-click attack simulation for demos
- 📊 **Live Stats** - Total events, alerts, high severity count
- 🚨 **Alerts Table** - Color-coded severity (animated badges)
- 📈 **Events Table** - All security events with timestamps
- 🔄 **Auto-Refresh** - Real-time data updates
- 🎨 **Beautiful UI** - Glassmorphism design with gradients

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **Tailwind CSS** - Styling with custom gradients
- **Axios** - API calls
- **Vite** - Build tool

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **Mongoose** - MongoDB ODM

### Database

- **MongoDB Atlas** - Cloud database (free tier available)

### Deployment

- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway
- **Database**: MongoDB Atlas

### Optional

- **Blockchain**: Solidity + Ethers.js (for tamper-proof evidence)

---

## 📁 Project Structure

```
threatchain/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── models/
│   │   │   ├── Event.js              # Event schema
│   │   │   └── Alert.js              # Alert schema
│   │   ├── services/
│   │   │   ├── fakeDataGenerator.js  # Test data generator
│   │   │   └── detector.js           # Threat detection logic
│   │   ├── routes/
│   │   │   └── testRoutes.js         # API endpoints
│   │   └── index.js                  # Express server
│   ├── package.json
│   ├── .env.example
│   └── .env                          # Create this!
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js                # API client
│   │   ├── components/
│   │   │   ├── TestButtons.jsx       # Attack simulation buttons
│   │   │   ├── EventsTable.jsx       # Events display
│   │   │   └── AlertsTable.jsx       # Alerts display
│   │   ├── pages/
│   │   │   └── Dashboard.jsx         # Main page
│   │   ├── App.jsx                   # Root component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── package.json
│   ├── .env.example
│   ├── .env                          # Create this!
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
└── README.md                         # This file
```

---

## 🚀 Local Development Setup

### Prerequisites

Make sure you have installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas Account** (free) - [Sign up here](https://www.mongodb.com/cloud/atlas)

### Step 1: MongoDB Atlas Setup

1. **Create Account** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**:
   - Click "Create Cluster"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create Cluster"
3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password (save these!)
4. **Whitelist IP**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for testing)
5. **Get Connection String**:
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/`

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd threatchain/backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env file and add your MongoDB connection string
# Replace <username>, <password>, and database name
# Example:
# MONGODB_URI=mongodb+srv://satvik:mypassword123@cluster0.xxxxx.mongodb.net/threatchain?retryWrites=true&w=majority
```

**Your `.env` file should look like:**

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/threatchain?retryWrites=true&w=majority
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

```bash
# Start backend server
npm start

# You should see:
# ✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
# 🚀 Server running on port 5000
```

### Step 3: Frontend Setup

Open a **NEW terminal** (keep backend running):

```bash
# Navigate to frontend folder
cd threatchain/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file
# For local development, it should be:
# VITE_API_URL=http://localhost:5000
```

**Your `.env` file should look like:**

```env
VITE_API_URL=http://localhost:5000
```

```bash
# Start frontend development server
npm run dev

# You should see:
# VITE ready in 500 ms
# ➜  Local:   http://localhost:5173/
```

### Step 4: Open in Browser

1. Open browser to `http://localhost:5173`
2. You should see the ThreatChain dashboard! 🎉
3. Click any test button to simulate an attack
4. Watch alerts appear automatically!

---

## 🌐 Deployment Guide

### Part 1: Deploy MongoDB Atlas (Already Done!)

You already set this up in local development. Just keep using the same connection string.

### Part 2: Deploy Backend to Render

1. **Push Code to GitHub**:

   ```bash
   cd threatchain
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Create Render Account**: Go to [render.com](https://render.com) and sign up

3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `threatchain/backend` folder
   - Settings:
     - **Name**: `threatchain-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: `Free`

4. **Add Environment Variables**:
   - Click "Environment" tab
   - Add these variables:
     ```
     MONGODB_URI = your_mongodb_atlas_connection_string
     PORT = 5000
     CORS_ORIGIN = https://your-frontend-url.vercel.app
     ```
   - **Note**: You'll update `CORS_ORIGIN` after deploying frontend

5. **Deploy**:
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your backend URL: `https://threatchain-backend.onrender.com`

### Part 3: Deploy Frontend to Vercel

1. **Update Frontend .env**:

   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. **Create Vercel Account**: Go to [vercel.com](https://vercel.com) and sign up

3. **Deploy Frontend**:
   - Click "Add New Project"
   - Import your GitHub repository
   - Select `threatchain/frontend` folder
   - Settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
4. **Add Environment Variables**:
   - Go to "Settings" → "Environment Variables"
   - Add:
     ```
     VITE_API_URL = https://your-backend-url.onrender.com
     ```

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉
   - Copy your frontend URL: `https://threatchain.vercel.app`

6. **Update Backend CORS**:
   - Go back to Render
   - Update `CORS_ORIGIN` environment variable to your Vercel URL
   - Redeploy backend

### Part 4: Test Deployed Version

1. Open your Vercel URL
2. Click test buttons
3. Alerts should appear!
4. Data persists even after refresh (thanks to MongoDB Atlas!)

---

## 🎭 Demo Script for Judges

**Use this script during your hackathon presentation:**

### Introduction (1 minute)

> "Hi! I'm presenting **ThreatChain** - a real-time cyber threat detection system. Today's websites face constant attacks like brute force, OTP flooding, and DDoS. The problem? We detect them too late, and evidence can be tampered with.
>
> ThreatChain solves this with automatic threat detection, a live monitoring dashboard, and optional blockchain for tamper-proof evidence. Let me show you!"

### Live Demo (3 minutes)

1. **Show Dashboard**:

   > "This is our dashboard. You can see we're currently monitoring 0 events and 0 alerts. The system is clean."

2. **Simulate Brute Force Attack**:

   > "Let's simulate a brute force attack - where someone tries many wrong passwords."
   - Click **"🔴 Brute Force Attack"** button
   - Wait 2 seconds

   > "Look! The system detected it immediately. We now have 15 failed login events from the same IP in 60 seconds. Our detection algorithm flagged this as HIGH severity because it exceeded our threshold of 10 attempts."
   - Point to the alert showing reason: "15 failed login attempts in 60 seconds (threshold: 10)"

3. **Simulate OTP Flooding**:

   > "Now let's try OTP flooding - this is when attackers request too many OTPs."
   - Click **"🟠 OTP Flooding"** button
   - Wait 2 seconds

   > "Another alert! 12 OTP requests from the same IP. Marked as MEDIUM/HIGH severity."

4. **Show Events Table**:

   > "Below, you can see all individual events - each login attempt, each OTP request, with timestamps and IP addresses. This gives us complete visibility."

5. **Explain Persistence**:

   > "All this data is stored in MongoDB Atlas cloud database. Even if I refresh..."
   - Refresh page

   > "...the data remains. This is crucial for investigations and legal evidence."

### Technical Explanation (1 minute)

> "Technical stack:
>
> - **Frontend**: React with Tailwind for this beautiful UI
> - **Backend**: Node.js + Express running detection algorithms
> - **Database**: MongoDB Atlas for persistence
> - **Detection**: Threshold-based rules - we analyze events in real-time and trigger alerts when thresholds are exceeded
> - **Optional**: Blockchain integration for tamper-proof evidence hashing"

### Conclusion (30 seconds)

> "ThreatChain provides:
>
> 1. Early attack detection
> 2. Live monitoring dashboard
> 3. Persistent evidence
> 4. Demo-ready for security teams
>
> Perfect for any organization wanting to improve their cyber security posture. Thank you!"

---

## 📚 API Documentation

### Base URL

- **Local**: `http://localhost:5000`
- **Production**: `https://your-backend.onrender.com`

### Endpoints

#### 1. Health Check

```http
GET /
```

Returns API status and available endpoints.

**Response:**

```json
{
  "success": true,
  "message": "🛡️ ThreatChain API is running!",
  "version": "1.0.0"
}
```

#### 2. Simulate Brute Force Attack

```http
POST /api/test/bruteforce
```

Generates 15 failed login attempts from same IP.

**Response:**

```json
{
  "success": true,
  "message": "Brute force attack simulated successfully",
  "events_created": 15,
  "alerts_created": 1,
  "events": [...],
  "alerts": [...]
}
```

#### 3. Simulate OTP Flooding

```http
POST /api/test/otp-flood
```

#### 4. Simulate Reset Abuse

```http
POST /api/test/reset-abuse
```

#### 5. Simulate Request Flooding

```http
POST /api/test/request-flood
```

#### 6. Get All Events

```http
GET /api/events?limit=50
```

#### 7. Get All Alerts

```http
GET /api/alerts?limit=50
```

#### 8. Get Statistics

```http
GET /api/stats
```

**Response:**

```json
{
  "success": true,
  "stats": {
    "total_events": 150,
    "total_alerts": 12,
    "high_severity_alerts": 5,
    "active_alerts": 8
  }
}
```

#### 9. Clear All Data

```http
DELETE /api/clear-all
```

---

## 🔧 How It Works

### Event Flow

```
1. User clicks "Test Attack" button on frontend
   ↓
2. Frontend sends POST request to backend (e.g., /api/test/bruteforce)
   ↓
3. Backend's fakeDataGenerator creates fake events
   ↓
4. Events are saved to MongoDB Atlas
   ↓
5. Detector service analyzes recent events
   ↓
6. If threshold exceeded, Alert is created
   ↓
7. Alert saved to MongoDB Atlas
   ↓
8. Backend returns events + alerts to frontend
   ↓
9. Frontend displays them in beautiful tables
```

### Detection Algorithm Example (Brute Force)

```javascript
// Pseudo-code
1. Get all login_attempt events from last 60 seconds
2. Group by IP address
3. For each IP:
   - Count failed login attempts
   - If count > 10:
     - Create HIGH severity alert
     - Store reason: "X failed logins in 60 seconds"
4. Save alerts to database
5. Return alerts
```

---

## 🎨 UI Design Principles

- **Glassmorphism**: Transparent backgrounds with blur effects
- **Gradient Backgrounds**: Purple/indigo theme for cyber security feel
- **Color-Coded Severity**:
  - 🔵 LOW - Blue
  - 🟡 MEDIUM - Yellow
  - 🔴 HIGH - Red
  - 🟣 CRITICAL - Purple (with pulse animation)
- **Smooth Animations**: Fade-in, slide-in, hover effects
- **Responsive Design**: Works on mobile, tablet, desktop

---

## 🤔 Common Issues & Troubleshooting

### Backend won't start

**Error**: `MongooseError: URI malformed`

- **Fix**: Check your `.env` file. Make sure `MONGODB_URI` is correct and has no spaces.

**Error**: `Port 5000 already in use`

- **Fix**: Change `PORT=5001` in `.env` file

### Frontend not connecting to backend

**Error**: Network Error / Connection refused

- **Fix**:
  1. Make sure backend is running (`npm start` in backend folder)
  2. Check `.env` in frontend has correct `VITE_API_URL`
  3. Restart frontend server

### No alerts appearing

**Fix**:

1. Check browser console for errors (F12)
2. Make sure MongoDB is connected (check backend terminal)
3. Try clearing data and running test again

### Deployment issues

**Render free tier sleeping**:

- Free tier sleeps after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- This is normal!

---

## 📝 Event Data Structure

```json
{
  "type": "login_attempt",
  "ip_address": "10.0.0.5",
  "username": "satvik",
  "success": false,
  "device_id": "dev001",
  "location": "Hyderabad",
  "time_of_login": "2026-01-30T10:20:30",
  "otp_requests": 0,
  "reset_requests": 0,
  "request_rate": 0,
  "session_id": "sess123",
  "user_behavior_score": 20
}
```

---

## 🚀 Future Enhancements

- ✅ Blockchain integration for alert hashing
- ✅ Machine learning for anomaly detection
- ✅ Email/SMS notifications for critical alerts
- ✅ IP blocking/firewall integration
- ✅ User authentication & role-based access
- ✅ Historical data visualization (charts/graphs)
- ✅ Export reports (PDF/CSV)

---

## 👥 Team

- **Satvik** - Full Stack Developer

---

## 📄 License

MIT License - Feel free to use for your hackathon!

---

## 🙏 Acknowledgments

- Built for **AU Hackathon 2026**
- Theme: **Cybersecurity + Blockchain**
- Made with ❤️ and lots of ☕

---

## 📞 Support

For questions or issues:

1. Check the troubleshooting section above
2. Review backend logs in terminal
3. Check browser console (F12) for frontend errors

---

**Good luck with your hackathon! 🚀**
