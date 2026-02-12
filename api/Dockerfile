FROM node:22-alpine

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY ./ ./

RUN npm run build

# this removes the devDependencies 
RUN npm prune --production

CMD ["node", "build/server.js"]