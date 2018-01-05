/**
 * Created by yuliang on 2017/9/11.
 */

'use strict'

module.exports = {

    /**
     * 创建合同事件
     * 结算中心关心此事件,然后根据创建的合同数据来提取结算相关信息
     * @param message
     * @param headers
     * @param deliveryInfo
     * @param messageObject
     */
    createContractHandler(message, headers, deliveryInfo, messageObject){
        /**
         * 根据合同数据分析是否注册结算服务,如果不是周期结算,则忽略
         */

        /**
         * {
                "contractId": "string",
                "payType": 1,
                "cycle": "int",
                "cycleType": "int",
                "nextSettlementDate": "date",
                "startSettlementDate": "data",
                "endSettlementDate": "data",
                "userOne": "int",
                "userTwo": "int",
                "totalAmount": "decimal",
                "actualAmount": "decimal",
                "createDate": "date",
                "updateDate": "date"
            }
         */

        console.log(message)
    }
}