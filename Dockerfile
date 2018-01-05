FROM daocloud.io/node:8.5

MAINTAINER yuliang <yu.liang@freelog.com>

RUN mkdir -p /data/freelog-pay-service

WORKDIR /data/freelog-pay-service

COPY . /data/freelog-pay-service

RUN npm install

#ENV
#VOLUME ['/opt/logs','/data/logs']

ENV EGG_SERVER_ENV prod
ENV PORT 7055

EXPOSE 7055

CMD [ "npm", "start" ]
