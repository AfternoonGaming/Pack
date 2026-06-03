#!/usr/bin/env python3
"""
Google Colab Minecraft Server Launcher
This script runs inside a Google Colab notebook to start a Minecraft server
with automatic ngrok tunneling for public access.
"""

import os
import subprocess
import time
import requests
from pathlib import Path

# Configuration
JAVA_VERSION = "17"
SERVER_PORT = 25565
SERVER_DIRECTORY = "/content/minecraft-server"
SERVER_JAR_URL = "https://api.papermc.io/v2/projects/paper/versions/1.20.1/builds/121/downloads/paper-1.20.1-121.jar"
NGROK_AUTH_TOKEN = None  # Will be set by user

def install_java():
    """Install Java 17 on Colab"""
    print("📦 Installing Java 17...")
    subprocess.run(["apt", "update"], check=True, capture_output=True)
    subprocess.run(["apt", "install", "-y", f"openjdk-{JAVA_VERSION}-jdk"], check=True, capture_output=True)
    
    # Verify
    result = subprocess.run(["java", "-version"], capture_output=True, text=True)
    print(f"✅ Java installed:\n{result.stderr}")

def download_ngrok():
    """Download and install ngrok"""
    print("📦 Downloading ngrok...")
    ngrok_path = "/usr/local/bin/ngrok"
    
    if not Path(ngrok_path).exists():
        subprocess.run([
            "wget", "-q", "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip", 
            "-O", "/tmp/ngrok.zip"
        ], check=True)
        subprocess.run(["unzip", "-q", "/tmp/ngrok.zip", "-d", "/usr/local/bin/"], check=True)
        subprocess.run(["chmod", "+x", ngrok_path], check=True)
    
    print("✅ ngrok installed")

def setup_server_directory():
    """Create and setup Minecraft server directory"""
    print(f"📁 Setting up server directory: {SERVER_DIRECTORY}")
    Path(SERVER_DIRECTORY).mkdir(parents=True, exist_ok=True)
    os.chdir(SERVER_DIRECTORY)

def download_server_jar():
    """Download Minecraft server JAR (Paper for better performance)"""
    jar_file = os.path.join(SERVER_DIRECTORY, "server.jar")
    
    if not Path(jar_file).exists():
        print(f"📥 Downloading Minecraft server JAR...")
        subprocess.run(["wget", "-q", SERVER_JAR_URL, "-O", jar_file], check=True)
    
    print(f"✅ Server JAR ready: {jar_file}")

def accept_eula():
    """Accept Minecraft server EULA"""
    eula_file = os.path.join(SERVER_DIRECTORY, "eula.txt")
    with open(eula_file, "w") as f:
        f.write("eula=true\n")
    print("✅ EULA accepted")

def configure_server():
    """Configure server.properties"""
    properties_file = os.path.join(SERVER_DIRECTORY, "server.properties")
    
    if not Path(properties_file).exists():
        properties = f"""
#Minecraft server properties
motd=Colab Minecraft Server
server-port={SERVER_PORT}
max-players=20
view-distance=10
simulation-distance=10
difficulty=normal
gamemode=survival
pvp=true
enable-rcon=true
rcon.port=25575
rcon.password=minecraft
online-mode=false
white-list=false
        """
        with open(properties_file, "w") as f:
            f.write(properties.strip())
    
    print("✅ Server configured")

def setup_ngrok(auth_token):
    """Setup ngrok authentication"""
    print(f"🌐 Setting up ngrok with provided token...")
    subprocess.run(["/usr/local/bin/ngrok", "config", "add-authtoken", auth_token], check=True)
    print("✅ ngrok authenticated")

def start_server():
    """Start Minecraft server"""
    print("🚀 Starting Minecraft server...")
    jar_file = os.path.join(SERVER_DIRECTORY, "server.jar")
    
    # Start server in background
    with open(os.path.join(SERVER_DIRECTORY, "server.log"), "w") as log_file:
        subprocess.Popen([
            "java",
            "-Xmx1024M",
            "-Xms512M",
            "-jar", jar_file,
            "nogui"
        ], stdout=log_file, stderr=subprocess.STDOUT, cwd=SERVER_DIRECTORY)
    
    # Wait for server to start
    print("⏳ Waiting for server to initialize (30 seconds)...")
    time.sleep(30)
    print("✅ Server started")

def start_ngrok_tunnel():
    """Start ngrok tunnel"""
    print("🌐 Starting ngrok tunnel...")
    
    # Start ngrok tunnel in background
    subprocess.Popen([
        "/usr/local/bin/ngrok",
        "tcp",
        f"--addr", f"127.0.0.1:{SERVER_PORT}",
        "--log", "stdout",
        f"{SERVER_PORT}"
    ])
    
    # Wait for ngrok to start
    time.sleep(5)
    
    # Get public URL
    try:
        response = requests.get("http://localhost:4040/api/tunnels", timeout=5)
        tunnels = response.json()["tunnels"]
        
        if tunnels:
            public_url = tunnels[0]["public_url"]
            print(f"\n✅ Server is now publicly accessible!")
            print(f"🎮 Connection: {public_url}")
            return public_url
    except Exception as e:
        print(f"⚠️ Could not retrieve public URL: {e}")
        return None

def main(ngrok_token):
    """Main execution"""
    print("\n" + "="*50)
    print("🎮 Google Colab Minecraft Server Launcher")
    print("="*50 + "\n")
    
    try:
        install_java()
        download_ngrok()
        setup_server_directory()
        download_server_jar()
        accept_eula()
        configure_server()
        setup_ngrok(ngrok_token)
        start_server()
        public_url = start_ngrok_tunnel()
        
        print("\n" + "="*50)
        print("✅ SERVER SETUP COMPLETE!")
        print("="*50)
        if public_url:
            host, port = public_url.replace("tcp://", "").split(":")
            print(f"📍 Server Address: {host}")
            print(f"🔌 Port: {port}")
            print(f"\n🎮 Share this with friends: {host}:{port}")
        print("\nServer will keep running. Check logs at /content/minecraft-server/server.log")
        print("="*50 + "\n")
        
        # Keep running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n⛔ Server shutting down...")
    
    except Exception as e:
        print(f"\n❌ Error: {e}")
        raise

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        ngrok_token = sys.argv[1]
    else:
        ngrok_token = input("Enter your ngrok authtoken: ")
    
    main(ngrok_token)