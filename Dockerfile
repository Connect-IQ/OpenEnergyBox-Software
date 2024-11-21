# --- Step 1: Build the Vue.js frontend ---
FROM node:18-alpine as build-stage

# Set the working directory for the frontend build
WORKDIR /usr/src/app


# Install global Vite
RUN npm install -g vite

# Install dependencies for the frontend
COPY frontend/package*.json ./frontend/
RUN cd ./frontend && npm install

# Copy all frontend source files
COPY frontend/ ./frontend/

# Build the Vue.js app for production using the globally installed Vite
RUN cd ./frontend && vite build

# --- Step 2: Use Node.js Alpine image ---
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Add the node user to the dialout group to access serial devices
RUN apk add --no-cache shadow && usermod -aG dialout node
RUN apk add chromium
# Copy package.json and package-lock.json first for installing dependencies
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend source code
COPY backend/ ./

# Expose the port for the backend
EXPOSE 3000

# Command to start the backend
CMD ["npm", "start"]
