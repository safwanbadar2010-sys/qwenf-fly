# 🔧 Fix MongoDB Atlas Connection

## ❌ Current Error: "bad auth : authentication failed"

This means your MongoDB credentials are incorrect or need to be fixed.

---

## ✅ SOLUTION: Fix MongoDB Atlas Setup

### **Step 1: Verify Your MongoDB Atlas Credentials**

1. **Go to MongoDB Atlas:**
   - Visit: https://cloud.mongodb.com
   - Login to your account

2. **Go to Database Access:**
   - Click "Database Access" in the left sidebar
   - Find your user: `qwenfly`
   - Click "Edit"

3. **Reset Password:**
   - Click "Edit Password"
   - Click "Autogenerate Secure Password"
   - **COPY THE NEW PASSWORD** (Click "Copy")
   - Click "Update User"

4. **Verify Network Access:**
   - Click "Network Access" in the left sidebar
   - Make sure you have: `0.0.0.0/0` (Allow access from anywhere)
   - If not, click "Add IP Address" → "Allow Access from Anywhere" → Confirm

---

### **Step 2: Get New Connection String**

1. **Go to Database:**
   - Click "Database" in the left sidebar
   - Click "Connect" button on your cluster
   - Choose "Connect your application"

2. **Copy Connection String:**
   - Driver: Node.js
   - Version: 4.1 or later
   - Copy the connection string

3. **Update Connection String:**
   - Replace `<password>` with your NEW password from Step 1
   - Replace database name with `travel-booking`

**Your connection string should look like:**
```
mongodb+srv://qwenfly:NEW_PASSWORD_HERE@qwenfly-cluster.kpz94eq.mongodb.net/travel-booking?retryWrites=true&w=majority
```

---

### **Step 3: Update .env File**

**Option A: Automated Script (Recommended)**

Run this command in PowerShell:

```powershell
cd c:\Users\RR\OneDrive\Desktop\QwenFly
notepad server\.env
```

Find the line:
```
MONGODB_URI=mongodb+srv://qwenfly:yunrcwiVCyyTGxup@qwenfly-cluster.kpz94eq.mongodb.net/travel-booking?retryWrites=true&w=majority
```

Replace with your NEW connection string:
```
MONGODB_URI=mongodb+srv://qwenfly:YOUR_NEW_PASSWORD@qwenfly-cluster.kpz94eq.mongodb.net/travel-booking?retryWrites=true&w=majority
```

Save and close.

**Option B: I'll Update It For You**

Just tell me your new MongoDB password and I'll update the .env file.

---

### **Step 4: Test Connection**

After updating .env:

```cmd
cd server
npm start
```

**Expected Output:**
```
Server running on port 5000
Environment: development
✅ MongoDB connected successfully
📊 Database: travel-booking
```

---

## 🔑 Alternative: Create Fresh Database User

If you want to start fresh:

### **1. Delete Old User:**
- MongoDB Atlas → Database Access
- Find `qwenfly` user
- Click "..." → Delete

### **2. Create New User:**
- Click "Add New Database User"
- **Username:** `qwenfly_admin`
- **Password:** Click "Autogenerate" → **COPY IT!**
- **Database User Privileges:** Atlas admin
- Click "Add User"

### **3. Get New Connection String:**
- Database → Connect → Connect your application
- Copy connection string
- Replace `<username>` with `qwenfly_admin`
- Replace `<password>` with the password you copied
- Replace database with `travel-booking`

### **4. Update .env:**
```env
MONGODB_URI=mongodb+srv://qwenfly_admin:YOUR_PASSWORD@qwenfly-cluster.kpz94eq.mongodb.net/travel-booking?retryWrites=true&w=majority
```

---

## 🧪 Quick Test Script

I've created a test script for you. Run:

```cmd
cd server
node test-mongodb.js
```

This will test your MongoDB connection independently.

---

## 💡 Common Issues & Fixes

### **Issue 1: Password Has Special Characters**

If your password has special characters like `!@#$%^&*`, they need to be URL-encoded:

| Character | URL Encoded |
|-----------|-------------|
| `!` | `%21` |
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `^` | `%5E` |
| `&` | `%26` |
| `*` | `%2A` |

**Example:**
- Original password: `Pass@123!`
- URL encoded: `Pass%40123%21`

**Use in connection string:**
```
mongodb+srv://qwenfly:Pass%40123%21@qwenfly-cluster...
```

### **Issue 2: Cluster Name Wrong**

Check if `qwenfly-cluster.kpz94eq` matches your actual cluster URL in MongoDB Atlas.

### **Issue 3: Database Name Wrong**

Make sure you're using `travel-booking` as the database name.

---

## 🚀 Next Steps After Fixing

Once MongoDB connects successfully:

1. ✅ Server will show: "MongoDB connected successfully"
2. ✅ Test health endpoint: http://localhost:5000/api/health
3. ✅ Test flight API: http://localhost:5000/api/flights/search?from=NYC&to=LAX&departureDate=2025-12-25&passengers=1
4. ✅ Deploy to production (Railway/Heroku/Vercel)

---

## 📞 Still Having Issues?

1. **Check MongoDB Atlas Status:**
   - Go to https://status.mongodb.com
   - Make sure there are no outages

2. **Verify Cluster Region:**
   - MongoDB Atlas → Database
   - Check if cluster is running (green indicator)

3. **Check Logs:**
   - MongoDB Atlas → Database → View Monitoring
   - Look for connection attempts

4. **Contact Me:**
   - Share the exact error message
   - I'll help troubleshoot further

---

## ✅ Checklist

Before trying to connect:

- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created with correct password
- [ ] Network access allows 0.0.0.0/0
- [ ] Connection string copied correctly
- [ ] Password in connection string (not `<password>`)
- [ ] Special characters URL-encoded if needed
- [ ] .env file updated with new connection string
- [ ] Server restarted after updating .env

---

**Follow these steps and your MongoDB will connect! 🎉**
