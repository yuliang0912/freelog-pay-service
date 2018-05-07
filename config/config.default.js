'use strict';


module.exports = appInfo => {

    const config = {

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

        middleware: ['errorHandler', 'identiyAuthentication'],


        /**
         * mongoDB配置
         */
        mongo: {
            uri: "mongodb://192.168.2.239:27017/pay"
        },

        /**
         * 上传文件相关配置
         */
        uploadConfig: {
            aliOss: {
                enable: true,
                accessKeyId: "LTAIy8TOsSnNFfPb",
                accessKeySecret: "Bt5yMbW89O7wMTVQsNUfvYfou5GPsL",
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

        gatewayUrl: "http://api.freelog.com",

        rabbitMq: {
            connOptions: {
                host: '127.0.0.1',
                port: 5672,
                login: 'guest',
                password: 'guest',
                authMechanism: 'AMQPLAIN'
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
                    name: '[pay]-auth-event-handle-result',
                    options: {autoDelete: false, durable: true},
                    routingKeys: [
                        //订阅本服务发送出去的支付合同事件的执行结果
                        {
                            exchange: 'freelog-contract-exchange',
                            routingKey: 'auth.event.handle.result.pay.payment.contract'
                        }
                    ]
                }
            ]
        },

        web3: {
            rpcUri: 'http://localhost:8545'
        },


        clientCredentialInfo: {
            clientId: 1006,
            publicKey: 'b278214cef0ee2a9e1abde166d29d141',
            privateKey: '4c2eab93e896a53ff3f2d3770ae97d77'
        }
    }

    return config;
};
