# Use official image Node.js 20 image as the base
FROM node:20

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache for dependencies
COPY package*.json ./

# Install project dependencies (npm install)
RUN npm install

# Copy the rest of the application source code to container
COPY . .

# Expose the port the app runs
EXPOSE 3000

# Command to run app (node index.js)
CMD ["node", "index.js"]
