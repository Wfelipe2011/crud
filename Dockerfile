FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN cd front && npm ci && npm run build && cd ..

RUN npx prisma generate

CMD [ "npm", "run", "start:dev" ]