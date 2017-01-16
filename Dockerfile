FROM node:6.2

COPY src /usr/src/app/src
COPY package.json /usr/src/app/

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN mkdir logs
RUN touch server.log
RUN npm install

VOLUME ["/usr/src/app/node_modules/","/usr/src/app/src"]

EXPOSE  9090
CMD ["forever", "src/main/server.js"]
