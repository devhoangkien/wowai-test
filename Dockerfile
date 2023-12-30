FROM node:16 as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install 
COPY . .

EXPOSE 50051 3000

CMD [ "npm", "start" ]