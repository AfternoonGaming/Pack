# 🎮 Minecraft Server Manager App

> A mobile app that lets users run Minecraft servers on their phones with programmer art UI and automatic tunneling.

## 📋 Project Overview

This project is a **Minecraft server management platform** where:
- Users register and get a personal Minecraft server instance
- Server runs on their phone using a custom Termux setup
- Automatic IP:port generation via free tunnel services
- Earn revenue through AdMob ads
- Programmer art (Minecraft classic pixel) theme

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│      React Native Mobile App (Frontend)  │
│  - Login/Register UI                     │
│  - Server Management Dashboard           │
│  - Programmer Art Theme                  │
│  - AdMob Ad Integration                  │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│    Node.js Backend API (Express)        │
│  - User Authentication                  │
│  - Server Instance Management           │
│  - Termux Script Generation             │
│  - Analytics & Ads                      │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  User Phone (Termux Environment)        │
│  - Java Server Runtime                  │
│  - playit.gg Tunnel                     │
│  - Server Files & World Data            │
└─────────────────────────────────────────┘
```

## 📂 Project Structure

```
├── backend/                    # Node.js API
│   ├── server.js              # Express server
│   ├── config/                # Configuration files
│   ├── routes/                # API endpoints
│   ├── models/                # Database schemas
│   └── utils/                 # Helper functions
├── mobile/                     # React Native app
│   ├── screens/               # App screens/pages
│   ├── components/            # Reusable components
│   ├── styles/                # Programmer art theme
│   ├── assets/                # Pixel art assets
│   └── App.js                 # Main app file
├── termux-setup/              # Termux automation scripts
│   ├── install-java.sh        # Install Java runtime
│   ├── setup-server.sh        # Set up Minecraft server
│   └── tunnel-setup.sh        # Configure playit.gg
├── server-template/           # Your zip file extracted
│   ├── server.properties      # Default server config
│   ├── spigot.jar             # Server JAR (optional)
│   └── plugins/               # Plugin directory
└── docs/                       # Documentation
    ├── API.md                 # API documentation
    ├── SETUP.md               # Setup guide
    └── DEPLOYMENT.md          # Deployment guide
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Mobile App Setup
```bash
cd mobile
npm install
npx react-native run-android
```

## 🔑 Key Features

- ✅ User Authentication (Register/Login)
- ✅ Automatic Server Instance Creation
- ✅ Termux-based Java Server Execution
- ✅ Automatic Tunnel Configuration (playit.gg)
- ✅ Programmer Art UI Theme
- ✅ AdMob Ad Integration
- ✅ Server Management Dashboard
- ✅ Player Analytics

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

### Servers Table
```sql
CREATE TABLE servers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  server_name VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  port INTEGER,
  tunnel_token VARCHAR(255),
  status ENUM('running', 'stopped', 'error'),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);
```

## 🎨 Programmer Art Theme

The UI uses classic Minecraft pixel art aesthetics:
- 16x16 & 32x32 pixel assets
- Classic bright colors (grass green, dirt brown, stone gray)
- Pixelated fonts
- Simple geometric UI elements

## 📱 Why Programmer Art?

Programmer art is Minecraft's original texture style - simple, recognizable, and easy to replicate for UI. Perfect for a retro gaming app!

## ⚙️ Termux Approach (Why Java Works on Phone)

Termux provides a complete Linux environment on Android. Inside it:
1. Java Runtime Environment (JRE) runs
2. Minecraft Server JAR executes normally
3. playit.gg tunnel exposes the port
4. App stays in background keeping it alive

## 💰 Monetization

- **AdMob Banner Ads** - Bottom of dashboard
- **Rewarded Ads** - "Watch ad to boost server speed" features
- **Interstitial Ads** - On app launch/server creation

## 📝 Next Steps

1. [ ] Set up backend API structure
2. [ ] Create database schemas
3. [ ] Build React Native UI components
4. [ ] Implement authentication system
5. [ ] Create Termux automation scripts
6. [ ] Integrate AdMob ads
7. [ ] Test on actual device
8. [ ] Deploy backend to cloud

## 📄 License

MIT

## 👤 Author

AfternoonGaming

---

**Ready to build!** Start with the backend API setup.
