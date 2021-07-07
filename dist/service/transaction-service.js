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
const transaction_helper_1 = require("../extend/transaction-helper");
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
     * @param outsideTransactionId
     * @param signature
     * @param digest
     * @param remark
     */
    async organizationAccountTransfer(fromAccount, toAccount, transactionAmount, outsideTransactionId, signature, digest, remark) {
        if (!fromAccount || !toAccount || !signature) {
            throw new egg_freelog_base_1.ArgumentError('参数校验失败');
        }
        if (fromAccount.accountType !== __1.AccountTypeEnum.OrganizationAccount) {
            throw new egg_freelog_base_1.LogicError('账号类型校验失败');
        }
        return this.transactionCoreService.organizationAccountTransfer(fromAccount, toAccount, transactionAmount, outsideTransactionId, signature, digest, remark);
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
     * @param outsideTransactionId
     */
    async testTokenTransferSignature(toAccountInfo, transactionAmount, outsideTransactionId) {
        let fromAccount = await this.accountService.findOne({
            ownerId: test_freelog_organization_info_1.testFreelogOrganizationInfo.organizationId.toString(),
            accountType: __1.AccountTypeEnum.OrganizationAccount
        });
        if (!fromAccount) {
            fromAccount = await this.accountService.createOrganizationAccount();
        }
        const signatureData = {
            transactionAmount, outsideTransactionId,
            toAccountId: toAccountInfo.accountId,
            fromAccountId: fromAccount.accountId,
        };
        const signText = this.transactionHelper.generateSignatureText(signatureData, '=');
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
    decorator_1.Inject(),
    __metadata("design:type", transaction_helper_1.TransactionHelper)
], TransactionService.prototype, "transactionHelper", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJEOi/lt6XkvZwvZnJlZWxvZy1wYXktc2VydmljZS9zcmMvIiwic291cmNlcyI6WyJzZXJ2aWNlL3RyYW5zYWN0aW9uLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbURBQTBEO0FBQzFELG1FQUFvRDtBQUNwRCwwQkFTWTtBQUNaLHVEQUEyRTtBQUMzRSwwRUFBbUU7QUFDbkUsdURBQWlEO0FBQ2pELGdHQUF3RjtBQUN4RixxREFBK0M7QUFDL0MscUVBQStEO0FBRy9ELElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQW1CLFNBQVEsbUNBQWtDO0lBbUJ0RSxzQkFBc0I7UUFDbEIsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDN0IsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUM7SUFDeEQsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxLQUFLLENBQUMseUJBQXlCLENBQUMsV0FBd0IsRUFBRSxTQUFzQixFQUFFLFFBQWdCLEVBQUUsaUJBQXlCLEVBQUUsTUFBZTtRQUMxSSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3pDLE1BQU0sSUFBSSxnQ0FBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsSUFBSSxXQUFXLENBQUMsV0FBVyxLQUFLLG1CQUFlLENBQUMsaUJBQWlCLEVBQUU7WUFDL0QsTUFBTSxJQUFJLDZCQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEM7UUFDRCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUosQ0FBQztJQUVE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