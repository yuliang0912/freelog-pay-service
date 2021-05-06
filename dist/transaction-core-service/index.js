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
exports.TransactionCoreService = void 0;
const decorator_1 = require("@midwayjs/decorator");
const __1 = require("..");
const typeorm_1 = require("typeorm");
const lodash_1 = require("lodash");
const egg_freelog_base_1 = require("egg-freelog-base");
const index_1 = require("../index");
let TransactionCoreService = class TransactionCoreService {
    /**
     * 个人账户转账
     * @param userInfo
     * @param fromAccount
     * @param toAccount
     * @param password
     * @param transactionAmount
     * @param remark
     */
    async individualAccountTransfer(userInfo, fromAccount, toAccount, password, transactionAmount, remark) {
        const args = {
            userInfo, fromAccount, toAccount, password, transactionAmount, remark,
            transactionHandleType: __1.TransactionHandleTypeEnum.ForthwithTransfer
        };
        args.transactionAuthorizationResult = await this.transactionAuthorizationAndAccountCheck(args);
        const transactionResult = await this.execTransaction(args);
        if (!transactionResult.success) {
            throw new egg_freelog_base_1.ApplicationError(`交易失败,${transactionResult.error?.error}`);
        }
        return lodash_1.first(transactionResult.result);
    }
    /**
     * 组织账号转账
     * @param fromAccount
     * @param toAccount
     * @param transactionAmount
     * @param signature
     * @param remark
     */
    async organizationAccountTransfer(fromAccount, toAccount, transactionAmount, signature, remark) {
        const args = {
            fromAccount, toAccount, transactionAmount, remark, signature,
            transactionHandleType: __1.TransactionHandleTypeEnum.ForthwithTransfer
        };
        args.signText = `fromAccountId_${fromAccount.accountId}_toAccountId_${toAccount.accountId}_transactionAmount_${transactionAmount}`;
        args.transactionAuthorizationResult = await this.transactionAuthorizationAndAccountCheck(args);
        const transactionResult = await this.execTransaction(args);
        if (!transactionResult.success) {
            throw new egg_freelog_base_1.ApplicationError(`交易失败,${transactionResult.error?.error}`);
        }
        return lodash_1.first(transactionResult.result);
    }
    /**
     * 待确认的合约支付
     * @param userInfo
     * @param contractTransactionInfo
     */
    async toBeConfirmedContractPaymentHandle(userInfo, contractTransactionInfo) {
        const args = {
            userInfo, contractTransactionInfo,
            fromAccount: contractTransactionInfo.fromAccount,
            toAccount: contractTransactionInfo.toAccount,
            password: contractTransactionInfo.password,
            transactionAmount: contractTransactionInfo.transactionAmount,
            remark: contractTransactionInfo.remark ?? '',
            transactionTypeEnum: __1.TransactionTypeEnum.ContractTransaction,
            transactionHandleType: __1.TransactionHandleTypeEnum.ToBeConfirmedContractPayment,
            attachInfo: {
                contractId: contractTransactionInfo.contractId,
                contractName: contractTransactionInfo.contractName,
                eventId: contractTransactionInfo.eventId
            }
        };
        args.transactionAuthorizationResult = await this.transactionAuthorizationAndAccountCheck(args);
        const transactionResult = await this.execTransaction(args);
        if (!transactionResult.success) {
            throw new egg_freelog_base_1.ApplicationError(`交易失败,${transactionResult.error?.error}`);
        }
        return lodash_1.first(transactionResult.result);
    }
    /**
     * 合约支付确认成功
     * @param transactionRecord
     * @param attachInfo
     */
    async contractPaymentConfirmCompletedHandle(transactionRecord, attachInfo) {
        const args = {
            transactionRecord, attachInfo,
            transactionHandleType: __1.TransactionHandleTypeEnum.ContractPaymentConfirmedSuccessful
        };
        args.toAccount = await this.accountRepository.findOne(transactionRecord.reciprocalAccountId);
        transactionRecord.attachInfo = attachInfo;
        const transactionResult = await this.execTransaction(args);
        if (!transactionResult.success) {
            throw new egg_freelog_base_1.ApplicationError(`交易失败,${transactionResult.error?.error}`);
        }
        return lodash_1.first(transactionResult.result);
    }
    /**
     * 合约支付确认取消
     * @param transactionRecord
     */
    async contractPaymentConfirmCanceledHandle(transactionRecord) {
        const args = {
            transactionRecord,
            transactionHandleType: __1.TransactionHandleTypeEnum.ContractPaymentConfirmedCancel
        };
        const transactionResult = await this.execTransaction(args);
        if (!transactionResult.success) {
            throw new egg_freelog_base_1.ApplicationError(`交易失败,${transactionResult.error?.error}`);
        }
        return lodash_1.first(transactionResult.result);
    }
    /**
     * 执行交易
     * @param args
     * @private
     */
    async execTransaction(args) {
        return typeorm_1.getConnection().transaction(async (manager) => {
            args.manager = manager;
            return this.transactionStages.waterfall({
                args,
                valves: ['transactionHandler', 'transactionRecordHandler', 'transactionDetailHandler', 'transactionNotificationHandler']
            });
        });
    }
    /**
     * 交易授权与账户状态签名余额等检查
     * @param args
     * @private
     */
    async transactionAuthorizationAndAccountCheck(args) {
        const checkResult = await this.transactionStages.concatSeries({
            valves: ['transactionAuthorizationHandler', 'transactionPreconditionChecker'],
            args: args
        });
        if (checkResult.success) {
            return lodash_1.first(checkResult.result);
        }
        if (checkResult.error?.error instanceof Error) {
            throw checkResult.error?.error;
        }
        return Promise.reject(new egg_freelog_base_1.ApplicationError(`交易失败,${checkResult?.error?.error}`));
    }
};
__decorate([
    index_1.InjectEntityModel(__1.AccountInfo),
    __metadata("design:type", index_1.Repository)
], TransactionCoreService.prototype, "accountRepository", void 0);
__decorate([
    decorator_1.Pipeline(['transactionAuthorizationHandler', 'transactionPreconditionChecker', 'transactionHandler', 'transactionRecordHandler', 'transactionDetailHandler', 'transactionNotificationHandler']),
    __metadata("design:type", Object)
], TransactionCoreService.prototype, "transactionStages", void 0);
TransactionCoreService = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton)
], TransactionCoreService);
exports.TransactionCoreService = TransactionCoreService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiRDov5bel5L2cL2ZyZWVsb2ctcGF5LXNlcnZpY2Uvc3JjLyIsInNvdXJjZXMiOlsidHJhbnNhY3Rpb24tY29yZS1zZXJ2aWNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1EQUF3RTtBQUV4RSwwQkFPWTtBQUVaLHFDQUFzQztBQUN0QyxtQ0FBNkI7QUFFN0IsdURBQWtEO0FBQ2xELG9DQUF1RDtBQUl2RCxJQUFhLHNCQUFzQixHQUFuQyxNQUFhLHNCQUFzQjtJQVEvQjs7Ozs7Ozs7T0FRRztJQUNILEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxRQUFrQixFQUFFLFdBQXdCLEVBQUUsU0FBc0IsRUFBRSxRQUFnQixFQUFFLGlCQUF5QixFQUFFLE1BQWU7UUFDOUosTUFBTSxJQUFJLEdBQVE7WUFDZCxRQUFRLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTTtZQUNyRSxxQkFBcUIsRUFBRSw2QkFBeUIsQ0FBQyxpQkFBaUI7U0FDckUsQ0FBQztRQUNGLElBQUksQ0FBQyw4QkFBOEIsR0FBRyxNQUFNLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRixNQUFNLGlCQUFpQixHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFO1lBQzVCLE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyxRQUFRLGlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ3hFO1FBQ0QsT0FBTyxjQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxLQUFLLENBQUMsMkJBQTJCLENBQUMsV0FBd0IsRUFBRSxTQUFzQixFQUFFLGlCQUF5QixFQUFFLFNB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