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
exports.TransactionDetailHandler = void 0;
const decorator_1 = require("@midwayjs/decorator");
const __1 = require("..");
const decimal_js_light_1 = require("decimal.js-light");
const transaction_helper_1 = require("../extend/transaction-helper");
const lodash_1 = require("lodash");
let TransactionDetailHandler = class TransactionDetailHandler {
    constructor() {
        this.alias = 'transactionDetailHandler';
    }
    /**
     * 保存交易记录
     * @param ctx
     */
    async invoke(ctx) {
        const transactionRecord = ctx.info.prevValue;
        const { manager, toAccount, fromAccount, transactionHandleType } = ctx.args;
        switch (transactionHandleType) {
            case __1.TransactionHandleTypeEnum.ForthwithTransfer:
                return this.createBidirectionalTransactionDetail(manager, fromAccount, toAccount, transactionRecord);
            case __1.TransactionHandleTypeEnum.ToBeConfirmedContractPayment:
                return this.createToBeConfirmationTransactionDetail(manager, fromAccount, transactionRecord);
            case __1.TransactionHandleTypeEnum.ContractPaymentConfirmedSuccessful:
                return this.contractPaymentConfirmedSuccessfulHandle(manager, toAccount, transactionRecord);
            case __1.TransactionHandleTypeEnum.ContractPaymentTimeOutCancel:
            case __1.TransactionHandleTypeEnum.ContractPaymentConfirmedCancel:
                return this.contractPaymentConfirmedCancelHandle(manager, transactionRecord);
            default:
                return Promise.reject('不支持的交易处理类型');
        }
    }
    /**
     * 合约支付确认成功处理
     * @param manager
     * @param toAccountInfo
     * @param transactionRecord
     * @private
     */
    async contractPaymentConfirmedSuccessfulHandle(manager, toAccountInfo, transactionRecord) {
        const expenditureTransactionDetail = await manager.findOne(__1.TransactionDetailInfo, {
            transactionRecordId: transactionRecord.recordId,
            accountId: transactionRecord.accountId
        });
        expenditureTransactionDetail.updateDate = new Date();
        expenditureTransactionDetail.attachInfo = transactionRecord.attachInfo;
        expenditureTransactionDetail.status = __1.TransactionStatusEnum.Completed;
        expenditureTransactionDetail.signature = this.transactionHelper.transactionDetailSignature(expenditureTransactionDetail);
        await manager.update(__1.TransactionDetailInfo, { serialNo: expenditureTransactionDetail.serialNo }, lodash_1.pick(expenditureTransactionDetail, ['attachInfo', 'status', 'signature']));
        const incomeTransactionDetail = {
            transactionRecordId: transactionRecord.recordId,
            accountId: transactionRecord.reciprocalAccountId,
            accountName: transactionRecord.reciprocalAccountName,
            accountType: transactionRecord.reciprocalAccountType,
            reciprocalAccountId: transactionRecord.accountId,
            reciprocalAccountName: transactionRecord.accountName,
            reciprocalAccountType: transactionRecord.accountType,
            transactionAmount: -transactionRecord.transactionAmount,
            beforeBalance: toAccountInfo.balance,
            afterBalance: new decimal_js_light_1.default(toAccountInfo.balance).add(-transactionRecord.transactionAmount).toFixed(2),
            transactionType: transactionRecord.transactionType,
            status: __1.TransactionStatusEnum.Completed,
            attachInfo: transactionRecord.attachInfo
        };
        await this.saveTransactionDetails(manager, [incomeTransactionDetail]);
        return [expenditureTransactionDetail, incomeTransactionDetail];
    }
    /**
     * 合约支付确认取消处理
     * @param manager
     * @param transactionRecordInfo
     * @private
     */
    async contractPaymentConfirmedCancelHandle(manager, transactionRecordInfo) {
        const expenditureTransactionDetail = await manager.findOne(__1.TransactionDetailInfo, {
            transactionRecordId: transactionRecordInfo.recordId,
            accountId: transactionRecordInfo.accountId
        });
        expenditureTransactionDetail.updateDate = new Date();
        expenditureTransactionDetail.status = __1.TransactionStatusEnum.Closed;
        expenditureTransactionDetail.signature = this.transactionHelper.transactionDetailSignature(expenditureTransactionDetail);
        await manager.update(__1.TransactionDetailInfo, { serialNo: expenditureTransactionDetail.serialNo }, lodash_1.pick(expenditureTransactionDetail, ['status', 'signature']));
        return [expenditureTransactionDetail];
    }
    /**
     * 保存待确认中的交易明细
     * @param manager
     * @param fromAccountInfo
     * @param transactionRecordInfo
     * @private
     */
    async createToBeConfirmationTransactionDetail(manager, fromAccountInfo, transactionRecordInfo) {
        const transactionDetailInfo = {
            transactionRecordId: transactionRecordInfo.recordId,
            accountId: transactionRecordInfo.accountId,
            accountType: transactionRecordInfo.accountType,
            accountName: transactionRecordInfo.accountName,
            reciprocalAccountId: transactionRecordInfo.reciprocalAccountId,
            reciprocalAccountName: transactionRecordInfo.reciprocalAccountName,
            reciprocalAccountType: transactionRecordInfo.reciprocalAccountType,
            transactionAmount: transactionRecordInfo.transactionAmount,
            beforeBalance: fromAccountInfo.balance,
            afterBalance: new decimal_js_light_1.default(fromAccountInfo.balance).add(transactionRecordInfo.transactionAmount).toFixed(2),
            transactionType: transactionRecordInfo.transactionType,
            status: __1.TransactionStatusEnum.ToBeConfirmation,
            attachInfo: transactionRecordInfo.attachInfo,
            remark: transactionRecordInfo.remark ?? ''
        };
        return this.saveTransactionDetails(manager, [transactionDetailInfo]);
    }
    /**
     * 创建双向交易记录(交易完成时,入账和出账记录同时生成)
     * @param manager
     * @param fromAccountInfo
     * @param toAccountInfo
     * @param transactionRecordInfo
     * @private
     */
    async createBidirectionalTransactionDetail(manager, fromAccountInfo, toAccountInfo, transactionRecordInfo) {
        const expenditureTransactionDetail = {
            transactionRecordId: transactionRecordInfo.recordId,
            accountId: transactionRecordInfo.accountId,
            accountType: transactionRecordInfo.accountType,
            accountName: transactionRecordInfo.accountName,
            reciprocalAccountId: transactionRecordInfo.reciprocalAccountId,
            reciprocalAccountName: transactionRecordInfo.reciprocalAccountName,
            reciprocalAccountType: transactionRecordInfo.reciprocalAccountType,
            transactionAmount: transactionRecordInfo.transactionAmount,
            beforeBalance: fromAccountInfo.balance,
            afterBalance: new decimal_js_light_1.default(fromAccountInfo.balance).add(transactionRecordInfo.transactionAmount).toFixed(2),
            transactionType: transactionRecordInfo.transactionType,
            status: __1.TransactionStatusEnum.Completed,
            attachInfo: transactionRecordInfo.attachInfo,
            remark: transactionRecordInfo.remark ?? ''
        };
        const incomeTransactionDetail = {
            transactionRecordId: transactionRecordInfo.recordId,
            accountId: transactionRecordInfo.reciprocalAccountId,
            accountName: transactionRecordInfo.reciprocalAccountName,
            accountType: transactionRecordInfo.reciprocalAccountType,
            reciprocalAccountId: transactionRecordInfo.accountId,
            reciprocalAccountName: transactionRecordInfo.accountName,
            reciprocalAccountType: transactionRecordInfo.accountType,
            transactionAmount: -transactionRecordInfo.transactionAmount,
            beforeBalance: toAccountInfo.balance,
            afterBalance: new decimal_js_light_1.default(toAccountInfo.balance).add(-transactionRecordInfo.transactionAmount).toFixed(2),
            transactionType: transactionRecordInfo.transactionType,
            status: __1.TransactionStatusEnum.Completed,
            attachInfo: transactionRecordInfo.attachInfo
        };
        return this.saveTransactionDetails(manager, [expenditureTransactionDetail, incomeTransactionDetail]);
    }
    /**
     * 保存交易记录数据
     * @param manager
     * @param transactionDetails
     * @private
     */
    async saveTransactionDetails(manager, transactionDetails) {
        for (const transactionDetailInfo of transactionDetails) {
            transactionDetailInfo.serialNo = this.transactionHelper.generateSnowflakeId().toString();
            transactionDetailInfo.saltValue = this.transactionHelper.generateSaltValue();
            transactionDetailInfo.signature = this.transactionHelper.transactionDetailSignature(transactionDetailInfo);
        }
        await manager.insert(__1.TransactionDetailInfo, transactionDetails);
        return transactionDetails;
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", transaction_helper_1.TransactionHelper)
], TransactionDetailHandler.prototype, "transactionHelper", void 0);
TransactionDetailHandler = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton)
], TransactionDetailHandler);
exports.TransactionDetailHandler = TransactionDetailHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tZGV0YWlsLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNhY3Rpb24tY29yZS1zZXJ2aWNlL3RyYW5zYWN0aW9uLWRldGFpbC1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRTtBQUV0RSwwQkFHWTtBQUNaLHVEQUF1QztBQUN2QyxxRUFBK0Q7QUFDL0QsbUNBQTRCO0FBSTVCLElBQWEsd0JBQXdCLEdBQXJDLE1BQWEsd0JBQXdCO0lBQXJDO1FBS0ksVUFBSyxHQUFHLDBCQUEwQixDQUFDO0lBcUx2QyxDQUFDO0lBbkxHOzs7T0FHRztJQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBcUI7UUFFOUIsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQWtDLENBQUM7UUFDdEUsTUFBTSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLHFCQUFxQixFQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztRQUMxRSxRQUFRLHFCQUFrRCxFQUFFO1lBQ3hELEtBQUssNkJBQXlCLENBQUMsaUJBQWlCO2dCQUM1QyxPQUFPLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3pHLEtBQUssNkJBQXlCLENBQUMsNEJBQTRCO2dCQUN2RCxPQUFPLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixDQUFDLENBQUE7WUFDaEcsS0FBSyw2QkFBeUIsQ0FBQyxrQ0FBa0M7Z0JBQzdELE9BQU8sSUFBSSxDQUFDLHdDQUF3QyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUNoRyxLQUFLLDZCQUF5QixDQUFDLDRCQUE0QixDQUFDO1lBQzVELEtBQUssNkJBQXlCLENBQUMs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