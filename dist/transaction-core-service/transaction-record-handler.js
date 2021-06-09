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
exports.TransactionRecordHandler = void 0;
const decorator_1 = require("@midwayjs/decorator");
const __1 = require("..");
const transaction_helper_1 = require("../extend/transaction-helper");
const lodash_1 = require("lodash");
let TransactionRecordHandler = class TransactionRecordHandler {
    constructor() {
        // 交易记录处理
        this.alias = 'transactionRecordHandler';
    }
    /**
     * 保存交易记录
     * @param ctx
     */
    async invoke(ctx) {
        const { manager, transactionRecord, toAccount, fromAccount, transactionAmount, transactionAuthorizationResult, transactionHandleType, remark, attachInfo } = ctx.args;
        switch (transactionHandleType) {
            case __1.TransactionHandleTypeEnum.ForthwithTransfer:
                return this.createTransactionRecord(manager, fromAccount, toAccount, transactionAmount, __1.TransactionTypeEnum.Transfer, transactionAuthorizationResult, __1.TransactionStatusEnum.Completed, remark, ctx.args.digest ?? '转账', attachInfo);
            case __1.TransactionHandleTypeEnum.ToBeConfirmedContractPayment:
                const subjectTypeName = attachInfo.subjectType === 1 ? '资源' : attachInfo.subjectType === 2 ? '展品' : attachInfo.subjectType === 3 ? '用户组' : '其他';
                const digest = `${subjectTypeName}-${attachInfo.contractName}`;
                return this.createTransactionRecord(manager, fromAccount, toAccount, transactionAmount, __1.TransactionTypeEnum.ContractTransaction, transactionAuthorizationResult, __1.TransactionStatusEnum.ToBeConfirmation, remark, digest, attachInfo);
            case __1.TransactionHandleTypeEnum.ContractPaymentConfirmedSuccessful:
                return this.updateTransactionRecord(manager, transactionRecord, __1.TransactionStatusEnum.Completed);
            case __1.TransactionHandleTypeEnum.ContractPaymentTimeOutCancel:
            case __1.TransactionHandleTypeEnum.ContractPaymentConfirmedCancel:
                return this.updateTransactionRecord(manager, transactionRecord, __1.TransactionStatusEnum.Closed);
            default:
                return Promise.reject('不支持的交易处理类型');
        }
    }
    /**
     * 创建交易记录
     * @param manager
     * @param fromAccount
     * @param toAccount
     * @param transactionAmount
     * @param transactionType
     * @param transactionAuthorizationResult
     * @param transactionStatus
     * @param remark
     * @param digest
     * @param attachInfo
     * @private
     */
    async createTransactionRecord(manager, fromAccount, toAccount, transactionAmount, transactionType, transactionAuthorizationResult, transactionStatus, remark, digest, attachInfo) {
        const confirmTimeoutDate = new Date();
        confirmTimeoutDate.setDate(confirmTimeoutDate.getDate() + 2);
        const transactionRecordInfo = {
            recordId: this.transactionHelper.generateSnowflakeId().toString(),
            accountId: fromAccount.accountId,
            accountType: fromAccount.accountType,
            accountName: fromAccount.accountName,
            reciprocalAccountId: toAccount.accountId,
            reciprocalAccountName: toAccount.accountName,
            reciprocalAccountType: toAccount.accountType,
            transactionAmount: -transactionAmount,
            transactionType: transactionType,
            remark: remark ?? '',
            digest: digest ?? '',
            operatorId: transactionAuthorizationResult.operatorId,
            operatorName: transactionAuthorizationResult.operatorName,
            authorizationType: transactionAuthorizationResult.authorizationType,
            confirmTimeoutDate: confirmTimeoutDate,
            attachInfo: attachInfo ?? {},
            status: transactionStatus,
        };
        transactionRecordInfo.saltValue = this.transactionHelper.generateSaltValue();
        transactionRecordInfo.signature = this.transactionHelper.transactionRecordSignature(transactionRecordInfo);
        await manager.insert(__1.TransactionRecordInfo, transactionRecordInfo);
        return transactionRecordInfo;
    }
    /**
     * 修改交易记录
     * @param manager
     * @param transactionRecord
     * @param transactionStatus
     * @private
     */
    async updateTransactionRecord(manager, transactionRecord, transactionStatus) {
        transactionRecord = lodash_1.cloneDeep(transactionRecord);
        transactionRecord.status = transactionStatus;
        transactionRecord.signature = this.transactionHelper.transactionRecordSignature(transactionRecord);
        await manager.update(__1.TransactionRecordInfo, transactionRecord.recordId, {
            status: transactionRecord.status,
            signature: transactionRecord.signature,
            attachInfo: transactionRecord.attachInfo,
        });
        return transactionRecord;
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", transaction_helper_1.TransactionHelper)
], TransactionRecordHandler.prototype, "transactionHelper", void 0);
TransactionRecordHandler = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton)
], TransactionRecordHandler);
exports.TransactionRecordHandler = TransactionRecordHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tcmVjb3JkLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiRDov5bel5L2cL2ZyZWVsb2ctcGF5LXNlcnZpY2Uvc3JjLyIsInNvdXJjZXMiOlsidHJhbnNhY3Rpb24tY29yZS1zZXJ2aWNlL3RyYW5zYWN0aW9uLXJlY29yZC1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLG1EQUFzRTtBQUV0RSwwQkFJWTtBQUNaLHFFQUErRDtBQUMvRCxtQ0FBaUM7QUFJakMsSUFBYSx3QkFBd0IsR0FBckMsTUFBYSx3QkFBd0I7SUFBckM7UUFLSSxTQUFTO1FBQ1QsVUFBSyxHQUFHLDBCQUEwQixDQUFDO0lBNEZ2QyxDQUFDO0lBMUZHOzs7T0FHRztJQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBcUI7UUFFOUIsTUFBTSxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLDhCQUE4QixFQUFFLHFCQUFxQixFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ3BLLFFBQVEscUJBQWtELEVBQUU7WUFDeEQsS0FBSyw2QkFBeUIsQ0FBQyxpQkFBaUI7Z0JBQzVDLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLHVCQUFtQixDQUFDLFFBQVEsRUFBRSw4QkFBOEIsRUFBRSx5QkFBcUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN4TyxLQUFLLDZCQUF5QixDQUFDLDRCQUE0QjtnQkFDdkQsTUFBTSxlQUFlLEdBQUcsVUFBVSxDQUFDLFdBQVcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFD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