"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionHandleTypeEnum = exports.TransactionStatusEnum = exports.AccountTypeEnum = exports.TransactionTypeEnum = void 0;
/**
 * 交易类型
 */
var TransactionTypeEnum;
(function (TransactionTypeEnum) {
    /**
     * 转账
     */
    TransactionTypeEnum[TransactionTypeEnum["Transfer"] = 1] = "Transfer";
    /**
     * 合约交易
     */
    TransactionTypeEnum[TransactionTypeEnum["ContractTransaction"] = 2] = "ContractTransaction";
})(TransactionTypeEnum = exports.TransactionTypeEnum || (exports.TransactionTypeEnum = {}));
/**
 * 账户类型
 */
var AccountTypeEnum;
(function (AccountTypeEnum) {
    /**
     * 普通个人账户
     */
    AccountTypeEnum[AccountTypeEnum["IndividualAccount"] = 1] = "IndividualAccount";
    /**
     * 合同账户
     */
    AccountTypeEnum[AccountTypeEnum["ContractAccount"] = 2] = "ContractAccount";
    /**
     * 节点账户
     */
    AccountTypeEnum[AccountTypeEnum["NodeAccount"] = 3] = "NodeAccount";
    /**
     * 机构组织账户
     */
    AccountTypeEnum[AccountTypeEnum["OrganizationAccount"] = 4] = "OrganizationAccount";
})(AccountTypeEnum = exports.AccountTypeEnum || (exports.AccountTypeEnum = {}));
/**
 * 交易状态
 */
var TransactionStatusEnum;
(function (TransactionStatusEnum) {
    /**
     * 待合约服务确认
     */
    TransactionStatusEnum[TransactionStatusEnum["ToBeConfirmation"] = 1] = "ToBeConfirmation";
    /**
     * 交易完成
     */
    TransactionStatusEnum[TransactionStatusEnum["Completed"] = 2] = "Completed";
    /**
     * 交易关闭
     */
    TransactionStatusEnum[TransactionStatusEnum["Closed"] = 3] = "Closed";
})(TransactionStatusEnum = exports.TransactionStatusEnum || (exports.TransactionStatusEnum = {}));
/**
 * 交易处理类型(内部使用)
 */
var TransactionHandleTypeEnum;
(function (TransactionHandleTypeEnum) {
    /**
     * 即时转账
     */
    TransactionHandleTypeEnum[TransactionHandleTypeEnum["ForthwithTransfer"] = 1] = "ForthwithTransfer";
    /**
     * 待确认的合约支付
     */
    TransactionHandleTypeEnum[TransactionHandleTypeEnum["ToBeConfirmedContractPayment"] = 2] = "ToBeConfirmedContractPayment";
    /**
     * 合约支付确认成功
     */
    TransactionHandleTypeEnum[TransactionHandleTypeEnum["ContractPaymentConfirmedSuccessful"] = 3] = "ContractPaymentConfirmedSuccessful";
    /**
     * 合约支付确认取消
     */
    TransactionHandleTypeEnum[TransactionHandleTypeEnum["ContractPaymentConfirmedCancel"] = 4] = "ContractPaymentConfirmedCancel";
    /**
     * 合约支付确认超时取消
     */
    TransactionHandleTypeEnum[TransactionHandleTypeEnum["ContractPaymentTimeOutCancel"] = 5] = "ContractPaymentTimeOutCancel";
})(TransactionHandleTypeEnum = exports.TransactionHandleTypeEnum || (exports.TransactionHandleTypeEnum = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bS5qcyIsInNvdXJjZVJvb3QiOiJEOi/lt6XkvZwvZnJlZWxvZy1wYXktc2VydmljZS9zcmMvIiwic291cmNlcyI6WyJlbnVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOztHQUVHO0FBQ0gsSUFBWSxtQkFXWDtBQVhELFdBQVksbUJBQW1CO0lBRTNCOztPQUVHO0lBQ0gscUVBQVksQ0FBQTtJQUVaOztPQUVHO0lBQ0gsMkZBQXVCLENBQUE7QUFDM0IsQ0FBQyxFQVhXLG1CQUFtQixHQUFuQiwyQkFBbUIsS0FBbkIsMkJBQW1CLFFBVzlCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLGVBb0JYO0FBcEJELFdBQVksZUFBZTtJQUN2Qjs7T0FFRztJQUNILCtFQUFxQixDQUFBO0lBRXJCOztPQUVHO0lBQ0gsMkVBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCxtRUFBZSxDQUFBO0lBRWY7O09BRUc7SUFDSCxtRkFBdUIsQ0FBQTtBQUMzQixDQUFDLEVBcEJXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBb0IxQjtBQUVEOztHQUVHO0FBQ0gsSUFBWSxxQkFlWDtBQWZELFdBQVkscUJBQXFCO0lBQzdCOztPQUVHO0lBQ0gseUZBQW9CLENBQUE7SUFFcEI7O09BRUc7SUFDSCwyRUFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCxxRUFBVSxDQUFBO0FBQ2QsQ0FBQyxFQWZXLHFCQUFxQixHQUFyQiw2QkFBcUIsS0FBckIsNkJBQXFCLFFBZWhDO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLHlCQTBCWDtBQTFCRCxXQUFZLHlCQUF5QjtJQUVqQzs7T0FFRztJQUNILG1HQUFxQixDQUFBO0lBRXJCOztPQUVHO0lBQ0gseUhBQWdDLENBQUE7SUFFaEM7O09BRUc7SUFDSCxxSUFBc0MsQ0FBQTtJQUV0Qzs7T0FFRztJQUNILDZIQUFrQyxDQUFBO0lBRWxDOztPQUVHO0lBQ0gseUhBQWdDLENBQUE7QUFDcEMsQ0FBQyxFQTFCVyx5QkFBeUIsR0FBekIsaUNBQXlCLEtBQXpCLGlDQUF5QixRQTBCcEMifQ==