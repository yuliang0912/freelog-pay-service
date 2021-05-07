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
        return this.accountService.getAccountInfo(this.ctx.userId.toString(), enum_1.AccountTypeEnum.IndividualAccount);
    }
    // 个人账号
    async individualAccountInfo() {
        const { ctx } = this;
        const ownerUserId = ctx.checkParams('userId').exist().isUserId().value;
        ctx.validateParams();
        return this.accountService.getAccountInfo(ownerUserId, enum_1.AccountTypeEnum.IndividualAccount);
    }
    // 激活账号
    async activateAccount() {
        const ctx = this.ctx;
        const password = ctx.checkBody('password').isNumeric().len(6, 6).value;
        ctx.validateParams();
        const accountInfo = await this.accountService.getAccountInfo(this.ctx.userId.toString(), enum_1.AccountTypeEnum.IndividualAccount);
        return this.accountService.activateIndividualAccount(accountInfo, password);
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
    // 创建组织账户
    async createOrganizationAccount() {
        // const ctx = this.ctx;
        // const organizationId = ctx.checkParams('organizationId').exist().toInt().value;
        // const publicKey = ctx.checkBody('publicKey').exist().value;
        // ctx.validateParams();
        //
        // const nodeRsa = new NodeRSA(publicKey);
        // if (!nodeRsa.isPublic) {
        //     throw new ArgumentError('publicKey不是一个有效的rsa-public-key');
        // }
        return this.accountService.createOrganizationAccount();
    }
    // 生成rsa秘钥对
    async generateRsaKey() {
        const bit = this.ctx.checkQuery('bit').optional().toInt().default(256).value;
        const nodeRsa = new NodeRSA({ b: bit });
        console.log(nodeRsa.exportKey('pkcs1-public-pem'), '\n', nodeRsa.exportKey('pkcs1-private-pem'));
        return {
            publicKey: nodeRsa.exportKey('pkcs1-public-pem'),
            privateKey: nodeRsa.exportKey('pkcs1-private-pem')
        };
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
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
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
    decorator_1.Put('/individualAccounts/activate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "activateAccount", null);
__decorate([
    decorator_1.Post('/contractAccounts/:contractId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "createContractAccount", null);
__decorate([
    decorator_1.Post('/organizationAccounts/:organizationId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "createOrganizationAccount", null);
__decorate([
    decorator_1.Get('/rasKey'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "generateRsaKey", null);
AccountInfoController = __decorate([
    decorator_1.Provide(),
    decorator_1.Controller('/v2/accounts')
], AccountInfoController);
exports.AccountInfoController = AccountInfoController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC1pbmZvLmpzIiwic291cmNlUm9vdCI6IkQ6L+W3peS9nC9mcmVlbG9nLXBheS1zZXJ2aWNlL3NyYy8iLCJzb3VyY2VzIjpbImNvbnRyb2xsZXIvYWNjb3VudC1pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1EQUFnRjtBQUNoRix1REFBMkc7QUFDM0csb0NBQW9DO0FBQ3BDLGtDQUF3QztBQUN4Qyw2REFBdUQ7QUFDdkQsZ0VBQTBEO0FBSTFELElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBUzlCLE9BQU87SUFHUCxLQUFLLENBQUMsaUJBQWlCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsc0JBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzdHLENBQUM7SUFFRCxPQUFPO0lBR1AsS0FBSyxDQUFDLHFCQUFxQjtRQUN2QixNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25CLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3ZFLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVyQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxzQkFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVELE9BQU87SUFFUCxLQUFLLENBQUMsZUFBZTtRQUNqQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ3JCLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FB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