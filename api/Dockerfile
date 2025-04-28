FROM node:22-alpine
# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
# Copy only these files first to leverage Docker cache for dependencies
COPY ./package*.json ./

# Install app dependencies
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source inside the api directory
COPY ./ .

# Your app binds to port 3000, so expose it
EXPOSE 3000

# Define the command to run your app using node
CMD [ "node", "index.js" ]