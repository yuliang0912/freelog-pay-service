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
exports.TransactionHandler = void 0;
const decorator_1 = require("@midwayjs/decorator");
const __1 = require("..");
const account_helper_1 = require("../extend/account-helper");
const decimal_js_light_1 = require("decimal.js-light");
const egg_freelog_base_1 = require("egg-freelog-base");
const lodash_1 = require("lodash");
let TransactionHandler = class TransactionHandler {
    constructor() {
        // 交易处理.此任务只负责账号信息维护
        this.alias = 'transactionHandler';
    }
    /**
     * 交易扣款,余额与签名等数据修改
     * @param ctx
     */
    async invoke(ctx) {
        const { manager, transactionHandleType, transactionRecord, fromAccount, toAccount, transactionAmount } = ctx.args;
        switch (transactionHandleType) {
            case __1.TransactionHandleTypeEnum.ForthwithTransfer:
                return this.forthwithTransferHandle(manager, fromAccount, toAccount, transactionAmount);
            case __1.TransactionHandleTypeEnum.ToBeConfirmedContractPayment:
                return this.toBeConfirmedPaymentHandler(manager, fromAccount, transactionAmount);
            case __1.TransactionHandleTypeEnum.ContractPaymentConfirmedSuccessful:
                return this.contractPaymentConfirmedSuccessful(manager, transactionRecord);
            case __1.TransactionHandleTypeEnum.ContractPaymentTimeOutCancel:
            case __1.TransactionHandleTypeEnum.ContractPaymentConfirmedCancel:
                return this.contractPaymentConfirmedCancel(manager, transactionRecord);
            default:
                return Promise.reject('不支持的交易处理类型');
        }
    }
    /**
     * 即时转账
     * @param manager
     * @param fromAccount
     * @param toAccount
     * @param transactionAmount
     * @private
     */
    async forthwithTransferHandle(manager, fromAccount, toAccount, transactionAmount) {
        const task1 = this.transaction(manager, fromAccount, -transactionAmount);
        const task2 = this.transaction(manager, toAccount, transactionAmount);
        const isTransactionSuccessful = await Promise.all([task1, task2]).then(list => list.every(x => x));
        if (!isTransactionSuccessful) {
            throw new egg_freelog_base_1.ApplicationError('交易失败,请稍后再试');
        }
        return true;
    }
    /**
     * 待确认的合约支付
     * @param manager
     * @param fromAccount
     * @param transactionAmount
     * @private
     */
    async toBeConfirmedPaymentHandler(manager, fromAccount, transactionAmount) {
        return this.transaction(manager, fromAccount, -transactionAmount);
    }
    /**
     * 合约支付确认成功
     * @param manager
     * @param transactionRecord
     * @private
     */
    async contractPaymentConfirmedSuccessful(manager, transactionRecord) {
        if (transactionRecord.status !== __1.TransactionStatusEnum.ToBeConfirmation) {
            throw new egg_freelog_base_1.LogicError('交易已被处理,无法重复处理');
        }
        const reciprocalAccountInfo = await manager.findOne(__1.AccountInfo, transactionRecord.reciprocalAccountId);
        return this.transaction(manager, reciprocalAccountInfo, -transactionRecord.transactionAmount);
    }
    /**
     * 合约支付确认取消
     * @param manager
     * @param transactionRecord
     * @private
     */
    async contractPaymentConfirmedCancel(manager, transactionRecord) {
        if (transactionRecord.status !== __1.TransactionStatusEnum.ToBeConfirmation) {
            throw new egg_freelog_base_1.LogicError('交易已被处理,无法重复处理');
        }
        const accountInfo = await manager.findOne(__1.AccountInfo, transactionRecord.accountId);
        return this.transaction(manager, accountInfo, -transactionRecord.transactionAmount);
    }
    /**
     * 执行交易操作
     * @param manager
     * @param accountInfo
     * @param transactionAmount
     * @private
     */
    async transaction(manager, accountInfo, transactionAmount) {
        // 此处深拷贝,是由于此函数需要改变对象的属性值,但是又不能影响到其他处理函数.
        accountInfo = lodash_1.cloneDeep(accountInfo);
        const oldSignature = accountInfo.signature;
        accountInfo.balance = new decimal_js_light_1.default(accountInfo.balance).add(transactionAmount).toFixed(2);
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo);
        return manager.update(__1.AccountInfo, {
            accountId: accountInfo.accountId, signature: oldSignature
        }, {
            balance: accountInfo.balance,
            signature: accountInfo.signature
        }).then(x => Boolean(x.affected));
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", account_helper_1.AccountHelper)
], TransactionHandler.prototype, "accountHelper", void 0);
TransactionHandler = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton)
], TransactionHandler);
exports.TransactionHandler = TransactionHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24taGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiJEOi/lt6XkvZwvZnJlZWxvZy1wYXktc2VydmljZS9zcmMvIiwic291cmNlcyI6WyJ0cmFuc2FjdGlvbi1jb3JlLXNlcnZpY2UvdHJhbnNhY3Rpb24taGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSxtREFBc0U7QUFDdEUsMEJBQXdHO0FBRXhHLDZEQUF1RDtBQUN2RCx1REFBdUM7QUFDdkMsdURBQThEO0FBQzlELG1DQUFpQztBQUlqQyxJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFrQjtJQUEvQjtRQUtJLG9CQUFvQjtRQUNwQixVQUFLLEdBQUcsb0JBQW9CLENBQUM7SUF5R2pDLENBQUM7SUF2R0c7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFxQjtRQUM5QixNQUFNLEVBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ2hILFFBQVEscUJBQWtELEVBQUU7WUFDeEQsS0FBSyw2QkFBeUIsQ0FBQyxpQkFBaUI7Z0JBQzVDLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDNUYsS0FBSyw2QkFBeUIsQ0FBQyw0QkFBNEI7Z0JBQ3ZELE9BQU8sSUFBSSxDQUFDLDJCQUEyQixDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUNyRixLQUFLLDZCQUF5QixDQUFDLGtDQUFrQztnQkFDN0QsT0FBTyxJQUFJLENBQUMsa0NBQWtDLENBQUMsT0FBTyxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDL0UsS0FBSyw2QkFBeUIsQ0FBQyw0QkFBNEIsQ0FBQztZQUM1RCxLQUFLLDZCQUF5QixDQUFDLDhC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