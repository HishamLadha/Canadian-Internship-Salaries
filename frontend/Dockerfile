# Using Node 20
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Expose the port that Next.js is running on
EXPOSE 3000

# Run the app
CMD ["npm", "run", "dev"]