FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install\
    && npm install typescript -g
COPY . .
COPY tsconfig.json ./
RUN npm run build


FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]