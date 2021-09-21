FROM node:14
WORKDIR /usr/src/app
RUN npm install pm2 -g
RUN pm2 install profiler


COPY package.json .
COPY package-lock.json .

RUN npm i --only=prod

COPY pm2.json ./

CMD ["pm2-runtime", "pm2.json"]
