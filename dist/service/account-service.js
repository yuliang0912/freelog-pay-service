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
const uuid_1 = require("uuid");
const decimal_js_light_1 = require("decimal.js-light");
let AccountService = class AccountService extends abstract_base_service_1.BaseService {
    constructorBaseService() {
        super.tableAlias = 'account';
        super.repository = this.accountRepository;
    }
    /**
     * 创建账号
     * @param password
     */
    async createIndividualAccount(password) {
        const isExist = await this.count({
            ownerUserId: this.ctx.userId, accountType: __1.AccountTypeEnum.IndividualAccount
        });
        if (isExist) {
            throw new egg_freelog_base_1.LogicError('只允许创建一个交易账户');
        }
        const userInfo = this.ctx.identityInfo.userInfo;
        const accountInfo = {
            accountId: this.accountHelper.generateAccountId(__1.AccountTypeEnum.IndividualAccount, userInfo.userId),
            accountType: __1.AccountTypeEnum.IndividualAccount,
            accountName: userInfo.username,
            ownerUserId: userInfo.userId, ownerName: userInfo.username,
            ownerId: userInfo.userId.toString(),
            status: 1,
            balance: new decimal_js_light_1.Decimal(0).toFixed(2),
            freezeBalance: new decimal_js_light_1.Decimal(0).toFixed(2)
        };
        accountInfo.saltValue = (uuid_1.v4() + uuid_1.v4()).replace(/-/g, '');
        accountInfo.password = this.accountHelper.generateAccountPassword(accountInfo.accountId, accountInfo.saltValue, accountInfo.ownerId, password);
        accountInfo.signature = this.accountHelper.accountInfoSignature(accountInfo);
        return this.accountRepository.save(accountInfo);
    }
    /**
     * 创建合同账号
     * @param contractId
     * @param contractName
     * @param publicKey
     */
    async createContractAccount(contractId, contractName, publicKey) {
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
        return this.accountRepository.save(accountInfo);
    }
    /**
     * 获取账户信息
     * @param condition
     */
    getAccountInfo(condition) {
        return this.findOne(condition);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IkQ6L+W3peS9nC9mcmVlbG9nLXBheS1zZXJ2aWNlL3NyYy8iLCJzb3VyY2VzIjpbInNlcnZpY2UvYWNjb3VudC1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1EQUEwRDtBQUMxRCxtRUFBb0Q7QUFDcEQsMEJBQXlGO0FBRXpGLDZEQUF1RDtBQUN2RCx1REFBNEQ7QUFDNUQsK0JBQXdCO0FBQ3hCLHVEQUF5QztBQUd6QyxJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFlLFNBQVEsbUNBQXdCO0lBV3hELHNCQUFzQjtRQUNsQixLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM3QixLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUM5QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLHVCQUF1QixDQUFDLFFBQWdCO1FBQzFDLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQztZQUM3QixXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLG1CQUFlLENBQUMsaUJBQWlCO1NBQy9FLENBQUMsQ0FBQztRQUNILElBQUksT0FBTyxFQUFFO1lBQ1QsTUFBTSxJQUFJLDZCQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDdkM7UUFFRCxNQUFNLFFBQVEsR0FBYSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDMUQsTUFBTSxXQUFXLEdBQUc7WUFDaEIsU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsbUJBQWUsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ25HLFdBQVcsRUFBRSxtQkFBZSxDQUFDLGlCQUFpQjtZQUM5QyxXQUFXLEVBQUUsUUFBUSxDQUFDLFFBQVE7WUFDOUIs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