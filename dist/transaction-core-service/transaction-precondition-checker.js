"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionPreconditionChecker = void 0;
const decorator_1 = require("@midwayjs/decorator");
const account_helper_1 = require("../extend/account-helper");
const __1 = require("..");
const egg_freelog_base_1 = require("egg-freelog-base");
const decimal_js_light_1 = require("decimal.js-light");
const transaction_helper_1 = require("../extend/transaction-helper");
let TransactionPreconditionChecker = class TransactionPreconditionChecker {
    constructor() {
        this.alias = 'transactionPreconditionChecker';
    }
    /**
     * 账户状态,签名,交易额度等检查
     * @param ctx
     */
    invoke(ctx) {
        const { transactionHandleType, transactionRecord, fromAccount, toAccount, transactionAmount } = ctx.args;
        switch (transactionHandleType) {
            case __1.TransactionHandleTypeEnum.ForthwithTransfer:
                return this.transactionPreconditionCheck(fromAccount, toAccount, transactionAmount);
            case __1.TransactionHandleTypeEnum.ToBeConfirmedContractPayment:
                return this.transactionPreconditionCheck(fromAccount, toAccount, transactionAmount);
            case __1.TransactionHandleTypeEnum.ContractPaymentConfirmedSuccessful:
            case __1.TransactionHandleTypeEnum.ContractPaymentTimeOutCancel:
            case __1.TransactionHandleTypeEnum.ContractPaymentConfirmedCancel:
                return this.contractPaymentConfirmedCheck(transactionRecord);
            default:
                return Promise.reject('不支持的交易处理类型');
        }
    }
    /**
     * 交易前置检查
     * @param fromAccount
     * @param toAccount
     * @param transactionAmount
     */
    async transactionPreconditionCheck(fromAccount, toAccount, transactionAmount) {
        this.accountStatusAndSignatureCheck(fromAccount);
        this.accountStatusAndSignatureCheck(toAccount);
        if (fromAccount.accountId === toAccount.accountId) {
            throw new egg_freelog_base_1.ApplicationError('发起方账户与收款方账户不能一致');
        }
        this.transactionAmountCheck(fromAccount, transactionAmount);
        return true;
    }
    /**
     * 合约支付确认前置检查
     * @param transactionRecord
     * @private
     */
    async contractPaymentConfirmedCheck(transactionRecord) {
        if (!transactionRecord) {
            throw new egg_freelog_base_1.ApplicationError('交易记录数据缺失');
        }
        this.transactionRecordSignatureVerify(transactionRecord);
        if (transactionRecord.status !== __1.TransactionStatusEnum.ToBeConfirmation) {
            throw new egg_freelog_base_1.LogicError('交易已处理,不能重复提交');
        }
        return true;
    }
    /**
     * 账户状态以及签名校验
     * @param accountInfo
     */
    accountStatusAndSignatureCheck(accountInfo) {
        if (!accountInfo) {
            throw new egg_freelog_base_1.ApplicationError('账户信息缺失');
        }
        if (accountInfo.status === 2) {
            throw new egg_freelog_base_1.ApplicationError(`账户${accountInfo.accountId}已被冻结,无法执行交易`);
        }
        else if (accountInfo.status !== 1) {
            throw new egg_freelog_base_1.ApplicationError(`账户${accountInfo.accountId}状态不正常,无法执行交易`);
        }
        const accountSignatureVerifyResult = this.accountHelper.accountSignatureVerify(accountInfo);
        if (!accountSignatureVerifyResult) {
            throw new egg_freelog_base_1.ApplicationError('账户签名校验失败,完整性校验失败,无法执行交易');
        }
        return true;
    }
    /**
     * 交易金额检查
     * @param fromAccountInfo
     * @param transactionAmount
     */
    transactionAmountCheck(fromAccountInfo, transactionAmount) {
        if (transactionAmount <= 0) {
            throw new egg_freelog_base_1.ApplicationError('交易金额不能小于0');
        }
        if (new decimal_js_light_1.Decimal(transactionAmount).gt(fromAccountInfo.balance)) {
            throw new egg_freelog_base_1.ApplicationError('账户余额不足,无法执行交易');
        }
        if (new decimal_js_light_1.Decimal(transactionAmount).gt(new decimal_js_light_1.Decimal(fromAccountInfo.balance).minus(fromAccountInfo.freezeBalance).toNumber())) {
            throw new egg_freelog_base_1.ApplicationError('账户可用余额不足(扣除冻结金额),无法执行交易');
        }
        return true;
    }
    /**
     * 交易记录签名校验
     * @param transactionRecord
     * @private
     */
    transactionRecordSignatureVerify(transactionRecord) {
        if (!this.transactionHelper.transactionRecordSignatureVerify(transactionRecord)) {
            throw new egg_freelog_base_1.ApplicationError('交易操作记录签名校验失败,完整性校验失败,无法执行交易');
        }
        return true;
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", account_helper_1.AccountHelper)
], TransactionPreconditionChecker.prototype, "accountHelper", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", transaction_helper_1.TransactionHelper)
], TransactionPreconditionChecker.prototype, "transactionHelper", void 0);
TransactionPreconditionChecker = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton)
], TransactionPreconditionChecker);
exports.TransactionPreconditionChecker = TransactionPreconditionChecker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tcHJlY29uZGl0aW9uLWNoZWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNhY3Rpb24tY29yZS1zZXJ2aWNlL3RyYW5zYWN0aW9uLXByZWNvbmRpdGlvbi1jaGVja2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRTtBQUN0RSw2REFBdUQ7QUFDdkQsMEJBQXdHO0FBQ3hHLHVEQUE4RDtBQUM5RCx1REFBeUM7QUFDekMscUVBQStEO0FBSS9ELElBQWEsOEJBQThCLEdBQTNDLE1BQWEsOEJBQThCO0lBQTNDO1FBT0ksVUFBSyxHQUFHLGdDQUFnQyxDQUFDO0lBdUc3QyxDQUFDO0lBckdHOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxHQUFxQjtRQUN4QixNQUFNLEVBQUMscUJBQXFCLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDdkcsUUFBUSxxQkFBa0QsRUFBRTtZQUN4RCxLQUFLLDZCQUF5QixDQUFDLGlCQUFpQjtnQkFDNUMsT0FBTyxJQUFJLENBQUMsNEJBQTRCLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3hGLEtBQUssNkJBQXlCLENBQUMsNEJBQTRCO2dCQUN2RCxPQUFPLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDeEYsS0FBSyw2QkFBeUIsQ0FBQyxrQ0FBa0MsQ0FBQztZQUNsRSxLQUFLLDZCQUF5QixDQUFDLDRCQUE0QixDQUFDO1lBQzVELEtBQUssNkJBQXlCLENBQUMsOEJBQThCO2dCQUN6RCxPQUFPLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ2pFO2dCQUNJLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZ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