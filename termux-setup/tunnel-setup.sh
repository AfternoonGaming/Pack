#!/bin/bash

# Termux playit.gg Tunnel Setup
# Automatically configures port forwarding via playit.gg

echo "🌐 Setting up playit.gg tunnel..."

# Install playit CLI
echo "Installing playit.gg CLI..."
curl -SsL https://playit.gg/install.sh | bash

# Configure tunnel
echo "Configure your playit.gg account:"
echo "1. Visit https://playit.gg/"
echo "2. Create an account"
echo "3. Run: playit-cli"
echo "4. Follow the setup wizard"
echo "5. Forward port 25565 (Minecraft)"

echo ""
echo "Once configured, your server will be accessible via:"
echo "playit-cli status"