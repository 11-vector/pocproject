# Create directories
New-Item -ItemType Directory -Force -Path "client"
New-Item -ItemType Directory -Force -Path "server"

# Install root dependencies
npm install

# Setup server
Set-Location -Path "server"
npm install
Set-Location -Path ".."

# Setup client
Set-Location -Path "client"
npm install
Set-Location -Path ".."

Write-Host "Setup complete!" 