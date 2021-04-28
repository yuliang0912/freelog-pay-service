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
    decorator_1.Get('/individualAccount'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "individualAccount", null);
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
    decorator_1.Controller('/v1/accounts')
], AccountInfoController);
exports.AccountInfoController = AccountInfoController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXIvYWNjb3VudC1pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1EQUEyRTtBQUMzRSx1REFBK0Q7QUFDL0Qsb0NBQW9DO0FBQ3BDLGtDQUF3QztBQUN4Qyw2REFBdUQ7QUFDdkQsZ0VBQTBEO0FBSTFELElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBUzlCLE9BQU87SUFFUCxLQUFLLENBQUMsaUJBQWlCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUM7WUFDdEMsS0FBSyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxzQkFBZSxDQUFDLGlCQUFpQixFQUFDO1NBQ3hGLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxTQUFTO0lBRVQsS0FBSyxDQUFDLE1BQU07UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ3JCLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDL0UsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXJCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsNkNBQTZDO0lBRTdDLEtBQUssQ0FBQyxxQkFBcUI7UUFDdkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNyQixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNqRixNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzdFLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDaEYsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXJCLE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ25CLE1BQU0sSUFBSSxnQ0FBYSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7U0FDN0Q7UUFFRCxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7UUFDN0UsSUFBSSxXQUFXLEVBQUU7WUFDYixPQUFPLFdBQVcsQ0FBQztTQUN0QjtRQUVELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzFGLENBQUM7Q0FDSixDQUFBO0FBN0NHO0lBREMsa0JBQU0sRUFBRTs7a0RBQ1c7QUFFcEI7SUFEQyxrQkFBTSxFQUFFOzhCQUNPLGdDQUFjOzZEQUFDO0FBRS9CO0lBREMsa0JBQU0sRUFBRTs4QkFDTSw4QkFBYTs0REFBQztBQUk3QjtJQURDLGVBQUcsQ0FBQyxvQkFBb0IsQ0FBQzs7Ozs4REFLekI7QUFJRDtJQURDLGdCQUFJLENBQUMscUJBQXFCLENBQUM7Ozs7bURBTzNCO0FBSUQ7SUFEQyxnQkFBSSxDQUFDLCtCQUErQixDQUFDOzs7O2tFQW1CckM7QUEvQ1EscUJBQXFCO0lBRmpDLG1CQUFPLEVBQUU7SUFDVCxzQkFBVSxDQUFDLGNBQWMsQ0FBQztHQUNkLHFCQUFxQixDQWdEakM7QUFoRFksc0RBQXFCIn0=