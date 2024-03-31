FROM node:18.12.0

WORKDIR /usr/src/app
COPY . .

RUN npm install

EXPOSE 3001

CMD ["node", "app.js"]