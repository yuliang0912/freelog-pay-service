'use strict'

module.exports = appInfo => {

    return {

        web3: {
            rpcUri: 'http://39.108.77.211:8546'
        },

        gatewayUrl: "http://172.18.215.224:8895/test",

        mongoose: {
            url: "mongodb://172.18.215.229/pay"
        },

        rabbitMq: {
            connOptions: {
                host: '172.18.215.229',
                port: 5672,
                login: 'test_user_pay',
                password: 'test_user_2018',
                authMechanism: 'AMQPLAIN'
            }
        },

        /**
         * 上传文件相关配置
         */
        uploadConfig: {
            aliOss: {
                internal: true,
            },
            amzS3: {}
        },
    }
}