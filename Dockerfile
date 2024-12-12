# Stage 1: Build the Angular app
FROM node:latest AS build

# Set working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app code to /app
COPY . .

# Build the Angular app for production with SSR
RUN npm run build

# Stage 2: Create a production-ready image
FROM node:latest AS production

# Set working directory to /app
WORKDIR /app

# Copy the built Angular app from the previous stage
COPY --from=build /app/dist /app/dist

# Copy the server files (if any) from the build stage
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose port 4000 for the server
EXPOSE 4000

# Run the Angular app with SSR
CMD ["npm", "run", "serve:ssr"]