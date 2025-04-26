# Start from the official Playwright image with Node.js and browsers
FROM mcr.microsoft.com/playwright:v1.52.0-noble

# Install xvfb and any other needed OS packages
RUN apt-get update && \
    apt-get install -y xvfb && \
    rm -rf /var/lib/apt/lists/*

# Install global npm packages
RUN npm install -g ts-node

# Ensure Chrome is installed for Playwright (should already be in base image, but just in case)
RUN npx playwright install chrome

# Set default working directory
WORKDIR /app

# (Optional) Copy your project files into the image if you want a fully self-contained image
# COPY package.json package-lock.json ./
# RUN npm ci
# COPY . .

# Default command (can be overridden in GitHub Actions)
CMD ["node"]
