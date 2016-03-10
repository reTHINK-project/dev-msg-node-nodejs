FROM node:5.4

ADD src /usr/src/app/src
ADD package.json /usr/src/app/

WORKDIR /usr/src/app

RUN mkdir logs
RUN npm install

EXPOSE  9090
CMD ["node", "src/main/server.js"]
