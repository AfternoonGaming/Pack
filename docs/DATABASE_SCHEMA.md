# Database Schema

## Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
);
```

**Fields:**
- `id` - Auto-incremented user ID
- `username` - Unique username (3+ characters)
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `created_at` - Account creation timestamp
- `last_login` - Last login timestamp

---

## Servers Table

```sql
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);
```

**Fields:**
- `id` - UUID (v4) primary key
- `user_id` - Foreign key to users table
- `server_name` - User-given server name
- `ip_address` - Public IP from tunnel
- `port` - Minecraft server port
- `tunnel_token` - playit.gg tunnel token
- `status` - Current server status (running/stopped/error)
- `created_at` - Server creation time
- `updated_at` - Last status update time

---

## Future Tables (Planned)

### Server Logs
```sql
CREATE TABLE server_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  server_id VARCHAR(36) NOT NULL,
  log_type ENUM('console', 'error', 'warning', 'info'),
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE,
  INDEX idx_server_id (server_id),
  INDEX idx_timestamp (timestamp)
);
```

### Players
```sql
CREATE TABLE players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  server_id VARCHAR(36) NOT NULL,
  player_name VARCHAR(16) NOT NULL,
  uuid VARCHAR(36),
  first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP,
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE,
  UNIQUE KEY unique_server_player (server_id, uuid)
);
```

### Analytics
```sql
CREATE TABLE analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  server_id VARCHAR(36) NOT NULL,
  player_count INT DEFAULT 0,
  tps DECIMAL(5, 2),
  memory_usage INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE,
  INDEX idx_server_id (server_id),
  INDEX idx_timestamp (timestamp)
);
```