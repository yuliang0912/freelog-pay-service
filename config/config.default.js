'use strict';

const fs = require('fs')

module.exports = {

    cluster: {
        listen: {port: 7055}
    },

    keys: '20ab72d9397ff78c5058a106c635f008',

    i18n: {
        enable: false
    },

    /**
     * 关闭安全防护
     */
    security: {
        xframe: {
            enable: false,
        },
        csrf: {
            enable: false,
        }
    },

    ua: {
        enable: true
    },

    middleware: ['errorHandler', 'identityAuthentication'],

    /**
     * mongoDB配置
     */
    mongoose: {
        url: "mongodb://127.0.0.1:27017/pay"
    },

    /**
     * 上传文件相关配置
     */
    uploadConfig: {
        aliOss: {
            enable: true,
            isCryptographic: true,
            accessKeyId: "TFRBSTRGcGNBRWdCWm05UHlON3BhY0tU",
            accessKeySecret: "M2NBYmRwQ1VESnpCa2ZDcnVzN1d2SXc1alhmNDNF",
            bucket: "freelog-shenzhen",
            internal: false,
            region: "oss-cn-shenzhen",
            timeout: 180000
        },
        amzS3: {}
    },


    multipart: {
        autoFields: true,
        defaultCharset: 'utf8',
        fieldNameSize: 100,
        fieldSize: '100kb',
        fields: 10,
        fileSize: '100mb',
        files: 10,
        fileExtensions: [],
        whitelist: (fileName) => true,
    },

    freelogBase: {
        retCodeEnum: {},
        errCodeEnum: {}
    },

    rabbitMq: {
        connOptions: {
            host: '192.168.164.165',
            port: 5672,
            login: 'guest',
            password: 'guest',
            authMechanism: 'AMQPLAIN',
            heartbeat: 300  //每5分钟保持一次连接
        },
        implOptions: {
            reconnect: true,
            reconnectBackoffTime: 10000  //10秒尝试连接一次
        },
        exchange: {
            name: 'freelog-pay-exchange',
        },
        queues: [
            {
                name: 'pay#inquire-payment-result',
                options: {autoDelete: false, durable: true},
                routingKeys: [
                    {
                        exchange: 'freelog-contract-exchange',
                        routingKey: 'inquire.payment.result'
                    }
                ]
            }
        ]
    },

    clientCredentialInfo: {
        clientId: 1006,
        publicKey: 'b278214cef0ee2a9e1abde166d29d141',
        privateKey: '4c2eab93e896a53ff3f2d3770ae97d77'
    },

    transactionAccountCountLimit: 5,

    customFileLoader: ['app/event-handler', 'app/mq-service/index.js'],

    RasSha256Key: {
        contractServiceAuth: {
            publicKey: fs.readFileSync('config/auth_key/contract_service_auth_public_key.pem').toString()
        }
    },
};
