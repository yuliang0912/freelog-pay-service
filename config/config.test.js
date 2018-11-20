'use strict'

module.exports = {

    cluster: {listen: {port: 5055}},

    web3: {rpcUri: 'http://172.18.215.231:8546'},

    gatewayUrl: "http://172.18.215.224:8895/test",

    mongoose: {
        url: "mongodb://172.18.215.231:27018/pay"
    },

    rabbitMq: {
        connOptions: {
            host: '172.18.215.231',
            port: 5673,
            login: 'test_user_pay',
            password: 'rabbit@freelog',
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