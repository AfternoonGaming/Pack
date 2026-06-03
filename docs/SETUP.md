# Setup Guide - Google Colab Edition

## Prerequisites

- **Node.js** (v14+)
- **npm** or **yarn**
- **MySQL** database
- **Free Google Account** (for Colab)
- **Free ngrok Account** (for tunneling)

---

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update variables:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=minecraft_manager
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
```

### 3. Create Database

```sql
CREATE DATABASE minecraft_manager;
USE minecraft_manager;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE servers (
  id VARCHAR(36) PRIMARY KEY,
  user_id INT NOT NULL,
  server_name VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  port INT NOT NULL,
  colab_url VARCHAR(500),
  status ENUM('stopped', 'running', 'error') DEFAULT 'stopped',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);
```

### 4. Start Backend

```bash
npm start
```

Server will run on `http://localhost:5000`

---

## Mobile App Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure API Endpoint

Edit `mobile/src/screens/LoginScreen.js`:
```javascript
const API_BASE_URL = 'http://your-backend-api.com/api';
```

### 3. Run on Android

```bash
npx react-native run-android
```

---

## How Users Run a Server

### Step 1: User creates server in app
- Opens app → Dashboard → "+ Add Server"
- Enters server name → "Create"
- Backend generates Google Colab notebook link

### Step 2: User gets ngrok token (one-time)
- Visit https://dashboard.ngrok.com/auth
- Sign up free
- Copy auth token

### Step 3: User opens Colab notebook
- Click "Open in Colab" link from app
- Paste ngrok token in first cell
- Run all cells (⏯️ buttons)
- Wait ~30 seconds
- Colab shows public IP:port

### Step 4: Share with friends
- Friends join via IP:port
- Server keeps running while Colab is open
- Can leave browser tab open or use Colab background execution

---

## Cost Analysis

✅ **FREE** - Google Colab (3 notebooks at once)
✅ **FREE** - ngrok (1 public tunnel)
✅ **FREE** - Backend (if deployed on free tier)
💰 **REVENUE** - AdMob ads on mobile app

---

## Scaling

### Free Tier Limits:
- **Google Colab**: 3 concurrent notebooks (upgrade for more)
- **ngrok**: 1 public tunnel per account (upgrade for more)
- **Backend**: Deploy on free tier (Render, Railway, Heroku)

### To Scale:
1. Users need their own ngrok accounts (free, unlimited)
2. Deploy backend to cloud
3. Database hosted in cloud
4. Each user runs their own Colab notebook

---

## Troubleshooting

### Backend won't start
```bash
# Check port
lsof -i :5000

# Check MySQL
mysql -u root -p
```

### App can't connect
- Verify API_BASE_URL is correct
- Check backend is running
- Check firewall/network

### Colab server won't start
- Verify ngrok token is valid
- Check internet connection in Colab
- Ensure Java installed: `!java -version`
- Check server logs: `/content/minecraft-server/server.log`

### Server shows running but can't connect
- Verify ngrok tunnel is active
- Check firewall isn't blocking
- Try restarting Colab notebook

---

## Next Steps

1. ✅ Set up backend locally
2. ✅ Configure MySQL
3. ✅ Test API endpoints
4. [ ] Deploy backend to cloud
5. [ ] Build mobile app
6. [ ] Add AdMob ads
7. [ ] Publish to Google Play
8. [ ] Marketing & growth

---

## Architecture Diagram

```
User App                  Backend API            Google Colab
┌──────────────┐         ┌──────────────┐       ┌──────────────┐
│ Register     │────────→│ Auth         │       │              │
│ Login        │         │ Server Mgmt  │       │              │
└──────────────┘         └──────────────┘       │              │
       ↓                         ↓              │              │
┌──────────────┐         ┌──────────────┐       │              │
│ Create Server│────────→│ Generate URL │       │              │
│              │         └──────────────┘       │              │
└──────────────┘                ↓              │              │
       ↓              Colab Notebook URL       │              │
       └─────────────────────────────────────→ │ Run Notebook │
                                               │ Start Server │
                                               │ Setup ngrok  │
       ┌──────────────┐         ┌──────────────┐               │
       │ View IP:port │←────────│ Update Status│←──────────────┘
       │ Share        │         │              │
       └──────────────┘         └──────────────┘
```