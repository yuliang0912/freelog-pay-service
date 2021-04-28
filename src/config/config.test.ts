import {logLevel} from 'kafkajs';

export default () => {
    const config: any = {};

    config.cluster = {
        listen: {
            port: 5056
        }
    };

    config.orm = {
        type: 'mysql',
        host: 'mysql-test.common',
        port: 3306,
        username: 'root',
        password: 'f233109!',
        database: 'freelog-accounts',
        synchronize: true,
        logging: true,
        timezone: '+08:00',
    };

    config.kafka = {
        enable: true,
        clientId: 'freelog-pay-service',
        logLevel: logLevel.ERROR,
        brokers: ['kafka-svc.common:9093']
    };

    return config;
};
