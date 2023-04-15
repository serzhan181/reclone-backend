FROM node:18 AS builder
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . ./app
RUN npm run build


FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start:prod"]

