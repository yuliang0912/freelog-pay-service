'use strict'

module.exports = {

    web3: {rpcUri: 'http://39.108.77.211:8546'},

    gatewayUrl: "http://172.18.215.224:8895",

    mongoose: {
        url: "mongodb://root:Ff233109@dds-wz9b5420c30a27941546-pub.mongodb.rds.aliyuncs.com:3717,dds-wz9b5420c30a27942267-pub.mongodb.rds.aliyuncs.com:3717/pay?replicaSet=mgset-5016983"
    },

    rabbitMq: {
        connOptions: {
            host: '172.18.215.224',
            port: 5672,
            login: 'guest',
            password: 'guest',
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