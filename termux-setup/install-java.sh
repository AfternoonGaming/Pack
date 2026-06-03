#!/bin/bash

# Termux Java Server Setup Script
# This script sets up a Minecraft Java server on an Android device using Termux

set -e

echo "🎮 Minecraft Server Termux Setup"
echo "================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Update packages
echo -e "${YELLOW}[1/5] Updating package manager...${NC}"
apt update && apt upgrade -y

# Install Java
echo -e "${YELLOW}[2/5] Installing Java Runtime Environment...${NC}"
apt install -y openjdk-17

# Verify Java installation
echo -e "${YELLOW}[3/5] Verifying Java installation...${NC}"
java -version

# Create server directory
echo -e "${YELLOW}[4/5] Creating server directory...${NC}"
mkdir -p ~/minecraft-server
cd ~/minecraft-server

# Download server jar (using Paper for better performance)
echo -e "${YELLOW}[5/5] Downloading Minecraft server JAR...${NC}"
# Note: Replace with your actual server JAR URL
if [ ! -f "server.jar" ]; then
  echo "Please place your server.jar in ~/minecraft-server/"
  echo "You can download it from: https://papermc.io/downloads"
fi

echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Copy your server.jar to ~/minecraft-server/"
echo "2. Run: bash start-server.sh"
echo ""