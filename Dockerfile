FROM node:6.2

COPY src /usr/src/app/src
COPY package.json /usr/src/app/

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN mkdir logs
RUN npm install

EXPOSE  9090
CMD ["node", "src/main/server.js"]
