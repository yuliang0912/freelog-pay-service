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
exports.TransactionService = void 0;
const decorator_1 = require("@midwayjs/decorator");
const abstract_base_service_1 = require("./abstract-base-service");
const __1 = require("..");
const egg_freelog_base_1 = require("egg-freelog-base");
const transaction_core_service_1 = require("../transaction-core-service");
let TransactionService = class TransactionService extends abstract_base_service_1.BaseService {
    constructorBaseService() {
        super.tableAlias = 'record';
        super.repository = this.transactionRecordRepository;
    }
    /**
     * 个人账号转账
     * @param fromAccount
     * @param toAccount
     * @param password
     * @param transactionAmount
     * @param remark
     */
    async individualAccountTransfer(fromAccount, toAccount, password, transactionAmount, remark) {
        return this.transactionCoreService.individualAccountTransfer(this.ctx.identityInfo.userInfo, fromAccount, toAccount, password, transactionAmount, remark);
    }
    /**
     * 待确认的合约支付
     * @param fromAccount
     * @param toAccount
     * @param password
     * @param transactionAmount
     * @param contractId
     * @param contractName
     * @param eventId
     * @param signature
     */
    async toBeConfirmedContractPayment(fromAccount, toAccount, password, transactionAmount, contractId, contractName, eventId, signature) {
        const contractTransactionInfo = {
            fromAccount, toAccount, password, contractId, contractName, eventId, transactionAmount
        };
        return this.transactionCoreService.toBeConfirmedContractPaymentHandle(this.ctx.identityInfo.userInfo, contractTransactionInfo);
    }
    /**
     * 合约支付确认成功
     * @param transactionRecord
     * @param stateId
     */
    async contractPaymentConfirmedSuccessful(transactionRecord, stateId) {
        if (transactionRecord.status !== __1.TransactionStatusEnum.ToBeConfirmation) {
            throw new egg_freelog_base_1.LogicError('只有处理中的交易才允许做确认操作');
        }
        const attachInfo = Object.assign({}, transactionRecord.attachInfo, { stateId });
        return this.transactionCoreService.contractPaymentConfirmCompletedHandle(transactionRecord, attachInfo);
    }
    /**
     * 合约支付确认成功
     * @param transactionRecord
     */
    async contractPaymentConfirmedCancel(transactionRecord) {
        if (transactionRecord.status !== __1.TransactionStatusEnum.ToBeConfirmation) {
            throw new egg_freelog_base_1.LogicError('只有处理中的交易才允许做确认操作');
        }
        return this.transactionCoreService.contractPaymentConfirmCanceledHandle(transactionRecord);
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], TransactionService.prototype, "ctx", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", transaction_core_service_1.TransactionCoreService)
], TransactionService.prototype, "transactionCoreService", void 0);
__decorate([
    __1.InjectEntityModel(__1.AccountInfo),
    __metadata("design:type", __1.Repository)
], TransactionService.prototype, "accountRepository", void 0);
__decorate([
    __1.InjectEntityModel(__1.TransactionRecordInfo),
    __metadata("design:type", __1.Repository)
], TransactionService.prototype, "transactionRecordRepository", void 0);
__decorate([
    __1.InjectEntityModel(__1.TransactionDetailInfo),
    __metadata("design:type", __1.Repository)
], TransactionService.prototype, "transactionDetailRepository", void 0);
__decorate([
    decorator_1.Init(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TransactionService.prototype, "constructorBaseService", null);
TransactionService = __decorate([
    decorator_1.Provide()
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlL3RyYW5zYWN0aW9uLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbURBQTBEO0FBQzFELG1FQUFvRDtBQUNwRCwwQkFHWTtBQUNaLHVEQUE0RDtBQUM1RCwwRUFBbUU7QUFHbkUsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBbUIsU0FBUSxtQ0FBa0M7SUFjdEUsc0JBQXNCO1FBQ2xCLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzVCLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDO0lBQ3hELENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsS0FBSyxDQUFDLHlCQUF5QixDQUFDLFdBQXdCLEVBQUUsU0FBc0IsRUFBRSxRQUFnQixFQUFFLGlCQUF5QixFQUFFLE1BQWU7UUFDMUksT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlKLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gsS0FBSyxDQUFDLDRCQUE0QixDQUFDLFdBQXdCLEVBQUUsU0FBc0IsRUFBRSxRQUFnQixFQUFFLGlCQUF5QixFQUFFLFVBQWtCLEVBQUUsWUFBb0IsRUFBRSxPQUFlLEVBQUUsU0FBaUI7UUFFMU0sTUFBTSx1QkFBdUIsR0FBRztZQUM1QixXQUFXLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxpQkFBaUI7U0FDOUQsQ0FBQztRQUU3QixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxrQ0FBa0MsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztJQUNuSSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxpQkFBd0MsRUFBRSxPQUFlO1FBQzlGLElBQUksaUJBQWlCLENBQUMsTUFBTSxLQUFLLHlCQUFxQixDQUFDLGdCQUFnQixFQUFFO1lBQ3JFLE1BQU0sSUFBSSw2QkFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDNUM7UUFDRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQzlFLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLHFDQUFxQyxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzVHLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsOEJBQThCLENBQUMsaUJBQXdDO1FBQ3pFLElBQUksaUJBQWlCLENBQUMsTUFBTSxLQUFLLHlCQUFxQixDQUFDLGdCQUFnQixFQUFFO1lBQ3JFLE1BQU0sSUFBSSw2QkFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDNUM7UUFDRCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxvQ0FBb0MsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQy9GLENBQUM7Q0FDSixDQUFBO0FBdkVHO0lBREMsa0JBQU0sRUFBRTs7K0NBQ1c7QUFFcEI7SUFEQyxrQkFBTSxFQUFFOzhCQUNlLGlEQUFzQjtrRUFBQztBQUUvQztJQURDLHFCQUFpQixDQUFDLGVBQVcsQ0FBQzs4QkFDWixjQUFVOzZEQUFjO0FBRTNDO0lBREMscUJBQWlCLENBQUMseUJBQXFCLENBQUM7OEJBQ1osY0FBVTt1RUFBd0I7QUFFL0Q7SUFEQyxxQkFBaUIsQ0FBQyx5QkFBcUIsQ0FBQzs4QkFDWixjQUFVO3VFQUF3QjtBQUcvRDtJQURDLGdCQUFJLEVBQUU7Ozs7Z0VBSU47QUFqQlEsa0JBQWtCO0lBRDlCLG1CQUFPLEVBQUU7R0FDRyxrQkFBa0IsQ0EwRTlCO0FBMUVZLGdEQUFrQiJ9