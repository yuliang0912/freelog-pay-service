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
    async individualAccountInfo() {
        const { ctx } = this;
        const ownerUserId = ctx.checkParams('userId').exist().isUserId().toInt().value;
        ctx.validateParams();
        if (ctx.userId !== ownerUserId) {
            throw new egg_freelog_base_1.AuthorizationError(ctx.gettext('user-authorization-failed'));
        }
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
    // 修改交易密码
    async updateAccount() {
        const ctx = this.ctx;
        const oldPassword = ctx.checkBody('oldPassword').exist().isNumeric().len(6, 6).value;
        const password = ctx.checkBody('password').exist().isNumeric().len(6, 6).value;
        ctx.validateParams();
        const accountInfo = await this.accountService.getAccountInfo(this.ctx.userId.toString(), enum_1.AccountTypeEnum.IndividualAccount);
        return this.accountService.updatePassword(accountInfo, oldPassword, password);
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
    decorator_1.Get('/individualAccounts/:userId'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "individualAccountInfo", null);
__decorate([
    decorator_1.Put('/individualAccounts/activate'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "activateAccount", null);
__decorate([
    decorator_1.Put('/individualAccounts'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.LoginUser),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "updateAccount", null);
__decorate([
    decorator_1.Post('/contractAccounts/:contractId'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.InternalClient),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountInfoController.prototype, "createContractAccount", null);
__decorate([
    decorator_1.Post('/organizationAccounts/:organizationId'),
    egg_freelog_base_1.visitorIdentityValidator(egg_freelog_base_1.IdentityTypeEnum.InternalClient),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC1pbmZvLmpzIiwic291cmNlUm9vdCI6IkQ6L+W3peS9nC9mcmVlbG9nLXBheS1zZXJ2aWNlL3NyYy8iLCJzb3VyY2VzIjpbImNvbnRyb2xsZXIvYWNjb3VudC1pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1EQUFnRjtBQUNoRix1REFNMEI7QUFDMUIsb0NBQW9DO0FBQ3BDLGtDQUF3QztBQUN4Qyw2REFBdUQ7QUFDdkQsZ0VBQTBEO0FBSTFELElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBUzlCLE9BQU87SUFHUCxLQUFLLENBQUMscUJBQXFCO1FBQ3ZCLE1BQU0sRUFBQyxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDL0UsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXJCLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxXQUFXLEVBQUU7WUFDNUIsTUFBTSxJQUFJLHFDQUFrQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDO1NBQzFFO1FBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsc0JBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzlGLENBQUM7SUFFRCxPQUFPO0lBR1AsS0FBSyxDQUFDLGVBQWU7UUFDakIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNyQixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3ZFLEdBQUcsQ0FB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