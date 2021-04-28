import {EggAppInfo} from 'midway';
import {logLevel} from 'kafkajs';

export default (appInfo: EggAppInfo) => {
    const config: any = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name;

    config.cluster = {
        listen: {
            port: 7155
        }
    };

    config.i18n = {
        enable: true,
        defaultLocale: 'zh-CN'
    };

    config.middleware = ['errorAutoSnapHandler', 'gatewayIdentityInfoHandler'];

    config.static = {
        enable: false
    };

    config.security = {
        xframe: {
            enable: false,
        },
        csrf: {
            enable: false,
        }
    };

    config.kafka = {
        enable: true,
        clientId: 'freelog-pay-service',
        logLevel: logLevel.ERROR,
        brokers: ['192.168.164.165:9090']
    };

    return config;
};
