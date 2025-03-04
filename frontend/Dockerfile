# Using Node 20
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Accept a build argument (default: development)
ARG NODE_ENV=development
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY


# Run `npm run build` only if building for production
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Expose the Next.js port
EXPOSE 3000

# Use a dynamic CMD to switch between dev and production
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm start; else npm run dev; fi"]
