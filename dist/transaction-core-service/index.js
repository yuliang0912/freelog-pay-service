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
     * 个人账户之间转账
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhbnNhY3Rpb24tY29yZS1zZXJ2aWNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1EQUF3RTtBQUV4RSwwQkFPWTtBQUVaLHFDQUFzQztBQUN0QyxtQ0FBNkI7QUFFN0IsdURBQWtEO0FBQ2xELG9DQUF1RDtBQUl2RCxJQUFhLHNCQUFzQixHQUFuQyxNQUFhLHNCQUFzQjtJQVEvQjs7Ozs7Ozs7T0FRRztJQUNILEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxRQUFrQixFQUFFLFdBQXdCLEVBQUUsU0FBc0IsRUFBRSxRQUFnQixFQUFFLGlCQUF5QixFQUFFLE1BQWU7UUFDOUosTUFBTSxJQUFJLEdBQVE7WUFDZCxRQUFRLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTTtZQUNyRSxxQkFBcUIsRUFBRSw2QkFBeUIsQ0FBQyxpQkFBaUI7U0FDckUsQ0FBQztRQUNGLElBQUksQ0FBQyw4QkFBOEIsR0FBRyxNQUFNLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRixNQUFNLGlCQUFpQixHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFO1lBQzVCLE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyxRQUFRLGlCQUFpQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ3hFO1FBQ0QsT0FBTyxjQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsa0NBQWtDLENBQUMsUUFBa0IsRUFBRSx1QkFBZ0Q7UUFDekcsTUFBTSxJQUFJLEdBQVE7WUFDZCxRQUFRLEVBQUUsdUJBQXVCO1lB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