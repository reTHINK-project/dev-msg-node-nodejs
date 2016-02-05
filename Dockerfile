FROM node:5.4

ADD src /usr/src/app/src
ADD node_modules /usr/src/app/node_modules
ADD package.json /usr/src/app/
ADD config.js /usr/src/app/

WORKDIR /usr/src/app

RUN mkdir logs

EXPOSE  9090
CMD ["node", "src/main/server.js"]
