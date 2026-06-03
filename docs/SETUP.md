# Setup Guide

## Prerequisites

- **Node.js** (v14+)
- **npm** or **yarn**
- **MySQL** database
- **Java 17+** (for server runtime)
- **Android device** with Termux installed (for server deployment)

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

```bash
mysql -u root -p < setup/database.sql
```

Or manually create:

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
  tunnel_token VARCHAR(255),
  status ENUM('running', 'stopped', 'error') DEFAULT 'stopped',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_id ON servers(user_id);
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

Edit `mobile/src/screens/LoginScreen.js` and update:
```javascript
const API_BASE_URL = 'http://your-backend-api.com/api';
```

Replace with your actual backend URL.

### 3. Run on Android

```bash
npx react-native run-android
```

Or with Expo:
```bash
expo start
```

---

## Termux Server Setup

### 1. Install Termux

Download from [Google Play Store](https://play.google.com/store/apps/details?id=com.termux) or [F-Droid](https://f-droid.org/)

### 2. Run Setup Script

```bash
# Open Termux and run:
bash install-java.sh
```

### 3. Copy Server Files

Copy your server JAR file to `~/minecraft-server/` in Termux.

### 4. Configure playit.gg

```bash
bash tunnel-setup.sh
```

Follow the setup wizard to create an account and get your tunnel IP.

### 5. Start Server

```bash
bash start-server.sh
```

---

## Database Setup

### Create Backup

```bash
mysqldump -u root -p minecraft_manager > backup.sql
```

### Restore from Backup

```bash
mysql -u root -p minecraft_manager < backup.sql
```

---

## Troubleshooting

### Backend won't start
- Check if port 5000 is in use: `lsof -i :5000`
- Verify MySQL is running
- Check database credentials in `.env`

### App can't connect to backend
- Ensure backend is running
- Check API_BASE_URL is correct
- Verify network connectivity
- Check firewall settings

### Termux Java errors
- Update packages: `apt update && apt upgrade`
- Verify Java: `java -version`
- Check available storage in Termux

### Server won't start on Termux
- Verify server.jar is in `~/minecraft-server/`
- Check Java is installed: `java -version`
- Review `eula.txt` is set to `true`
- Check port is not in use: `netstat -tlnp`

---

## Next Steps

1. Test backend API with Postman
2. Deploy backend to cloud (Heroku, Railway, AWS)
3. Build and deploy mobile app (Google Play, F-Droid)
4. Integrate AdMob for monetization
5. Add more features (console access, player management, etc.)