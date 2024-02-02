# Use a lightweight Node.js image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the Vite project
RUN npm run build

# Expose the port that Vite serves the app on
EXPOSE 4173

# Command to run the app
CMD ["npm", "run", "preview","--" ,"--host"]
