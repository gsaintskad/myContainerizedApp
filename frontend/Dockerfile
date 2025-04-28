# Use an official Node runtime as a parent image
FROM node:22-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
# Ensure package-lock.json is committed to your repository
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Make port 5173 available to the world outside this container
EXPOSE 5173

# Run the app when the container launches using Vite's development server
# The --host flag is important to make the server accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]