FROM node:22-alpine3.20

WORKDIR /usr/src/app

# Install PM2 globally
RUN npm install -g pm2

# Copy package files first (for better caching)
COPY package*.json ./

RUN npm ci --only=production

# Copy .env file and all other files
COPY .env ./
COPY . .

# Use PM2 to start the application
CMD ["pm2-runtime", "start", "production.config.json"]
