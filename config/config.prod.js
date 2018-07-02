'use strict'

module.exports = appInfo => {

    return {

        web3: {
            rpcUri: 'http://39.108.77.211:8546'
        },

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
}