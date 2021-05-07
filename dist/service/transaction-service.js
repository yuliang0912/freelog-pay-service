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
const account_service_1 = require("./account-service");
const test_freelog_organization_info_1 = require("../mock-data/test-freelog-organization-info");
const rsa_helper_1 = require("../extend/rsa-helper");
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
        if (!fromAccount || !toAccount || !password) {
            throw new egg_freelog_base_1.ArgumentError('参数校验失败');
        }
        if (fromAccount.accountType !== __1.AccountTypeEnum.IndividualAccount) {
            throw new egg_freelog_base_1.LogicError('账号类型校验失败');
        }
        return this.transactionCoreService.individualAccountTransfer(this.ctx.identityInfo.userInfo, fromAccount, toAccount, password, transactionAmount, remark);
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
        if (!fromAccount || !toAccount || !signature) {
            throw new egg_freelog_base_1.ArgumentError('参数校验失败');
        }
        if (fromAccount.accountType !== __1.AccountTypeEnum.OrganizationAccount) {
            throw new egg_freelog_base_1.LogicError('账号类型校验失败');
        }
        return this.transactionCoreService.organizationAccountTransfer(fromAccount, toAccount, transactionAmount, signature, remark);
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
     * 合约支付确认取消
     * @param transactionRecord
     */
    async contractPaymentConfirmedCancel(transactionRecord) {
        if (transactionRecord.status !== __1.TransactionStatusEnum.ToBeConfirmation) {
            throw new egg_freelog_base_1.LogicError('只有处理中的交易才允许做确认操作');
        }
        return this.transactionCoreService.contractPaymentConfirmCanceledHandle(transactionRecord);
    }
    /**
     * 测试代币转账(领取)
     * @param toAccountInfo
     * @param transactionAmount
     */
    async testTokenTransferSignature(toAccountInfo, transactionAmount) {
        let fromAccount = await this.accountService.findOne({
            ownerId: test_freelog_organization_info_1.testFreelogOrganizationInfo.organizationId.toString(),
            accountType: __1.AccountTypeEnum.OrganizationAccount
        });
        if (!fromAccount) {
            fromAccount = await this.accountService.createOrganizationAccount();
        }
        const signText = `fromAccountId_${fromAccount.accountId}_toAccountId_${toAccountInfo.accountId}_transactionAmount_${transactionAmount}`;
        const nodeRsaHelper = this.rsaHelper.build(null, test_freelog_organization_info_1.testFreelogOrganizationInfo.privateKey);
        return nodeRsaHelper.sign(signText);
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], TransactionService.prototype, "ctx", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", rsa_helper_1.RsaHelper)
], TransactionService.prototype, "rsaHelper", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", transaction_core_service_1.TransactionCoreService)
], TransactionService.prototype, "transactionCoreService", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", account_service_1.AccountService)
], TransactionService.prototype, "accountService", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJEOi/lt6XkvZwvZnJlZWxvZy1wYXktc2VydmljZS9zcmMvIiwic291cmNlcyI6WyJzZXJ2aWNlL3RyYW5zYWN0aW9uLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbURBQTBEO0FBQzFELG1FQUFvRDtBQUNwRCwwQkFTWTtBQUNaLHVEQUEyRTtBQUMzRSwwRUFBbUU7QUFDbkUsdURBQWlEO0FBQ2pELGdHQUF3RjtBQUN4RixxREFBK0M7QUFHL0MsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBbUIsU0FBUSxtQ0FBa0M7SUFnQnRFLHNCQUFzQjtRQUNsQixLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztRQUM1QixLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQztJQUN4RCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxXQUF3QixFQUFFLFNBQXNCLEVBQUUsUUFBZ0IsRUFBRSxpQkFBeUIsRUFBRSxNQUFlO1FBQzFJLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDekMsTUFBTSxJQUFJLGdDQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDckM7UUFDRCxJQUFJLFdBQVcsQ0FBQyxXQUFXLEtBQUssbUJBQWUsQ0FBQyxpQkFBaUIsRUFBRTtZQUMvRCxNQUFNLElBQUksNkJBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNwQztRQUNELE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5SixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxXQUF3QixFQUFFLFNBQXNCLEVBQUUsaUJBQXlCLEVBQUUsU0FBaUIsRUFBRSxNQUFlO1FBQzdJLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDMUMsTUFBTSxJQUFJLGdDQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDckM7UUFDRCxJQUFJLFdBQVcsQ0FBQyxXQUFXLEtBQUssbUJBQWUsQ0FBQyxtQkFBbUIsRUFBRTtZQUNqRSxNQUFNLElBQUksNkJBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNwQztRQUNELE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLDJCQUEyQixDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pJLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gsS0FBSyxDQUFDLDRCQUE0QixDQUFDLFdBQXdCLEVBQUUsU0FBc0IsRUFBRSxRQUFnQixFQUFFLGlCQUF5QixFQUFFLFVBQWtCLEVBQUUsWUFBb0IsRUFBRSxPQUFlLEVBQUUsU0FBaUI7UUFFMU0sTUFBTSx1QkFBdUIsR0FBRztZQUM1QixXQUFXLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxpQkFBaUI7U0FDOUQsQ0FBQztRQUU3QixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxrQ0FBa0MsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztJQUNuSSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxpQkFBd0MsRUFBRSxPQUFlO1FBQzlGLElBQUksaUJBQWlCLENBQUMsTUFBTSxLQUFLLHlCQUFxQixDQUFDLGdCQUFnQixFQUFFO1lBQ3JFLE1BQU0sSUFBSSw2QkFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDNUM7UUFDRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsRUFBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQzlFLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLHFDQUFxQyxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzVHLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsOEJBQThCLENBQUMsaUJBQXdDO1FBQ3pFLElBQUksaUJBQWlCLENBQUMsTUFBTSxLQUFLLHlCQUFxQixDQUFDLGdCQUFnQixFQUFFO1lBQ3JFLE1BQU0sSUFBSSw2QkFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDNUM7UUFDRCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxvQ0FBb0MsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQy9GLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLDBCQUEwQixDQUFDLGFBQTBCLEVBQUUsaUJBQXlCO1FBQ2xGLElBQUksV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7WUFDaEQsT0FBTyxFQUFFLDREQUEyQixDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUU7WUFDOUQsV0FBVyxFQUFFLG1CQUFlLENBQUMsbUJBQW1CO1NBQ25ELENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDZCxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLHlCQUF5QixFQUFFLENBQUM7U0FDdkU7UUFDRCxNQUFNLFFBQVEsR0FBRyxpQkFBaUIsV0FBVyxDQUFDLFNBQVMsZ0JBQWdCLGFBQWEsQ0FBQyxTQUFTLHNCQUFzQixpQkFBaUIsRUFBRSxDQUFDO1FBQ3hJLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSw0REFBMkIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6RixPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEMsQ0FBQztDQUNKLENBQUE7QUFuSEc7SUFEQyxrQkFBTSxFQUFFOzsrQ0FDVztBQUVwQjtJQURDLGtCQUFNLEVBQUU7OEJBQ0Usc0JBQVM7cURBQUM7QUFFckI7SUFEQyxrQkFBTSxFQUFFOzhCQUNlLGlEQUFzQjtrRUFBQztBQUUvQztJQURDLGtCQUFNLEVBQUU7OEJBQ08sZ0NBQWM7MERBQUM7QUFFL0I7SUFEQyxxQkFBaUIsQ0FBQyx5QkFBcUIsQ0FBQzs4QkFDWixjQUFVO3VFQUF3QjtBQUUvRDtJQURDLHFCQUFpQixDQUFDLHlCQUFxQixDQUFDOzhCQUNaLGNBQVU7dUVBQXdCO0FBRy9EO0lBREMsZ0JBQUksRUFBRTs7OztnRUFJTjtBQW5CUSxrQkFBa0I7SUFEOUIsbUJBQU8sRUFBRTtHQUNHLGtCQUFrQixDQXNIOUI7QUF0SFksZ0RBQWtCIn0=