FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY backend ./backend
COPY frontend ./frontend
RUN mkdir -p backend/data
EXPOSE 3000
CMD ["npm", "start"]
