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
            status: 1
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
            status: 1
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
    async getAccountInfo(condition) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2UvYWNjb3VudC1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1EQUEwRDtBQUMxRCxtRUFBb0Q7QUFDcEQsMEJBQXlGO0FBRXpGLDZEQUF1RDtBQUN2RCx1REFBNEQ7QUFDNUQsK0JBQXdCO0FBR3hCLElBQWEsY0FBYyxHQUEzQixNQUFhLGNBQWUsU0FBUSxtQ0FBd0I7SUFXeEQsc0JBQXNCO1FBQ2xCLEtBQUssQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzdCLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQzlDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsdUJBQXVCLENBQUMsUUFBZ0I7UUFDMUMsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzdCLFdBQVcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsbUJBQWUsQ0FBQyxpQkFBaUI7U0FDL0UsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxPQUFPLEVBQUU7WUFDVCxNQUFNLElBQUksNkJBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUN2QztRQUVELE1BQU0sUUFBUSxHQUFhLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUMxRCxNQUFNLFdBQVcsR0FBRztZQUNoQixTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBZSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDbkcsV0FBVyxFQUFFLG1CQUFlLENBQUMsaUJBQWlCO1lBQzlDLFdBQVcsRUFBRSxRQUFRLENBQUMsUUFBUTtZQUM5QixXQUFXLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLFFBQVE7WUFDMUQsT0FBTyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ25DLE1BQU0sRUFBRSxDQUFDO1NBQ0csQ0FBQztRQUNqQixXQUFXLENBQUMsU0FBUyxHQUFHLENBQUMsU0FBRSxFQUFFLEdBQUcsU0FBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELFdBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvSSxXQUFXLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsV0FBMEIsQ0FBQyxDQUFDO1FBQzVGLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUEwQixDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFVBQWtCLEVBQUUsWUFBb0IsRUFBRSxTQUFpQjtRQUNuRixNQUFNLFdBQVcsR0FBRztZQUNoQixTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBZSxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUM7WUFDNUYsV0FBVyxFQUFFLG1CQUFlLENBQUMsZUFBZTtZQUM1QyxXQUFXLEVBQUUsWUFBWTtZQUN6QixPQUFPLEVBQUUsVUFBVTtZQUNuQixNQUFNLEVBQUUsQ0FBQztTQUNHLENBQUM7UUFDakIsV0FBVyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLFdBQVcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQy9ELFdBQVcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxXQUEwQixDQUFDLENBQUM7UUFDNUYsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQXNDO1FBQ3ZELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBQ0osQ0FBQTtBQW5FRztJQURDLGtCQUFNLEVBQUU7OzJDQUNXO0FBRXBCO0lBREMsa0JBQU0sRUFBRTs4QkFDTSw4QkFBYTtxREFBQztBQUc3QjtJQURDLHFCQUFpQixDQUFDLGVBQVcsQ0FBQzs4QkFDWixjQUFVO3lEQUFjO0FBRzNDO0lBREMsZ0JBQUksRUFBRTs7Ozs0REFJTjtBQWRRLGNBQWM7SUFEMUIsbUJBQU8sRUFBRTtHQUNHLGNBQWMsQ0FzRTFCO0FBdEVZLHdDQUFjIn0=