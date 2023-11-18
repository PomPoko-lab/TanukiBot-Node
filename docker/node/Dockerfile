FROM node:16

WORKDIR /home/node/app

# Update package list and install ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN npm install pnpm -g