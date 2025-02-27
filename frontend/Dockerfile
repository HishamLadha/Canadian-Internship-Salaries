# Using Node 20
FROM node:20

# Copy the package.json and package-lock.json
COPY package*.json ./

# Set the working directory
WORKDIR /app

# Install the dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# # Build the Next.js app
RUN npm run build

# Expose the port that Next.js is running on
EXPOSE 3000

# # Run the app in production mode
CMD ["npm", "start"]

#Run the app
# CMD ["npm", "run", "dev"]