# Load base image (node)
FROM node:12.2.0-alpine

# Set working directory
WORKDIR /etsin_finder/frontend/

# Bundle app source
COPY . .

# Install npm packages based on package.json (with global option)
RUN npm install -g

# Add a /build volume
VOLUME ["/build"]

# Make port available
EXPOSE 8080

# Start development-configured app (see the command scripts.start inside the file ./package.json for details)
CMD ["npm", "start"]
