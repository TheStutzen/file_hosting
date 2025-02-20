FROM node:20-alpine

RUN apk update && \
	apk upgrade && \
	apk add --no-cache bash git openssh make cmake g++ python3 ffmpeg;

WORKDIR /app
