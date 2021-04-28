/**
 * 交易类型
 */
export declare enum TransactionTypeEnum {
    /**
     * 转账
     */
    Transfer = 1,
    /**
     * 合约交易
     */
    ContractTransaction = 2
}
/**
 * 账户类型
 */
export declare enum AccountTypeEnum {
    /**
     * 普通个人账户
     */
    IndividualAccount = 1,
    /**
     * 合同账户
     */
    ContractAccount = 2,
    /**
     * 节点账户
     */
    NodeAccount = 3,
    /**
     * 机构组织账户
     */
    OrganizationAccount = 4
}
/**
 * 交易状态
 */
export declare enum TransactionStatusEnum {
    /**
     * 待合约服务确认
     */
    ToBeConfirmation = 1,
    /**
     * 交易完成
     */
    Completed = 2,
    /**
     * 交易关闭
     */
    Closed = 3
}
/**
 * 交易处理类型(内部使用)
 */
export declare enum TransactionHandleTypeEnum {
    /**
     * 即时转账
     */
    ForthwithTransfer = 1,
    /**
     * 待确认的合约支付
     */
    ToBeConfirmedContractPayment = 2,
    /**
     * 合约支付确认成功
     */
    ContractPaymentConfirmedSuccessful = 3,
    /**
     * 合约支付确认取消
     */
    ContractPaymentConfirmedCancel = 4,
    /**
     * 合约支付确认超时取消
     */
    ContractPaymentTimeOutCancel = 5
}
