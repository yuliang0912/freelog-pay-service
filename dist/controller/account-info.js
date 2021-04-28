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
exports.AccountInfoController = void 0;
const decorator_1 = require("@midwayjs/decorator");
const egg_freelog_base_1 = require("egg-freelog-base");
const NodeRSA = require("node-rsa");
const enum_1 = require("../enum");
const account_helper_1 = require("../extend/account-helper");
const account_service_1 = require("../service/account-service");
let AccountInfoController = class AccountInfoController {
    // 个人账号
    async individualAccount() {
        return this.accountService.getAccountInfo({
            where: { ownerUserId: this.ctx.userId, accountType: enum_1.AccountTypeEnum.IndividualAccount }
        });
    }
    // 个人账号
    async individualAccountInfo() {
        const { ctx } = this;
        const ownerUserId = ctx.checkParams('userId').exist().isUserId().value;
        ctx.validateParams();
        return this.accountService.getAccountInfo({
            where: { ownerUserId, accountType: enum_1.AccountTypeEnum.IndividualAccount }
        });
    }
    // 创建个人账户
    async create() {
        const ctx = this.ctx;
        const password = ctx.checkBody('password').exist().isNumeric().len(6, 6).value;
        ctx.validateParams();
        return this.accountService.createIndividualAccount(password);
    }
    // 创建合约账户(此处需要做幂等,一个合约只能创建一个账户,权限需要设置为内部调用权限)
    async createContractAccount() {
        const ctx = this.ctx;
        const contractId = ctx.checkParams('contractId').exist().isMongoObjectId().value;
        const contractName = ctx.checkBody('contractName').exist().len(0, 128).value;
        const publicKey = ctx.checkBody('publicKey').exist().decodeURIComponent().value;
        ctx.validateParams();
        const nodeRsa = new NodeRSA(publicKey);
        if (!nodeRsa.isPublic) {
            throw new egg_freelog_base_1.ArgumentError('publicKey不是一个有效的rsa-public-key');
        }
        const accountInfo = await this.accountService.findOne({ ownerId: contractId });
        if (accountInfo) {
            return accountInfo;
        }
        return this.accountService.createContractAccount(contractId, contractName, publicKey);
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", Object)
], AccountInfoController.prototype, "ctx", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", account_service_1.AccountService)
], AccountInfoController.prototype, "accountService", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", account_helper_1.AccountHelper)
], AccountInfoController.prototype, "accountHelper", void 0);
__decorate([
    decorator_1.Get('/individualAccounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "individualAccount", null);
__decorate([
    decorator_1.Get('/individualAccounts/:userId'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.InternalClient | egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "individualAccountInfo", null);
__decorate([
    decorator_1.Post('/individualAccounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "create", null);
__decorate([
    decorator_1.Post('/contractAccounts/:contractId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "createContractAccount", null);
AccountInfoController = __decorate([
    decorator_1.Provide(),
    decorator_1.Controller('/v2/accounts')
], AccountInfoController);
exports.AccountInfoController = AccountInfoController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC1pbmZvLmpzIiwic291cmNlUm9vdCI6IkQ6L+W3peS9nC9mcmVlbG9nLXBheS1zZXJ2aWNlL3NyYy8iLCJzb3VyY2VzIjpbImNvbnRyb2xsZXIvYWNjb3VudC1pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1EQUEyRTtBQUMzRSx1REFBMkc7QUFDM0csb0NBQW9DO0FBQ3BDLGtDQUF3QztBQUN4Qyw2REFBdUQ7QUFDdkQsZ0VBQTBEO0FBSTFELElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBUzlCLE9BQU87SUFFUCxLQUFLLENBQUMsaUJBQWlCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUM7WUFDdEMsS0FBSyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxzQkFBZSxDQUFDLGlCQUFpQixFQUFDO1NBQ3hGLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxPQUFPO0lBR1AsS0FBSyxDQUFDLHFCQUFxQjtRQUN2QixNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3ZFLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVyQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDO1lBQ3RDLEtBQUssRUFBRSxFQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsc0JBQWUsQ0FBQyxpQkFBaUIsRUFBQztTQUN2RSxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsU0FBUztJQUVULEtBQUssQ0FBQyxNQUFNO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNyQixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQy9FLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVyQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELDZDQUE2QztJQUU3QyxLQUFLLENBQUMscUJBQXFCO1FBQ3ZCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDckIsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDakYsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM3RSxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2hGLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVyQixNQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNuQixNQUFNLElBQUksZ0NBQWEsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1NBQzdEO1FBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDO1FBQzdFLElBQUksV0FBVyxFQUFFO1lBQ2IsT0FBTyxXQUFXLENBQUM7U0FDdEI7UUFFRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxRixDQUFDO0NBQ0osQ0FBQTtBQTFERztJQURDLGtCQUFNLEVBQUU7O2tEQUNXO0FBRXBCO0lBREMsa0JBQU0sRUFBRTs4QkFDTyxnQ0FBYzs2REFBQztBQUUvQjtJQURDLGtCQUFNLEVBQUU7OEJBQ00sOEJBQWE7NERBQUM7QUFJN0I7SUFEQyxlQUFHLENBQUMscUJBQXFCLENBQUM7Ozs7OERBSzFCO0FBS0Q7SUFGQyxlQUFHLENBQUMsNkJBQTZCLENBQUM7SUFDbEMsMkNBQXdCLENBQUMsbUNBQWdCLENBQUMsY0FBYyxHQUFHLG1DQUFnQixDQUFDLFNBQVMsQ0FBQzs7OztrRUFTdEY7QUFJRDtJQURDLGdCQUFJLENBQUMscUJBQXFCLENBQUM7Ozs7bURBTzNCO0FBSUQ7SUFEQyxnQkFBSSxDQUFDLCtCQUErQixDQUFDOzs7O2tFQW1CckM7QUE1RFEscUJBQXFCO0lBRmpDLG1CQUFPLEVBQUU7SUFDVCxzQkFBVSxDQUFDLGNBQWMsQ0FBQztHQUNkLHFCQUFxQixDQTZEakM7QUE3RFksc0RBQXFCIn0=