# Load base image (node)
FROM node:22

# Set working directory
WORKDIR /etsin_finder/frontend/

# Copy package data separately so npm install is run only when packages change
COPY package.json package-lock.json ./

# Install npm packages based on package.json
RUN --mount=type=cache,target=/root/.npm npm install

# Bundle app source
COPY --exclude=node_modules . .

# Add a /build volume
VOLUME ["/build"]

# Make port available
EXPOSE 8080

# Start development-configured app (see the command scripts.start inside the file ./package.json for details)
CMD ["npm", "run", "dev"]
