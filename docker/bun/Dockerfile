# Base image
FROM oven/bun:alpine

# Update the repositories
RUN apk update

# Install general build tools
RUN apk add --no-cache make

# Install C/C++ build tools
RUN apk add --no-cache gcc g++

# Install Python3
RUN apk add --no-cache python3

# Install libtool
RUN apk add --no-cache libtool

# Install autoconf
RUN apk add --no-cache autoconf

# Install automake
RUN apk add --no-cache automake

# FFmpeg for media processing
RUN apk add --no-cache ffmpeg

# Set working directory inside the container
WORKDIR /home/node/app

# Copy package.json and package-lock.json (if available) into the working directory
COPY package*.json ./

# Copy bun lock file
COPY bun*.lockb ./

# Install app dependencies
RUN bun install

# Copy the rest of the application into the working directory
COPY . .

# Start the app
CMD ["bun", "run", "start"]
