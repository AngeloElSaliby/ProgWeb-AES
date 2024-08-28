# Base image
FROM node:18

# Set working directory
WORKDIR /app/

# Copy backend files
COPY ./ ./

# Install dependencies

WORKDIR /app/backend

RUN npm install

# Build the backend 
RUN npm run build

# Expose the port the backend runs on
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
