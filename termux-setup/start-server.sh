#!/bin/bash

# Minecraft Server Startup Script for Termux

cd ~/minecraft-server

# Server configuration
MAX_RAM="512M"  # Adjust based on device RAM
MIN_RAM="256M"

# EULA acceptance (required for server to run)
if [ ! -f "eula.txt" ]; then
  echo "eula=true" > eula.txt
fi

# Start server
echo "🎮 Starting Minecraft server..."
java -Xmx${MAX_RAM} -Xms${MIN_RAM} -jar server.jar nogui

# Keep terminal open if process exits
read -p "Press Enter to exit..."