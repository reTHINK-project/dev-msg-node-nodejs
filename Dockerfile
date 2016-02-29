FROM node:5.4

ADD src /usr/src/app/src
ADD package.json /usr/src/app/
ADD config.js /usr/src/app/

WORKDIR /usr/src/app

RUN mkdir logs
RUN npm install

EXPOSE  10000
CMD ["node", "src/main/server.js"]
