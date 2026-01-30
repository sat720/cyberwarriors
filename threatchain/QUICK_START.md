# 🚀 QUICK START GUIDE

## What Commands to Run Where

Follow these steps EXACTLY in order:

---

## ⚠️ BEFORE YOU START

### 1. Get MongoDB Atlas Connection String

**You MUST do this first!**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for FREE account
3. Create a FREE cluster (M0 tier)
4. Create database user with username & password
5. Add IP address (click "Allow Access from Anywhere")
6. Click "Connect" → "Connect your application"
7. **Copy the connection string** - looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```
8. **SAVE THIS** - you'll need it in Step 2!

---

## 📝 STEP-BY-STEP COMMANDS

### STEP 1: Install Backend Dependencies

Open **PowerShell** or **Command Prompt**:

```powershell
# Navigate to backend directory
cd "C:\Users\91970\satvik\study\coding\WORKSHOPS AND HACKATHON\au_2026\threatchain\backend"

# Install packages (this will take 1-2 minutes)
npm install
```

**Wait for it to finish!** You should see "added XXX packages".

---

### STEP 2: Configure Backend Environment

**IMPORTANT**: Edit the `.env` file in the backend folder.

```powershell
# Still in backend directory
# Open .env file in VS Code (or any text editor)
code .env
```

Replace the MONGODB_URI with YOUR connection string from MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/threatchain?retryWrites=true&w=majority
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

**Example** (with fake credentials):

```env
MONGODB_URI=mongodb+srv://satvik:myPassword123@cluster0.mongodb.net/threatchain?retryWrites=true&w=majority
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

**SAVE THE FILE!**

---

### STEP 3: Start Backend Server

Still in the backend directory:

```powershell
# Start the backend server
npm start
```

**You should see:**

```
✨ ================================
🛡️  ThreatChain Backend Started!
✨ ================================
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
📊 Database: threatchain
🚀 Server running on port 5000
🌐 API URL: http://localhost:5000
📊 Health check: http://localhost:5000/
✨ ================================
```

**✅ If you see this, PERFECT! Leave this terminal running!**

**❌ If you see errors:**

- "MongooseError" → Your MongoDB URI is wrong, check Step 2
- "Port already in use" → Change PORT to 5001 in .env
- Other errors → Check the README troubleshooting section

---

### STEP 4: Install Frontend Dependencies

Open a **NEW PowerShell/Command Prompt window** (keep backend running!):

```powershell
# Navigate to frontend directory
cd "C:\Users\91970\satvik\study\coding\WORKSHOPS AND HACKATHON\au_2026\threatchain\frontend"

# Install packages (this will take 1-2 minutes)
npm install
```

**Wait for it to finish!**

---

### STEP 5: Start Frontend Dev Server

Still in the frontend directory:

```powershell
# Start the development server
npm run dev
```

**You should see:**

```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**✅ Perfect! Your app is ready!**

---

### STEP 6: Open in Browser

1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the **ThreatChain Dashboard**! 🎉

---

## 🎯 TESTING THE APP

Once the dashboard is open:

1. **Click "🔴 Brute Force Attack"** button
2. Wait 2-3 seconds
3. You should see:
   - Green success message
   - New alert appears (red box)
   - Events table fills with data
4. **Try other buttons** - each simulates a different attack!
5. **Refresh the page** - data remains (stored in MongoDB!)

---

## 📋 DIRECTORY STRUCTURE & WHAT TO RUN

Here's a visual guide:

```
/threatchain/
│
├── /backend/              👈 TERMINAL 1
│   ├── .env              (Edit this with MongoDB URI!)
│   └── package.json
│
│   📍 Run here:
│   1. npm install
│   2. npm start
│
└── /frontend/             👈 TERMINAL 2
    ├── .env              (Already configured for local)
    └── package.json

    📍 Run here:
    1. npm install
    2. npm run dev
```

---

## ⚡ QUICK REFERENCE

| What             | Where        | Command       |
| ---------------- | ------------ | ------------- |
| Install backend  | `/backend/`  | `npm install` |
| Start backend    | `/backend/`  | `npm start`   |
| Install frontend | `/frontend/` | `npm install` |
| Start frontend   | `/frontend/` | `npm run dev` |

---

## 🛑 STOPPING THE SERVERS

To stop the servers:

- Press **Ctrl + C** in each terminal window
- Answer `Y` when asked to terminate

---

## 🔄 RESTARTING AFTER CLOSING

Next time you want to run the app:

**Terminal 1 (Backend):**

```powershell
cd "C:\Users\91970\satvik\study\coding\WORKSHOPS AND HACKATHON\au_2026\threatchain\backend"
npm start
```

**Terminal 2 (Frontend):**

```powershell
cd "C:\Users\91970\satvik\study\coding\WORKSHOPS AND HACKATHON\au_2026\threatchain\frontend"
npm run dev
```

---

## 🆘 COMMON ERRORS & FIXES

### "npm: command not found"

- **Problem**: Node.js not installed
- **Fix**: Download from https://nodejs.org/ and install

### Backend won't connect to MongoDB

- **Problem**: Wrong connection string in `.env`
- **Fix**: Double-check your MongoDB Atlas connection string

### Frontend shows "Backend Connection Failed"

- **Problem**: Backend not running
- **Fix**: Make sure Terminal 1 is running backend (npm start)

### Port already in use

- **Problem**: Port 5000 or 5173 is occupied
- **Fix**: Change PORT in backend .env or close other apps

---

## ✅ SUCCESS CHECKLIST

- [ ] MongoDB Atlas account created
- [ ] Connection string copied
- [ ] Backend .env file updated
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend running (see "MongoDB Connected" message)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend running (see "Local: http://localhost:5173")
- [ ] Browser shows ThreatChain dashboard
- [ ] Test button creates alerts

---

## 🎉 YOU'RE READY!

If all checkboxes above are checked, you're ready to:

- Demo to judges
- Show to mentors
- Deploy to production

**For deployment instructions, see the main README.md**

---

**Need help? Check the main README.md for detailed troubleshooting!**
