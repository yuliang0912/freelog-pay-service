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
        super.tableAlias = 'details';
        super.repository = this.transactionDetailRepository;
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
     * @param digest
     * @param remark
     */
    async organizationAccountTransfer(fromAccount, toAccount, transactionAmount, signature, digest, remark) {
        if (!fromAccount || !toAccount || !signature) {
            throw new egg_freelog_base_1.ArgumentError('参数校验失败');
        }
        if (fromAccount.accountType !== __1.AccountTypeEnum.OrganizationAccount) {
            throw new egg_freelog_base_1.LogicError('账号类型校验失败');
        }
        return this.transactionCoreService.organizationAccountTransfer(fromAccount, toAccount, transactionAmount, signature, digest, remark);
    }
    /**
     * 待确认的合约支付
     * @param fromAccount
     * @param toAccount
     * @param password
     * @param transactionAmount
     * @param contractId
     * @param subjectType
     * @param contractName
     * @param eventId
     * @param signature
     */
    async toBeConfirmedContractPayment(fromAccount, toAccount, password, transactionAmount, contractId, subjectType, contractName, eventId, signature) {
        const contractTransactionInfo = {
            fromAccount, toAccount, password, contractId, subjectType, contractName, eventId, transactionAmount
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJEOi/lt6XkvZwvZnJlZWxvZy1wYXktc2VydmljZS9zcmMvIiwic291cmNlcyI6WyJzZXJ2aWNlL3RyYW5zYWN0aW9uLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbURBQTBEO0FBQzFELG1FQUFvRDtBQUNwRCwwQkFTWTtBQUNaLHVEQUEyRTtBQUMzRSwwRUFBbUU7QUFDbkUsdURBQWlEO0FBQ2pELGdHQUF3RjtBQUN4RixxREFBK0M7QUFHL0MsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBbUIsU0FBUSxtQ0FBa0M7SUFnQnRFLHNCQUFzQjtRQUNsQixLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM3QixLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQztJQUN4RCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxXQUF3QixFQUFFLFNBQXNCLEVBQUUsUUFBZ0IsRUFBRSxpQkFBeUIsRUFBRSxNQUFlO1FBQzFJLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDekMsTUFBTSxJQUFJLGdDQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDckM7UUFDRCxJQUFJLFdBQVcsQ0FBQyxXQUFXLEtBQUssbUJBQWUsQ0FBQyxpQkFBaUIsRUFBRTtZQUMvRCxNQUFNLElBQUksNkJBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNwQztRQUNELE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5SixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7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