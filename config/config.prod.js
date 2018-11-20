'use strict'

module.exports = {

    web3: {rpcUri: 'http://172.18.215.231:8545'},

    gatewayUrl: "http://172.18.215.224:8895",

    mongoose: {
        url: "mongodb://172.18.215.231:27017/pay"
    },

    rabbitMq: {
        connOptions: {
            host: '172.18.215.231',
            port: 5672,
            login: 'prod_user_pay',
            password: 'rabbit@freelog',
            authMechanism: 'AMQPLAIN'
        }
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
            internal: true,
            region: "oss-cn-shenzhen",
            timeout: 180000
        },
        amzS3: {}
    },
}