# 🎮 Minecraft Server Manager App

> A mobile app that lets users run Minecraft servers on **Google Colab** with a programmer art UI and automatic IP:port generation.

## 📋 Project Overview

This project is a **Minecraft server management platform** where:
- Users register and get a personal Minecraft server instance
- Server runs on **Google Colab** (free Linux environment)
- Automatic IP:port generation via **ngrok tunneling**
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
│  - Colab Notebook Generation            │
│  - ngrok Tunnel Management              │
│  - Analytics & Ads                      │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Google Colab (Server Runtime)          │
│  - Python Environment                   │
│  - Java Server Execution                │
│  - ngrok Tunnel Connection              │
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
│   ├── utils/                 # Helper functions
│   └── colab-notebooks/       # Generated Colab notebooks
├── mobile/                     # React Native app
│   ├── screens/               # App screens/pages
│   ├── components/            # Reusable components
│   ├── styles/                # Programmer art theme
│   ├── assets/                # Pixel art assets
│   └── App.js                 # Main app file
├── colab-setup/               # Colab setup scripts
│   ├── setup-notebook.ipynb   # Colab notebook template
│   └── colab-launcher.py      # Python script to start server
├── server-template/           # Default server files
│   ├── server.properties      # Default server config
│   └── plugins/               # Plugin directory (optional)
└── docs/                       # Documentation
    ├── API.md                 # API documentation
    ├── SETUP.md               # Setup guide
    └── DEPLOYMENT.md          # Deployment guide
```

## 🚀 How It Works

### User Flow:
1. **Download app** → Register/Login
2. **Dashboard** → Click "Create Server"
3. **Backend** → Generates Google Colab notebook URL
4. **User opens Colab** → Runs notebook (one-click)
5. **Colab** → Downloads Java server, starts it, connects ngrok
6. **App shows** → Live IP:port to share with friends
7. **Friends join** → Via ngrok public tunnel

### Architecture:
- **Backend API** manages user accounts & server metadata
- **Google Colab** does the heavy lifting (free compute)
- **ngrok** creates public tunnels (free tier: one tunnel per account)
- **Mobile app** displays everything nicely

## 🎨 Programmer Art Theme

The UI uses classic Minecraft pixel art aesthetics:
- 16x16 & 32x32 pixel assets
- Classic bright colors (grass green, dirt brown, stone gray)
- Pixelated fonts
- Simple geometric UI elements

## 💰 Monetization

- **AdMob Banner Ads** - Bottom of dashboard
- **Rewarded Ads** - "Watch ad to get server uptime credits"
- **Interstitial Ads** - On app launch/server creation

## 📝 Next Steps

1. [ ] Set up backend API structure
2. [ ] Create database schemas
3. [ ] Build React Native UI components
4. [ ] Implement authentication system
5. [ ] Create Colab notebook generator
6. [ ] Generate ngrok tunnel URLs
7. [ ] Integrate AdMob ads
8. [ ] Test on actual device
9. [ ] Deploy backend to cloud
10. [ ] Publish mobile app

## 🔑 Key Benefits

✅ **Free hosting** - Google Colab is completely free
✅ **No termux needed** - Colab provides full Linux
✅ **One-click setup** - Users just run notebook
✅ **Automatic tunneling** - ngrok handles port forwarding
✅ **Scale easily** - Each user gets their own Colab notebook
✅ **Monetize** - Earn from AdMob ads

## 📄 License

MIT

## 👤 Author

AfternoonGaming

---

**Ready to build!** Start with the backend API setup.