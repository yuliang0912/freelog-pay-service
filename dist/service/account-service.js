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
exports.AccountService = void 0;
const decorator_1 = require("@midwayjs/decorator");
const abstract_base_service_1 = require("./abstract-base-service");
const __1 = require("..");
const account_helper_1 = require("../extend/account-helper");
const egg_freelog_base_1 = require("egg-freelog-base");
const decimal_js_light_1 = require("decimal.js-light");
const test_freelog_organization_info_1 = require("../mock-data/test-freelog-organization-info");
const outside_api_service_1 = require("./outside-api-service");
let AccountService = class AccountService extends abstract_base_service_1.BaseService {
    constructorBaseService() {
        super.tableAlias = 'account';
        super.repository = this.accountRepository;
    }
    /**
     * 创建个人账号(未激活,也没有密码)
     */
    async createIndividualAccount(userId, username) {
        await this.checkCreateAccountUniqueness(userId.toString(), __1.AccountTypeEnum.IndividualAccount);
        const accountInfo = {
            accountId: this.accountHelper.generateAccountId(__1.AccountTypeEnum.IndividualAccount, userId),
            accountType: __1.AccountTypeEnum.IndividualAccount,
            accountName: username,
            ownerUserId: userId, ownerName: username,
            ownerId: userId.toString(),
            status: 0,
            balance: new decimal_js_light_1.Decimal(0).toFixed(2),
            freezeBalance: new decimal_js_light_1.Decimal(0).toFixed(2)
        };
        accountInfo.saltValue = this.accountHelper.generateSaltValue();
        accountInfo.password = '';
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo);
        return this.accountRepository.save(accountInfo);
    }
    /**
     * 激活个人账号
     * @param accountInfo
     * @param password
     */
    async activateIndividualAccount(accountInfo, password) {
        if (accountInfo?.status !== 0) {
            throw new egg_freelog_base_1.LogicError('账号已激活,不能重复操作');
        }
        if (!this.accountHelper.accountSignatureVerify(accountInfo)) {
            throw new egg_freelog_base_1.LogicError('账号签名校验失败,数据完整性校验失败');
        }
        accountInfo.password = this.accountHelper.generateAccountPassword(accountInfo.accountId, accountInfo.saltValue, accountInfo.ownerId, password);
        accountInfo.status = 1;
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo);
        return this.accountRepository.save(accountInfo).then(() => true);
    }
    /**
     * 创建合同账号
     * @param contractId
     * @param contractName
     * @param publicKey
     */
    async createContractAccount(contractId, contractName, publicKey) {
        await this.checkCreateAccountUniqueness(contractId, __1.AccountTypeEnum.ContractAccount);
        const accountInfo = {
            accountId: this.accountHelper.generateAccountId(__1.AccountTypeEnum.ContractAccount, contractId),
            accountType: __1.AccountTypeEnum.ContractAccount,
            accountName: contractName,
            ownerId: contractId,
            status: 1,
            balance: new decimal_js_light_1.Decimal(0).toFixed(2),
            freezeBalance: new decimal_js_light_1.Decimal(0).toFixed(2)
        };
        accountInfo.password = this.accountHelper.encryptPublicKey(publicKey);
        accountInfo.saltValue = this.accountHelper.generateSaltValue();
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo);
        await this.accountRepository.insert(accountInfo);
        return this.repository.findOne(accountInfo.accountId);
    }
    /**
     * 创建组织账户(目前系统没有组织信息.先模拟一个)
     */
    async createOrganizationAccount() {
        const { organizationId, organizationName, ownerUserId, ownerName, publicKey } = test_freelog_organization_info_1.testFreelogOrganizationInfo;
        await this.checkCreateAccountUniqueness(organizationId.toString(), __1.AccountTypeEnum.OrganizationAccount);
        const accountInfo = {
            accountId: this.accountHelper.generateAccountId(__1.AccountTypeEnum.OrganizationAccount, organizationId),
            accountType: __1.AccountTypeEnum.OrganizationAccount,
            accountName: organizationName,
            ownerUserId: ownerUserId,
            ownerId: organizationId.toString(),
            ownerName: ownerName,
            status: 1,
            balance: new decimal_js_light_1.Decimal(10000000).toFixed(2),
            freezeBalance: new decimal_js_light_1.Decimal(0).toFixed(2)
        };
        accountInfo.saltValue = this.accountHelper.generateSaltValue();
        accountInfo.password = this.accountHelper.encryptPublicKey(publicKey);
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo);
        await this.accountRepository.insert(accountInfo);
        return this.accountRepository.findOne(accountInfo.accountId);
    }
    /**
     * 校验创建账号唯一性
     * @param ownerId
     * @param accountType
     * @private
     */
    async checkCreateAccountUniqueness(ownerId, accountType) {
        const isExist = await this.count({ ownerId: ownerId, accountType });
        if (isExist) {
            throw new egg_freelog_base_1.LogicError('只允许创建一个交易账户');
        }
    }
    /**
     * 获取账户信息
     * @param ownerId
     * @param accountType
     */
    async getAccountInfo(ownerId, accountType) {
        const accountInfo = await this.findOne({ ownerId: ownerId, accountType });
        if (!accountInfo && accountType === __1.AccountTypeEnum.IndividualAccount) {
            const userInfo = await this.outsideApiService.getUserInfo(ownerId);
            if (!userInfo) {
                throw new egg_freelog_base_1.ArgumentError(`未找到用户(${ownerId})`);
            }
            return this.createIndividualAccount(userInfo.userId, userInfo.username);
        }
        return accountInfo;
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], AccountService.prototype, "ctx", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", account_helper_1.AccountHelper)
], AccountService.prototype, "accountHelper", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", outside_api_service_1.OutsideApiService)
], AccountService.prototype, "outsideApiService", void 0);
__decorate([
    __1.InjectEntityModel(__1.AccountInfo),
    __metadata("design:type", __1.Repository)
], AccountService.prototype, "accountRepository", void 0);
__decorate([
    decorator_1.Init(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AccountService.prototype, "constructorBaseService", null);
AccountService = __decorate([
    decorator_1.Provide()
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IkQ6L+W3peS9nC9mcmVlbG9nLXBheS1zZXJ2aWNlL3NyYy8iLCJzb3VyY2VzIjpbInNlcnZpY2UvYWNjb3VudC1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1EQUEwRDtBQUMxRCxtRUFBb0Q7QUFDcEQsMEJBQStFO0FBQy9FLDZEQUF1RDtBQUN2RCx1REFBMkU7QUFDM0UsdURBQXlDO0FBQ3pDLGdHQUF3RjtBQUN4RiwrREFBd0Q7QUFHeEQsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBZSxTQUFRLG1DQUF3QjtJQWF4RCxzQkFBc0I7UUFDbEIsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDN0IsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDOUMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLHVCQUF1QixDQUFDLE1BQWMsRUFBRSxRQUFnQjtRQUMxRCxNQUFNLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsbUJBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzlGLE1BQU0sV0FBVyxHQUFHO1lBQ2hCLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLG1CQUFlLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDO1lBQzFGLFdBQVcsRUFBRSxtQkFBZSxDQUFDLGlCQUFpQjtZQUM5QyxXQUFXLEVBQUUsUUFBUTtZQUNyQixXQUFXLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRO1lBQ3hDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQzFCLE1BQU0sRUFBRSxDQUFDO1lBQ1QsT0FBTyxFQUFFLElBQUksMEJBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLGFBQWEsRUFBRSxJ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