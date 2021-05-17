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
exports.TransactionAuthorizationHandler = void 0;
const decorator_1 = require("@midwayjs/decorator");
const __1 = require("..");
const egg_freelog_base_1 = require("egg-freelog-base");
const account_helper_1 = require("../extend/account-helper");
const rsa_helper_1 = require("../extend/rsa-helper");
let TransactionAuthorizationHandler = class TransactionAuthorizationHandler {
    constructor() {
        this.alias = 'transactionAuthorizationHandler';
        this.accountAuthorizationHandler = new Map();
        this.accountAuthorizationHandler.set(__1.AccountTypeEnum.IndividualAccount, this.individualAccountAuthorizationCheck);
        this.accountAuthorizationHandler.set(__1.AccountTypeEnum.ContractAccount, this.contractAccountAuthorizationCheck);
        this.accountAuthorizationHandler.set(__1.AccountTypeEnum.OrganizationAccount, this.organizationAccountAuthorizationCheck);
    }
    /**
     * 此处只对交易的授权做检查即可.
     * @param ctx
     */
    invoke(ctx) {
        let transactionAuthorizationResult = { isAuth: false };
        const { fromAccount } = ctx.args;
        try {
            if (this.accountAuthorizationHandler.has(fromAccount?.accountType)) {
                transactionAuthorizationResult = this.accountAuthorizationHandler.get(fromAccount.accountType).call(this, ctx.args);
            }
            else {
                transactionAuthorizationResult.message = '不支持的交易类型';
            }
        }
        catch (e) {
            transactionAuthorizationResult.isAuth = false;
            transactionAuthorizationResult.message = e.message.toString();
        }
        if (!transactionAuthorizationResult.isAuth) {
            return Promise.reject(transactionAuthorizationResult.message);
        }
        return Promise.resolve(transactionAuthorizationResult);
    }
    /**
     * 个人账号授权检查
     * @param args
     */
    individualAccountAuthorizationCheck(args) {
        const { fromAccount, userInfo, password } = args;
        if (fromAccount.accountType !== __1.AccountTypeEnum.IndividualAccount) {
            throw new egg_freelog_base_1.AuthorizationError('账户类型校验不通过,未能获得授权');
        }
        if (!userInfo?.userId) {
            throw new egg_freelog_base_1.AuthenticationError('认证错误,请登录后再试');
        }
        if (fromAccount.ownerUserId !== userInfo.userId) {
            throw new egg_freelog_base_1.AuthorizationError('登录用户没有执行操作的权限');
        }
        if (fromAccount.status === 0) {
            throw new egg_freelog_base_1.ApplicationError('交易账号尚未激活,无法发起交易');
        }
        const isVerifySuccessful = this.accountHelper.verifyAccountPassword(fromAccount, password);
        if (!isVerifySuccessful) {
            throw new egg_freelog_base_1.AuthorizationError('交易密码错误');
        }
        if (fromAccount.status === 2) {
            throw new egg_freelog_base_1.ApplicationError('交易账号已被冻结,无法发起交易');
        }
        return {
            isAuth: true,
            authorizationType: 'password',
            operatorId: userInfo.userId.toString(),
            operatorName: userInfo.username
        };
    }
    /**
     * 合同授权检查(合同的交易发出方需要对请求的数据进行签名,然后合约服务会使用公钥对签名进行校验)
     * @param args
     */
    contractAccountAuthorizationCheck(args) {
        const { fromAccount, signText, signature } = args;
        if (fromAccount.accountType !== __1.AccountTypeEnum.ContractAccount) {
            throw new egg_freelog_base_1.AuthorizationError('账户类型校验不通过,未能获得授权');
        }
        const pubicKey = this.accountHelper.decryptPublicKey(fromAccount.password);
        const nodeRsaHelper = this.rsaHelper.build(pubicKey);
        if (!nodeRsaHelper.verifySign(signText, signature)) {
            throw new egg_freelog_base_1.AuthorizationError('签名数据校验失败');
        }
        // password为公钥,然后用公钥进行数据校验.合约账户与合约服务各持有一把秘钥.每次数据交换都需要相互校验
        return {
            isAuth: true,
            authorizationType: 'privateKey',
            operatorId: fromAccount.ownerId,
            operatorName: fromAccount.ownerName
        };
    }
    /**
     * 合同授权检查(合同的交易发出方需要对请求的数据进行签名,然后合约服务会使用公钥对签名进行校验)
     * @param args
     */
    organizationAccountAuthorizationCheck(args) {
        const { fromAccount, signText, signature } = args;
        if (fromAccount.accountType !== __1.AccountTypeEnum.OrganizationAccount) {
            throw new egg_freelog_base_1.AuthorizationError('账户类型校验不通过,未能获得授权');
        }
        const pubicKey = this.accountHelper.decryptPublicKey(fromAccount.password);
        const nodeRsaHelper = this.rsaHelper.build(pubicKey);
        if (!nodeRsaHelper.verifySign(signText, signature)) {
            throw new egg_freelog_base_1.AuthorizationError('签名数据校验失败');
        }
        // password为公钥,然后用公钥进行数据校验.合约账户与合约服务各持有一把秘钥.每次数据交换都需要相互校验
        return {
            isAuth: true,
            authorizationType: 'privateKey',
            operatorId: fromAccount.ownerId,
            operatorName: fromAccount.ownerName
        };
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", rsa_helper_1.RsaHelper)
], TransactionAuthorizationHandler.prototype, "rsaHelper", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", account_helper_1.AccountHelper)
], TransactionAuthorizationHandler.prototype, "accountHelper", void 0);
TransactionAuthorizationHandler = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton),
    __metadata("design:paramtypes", [])
], TransactionAuthorizationHandler);
exports.TransactionAuthorizationHandler = TransactionAuthorizationHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tYXV0aG9yaXphdGlvbi1oYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IkQ6L+W3peS9nC9mcmVlbG9nLXBheS1zZXJ2aWNlL3NyYy8iLCJzb3VyY2VzIjpbInRyYW5zYWN0aW9uLWNvcmUtc2VydmljZS90cmFuc2FjdGlvbi1hdXRob3JpemF0aW9uLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQXNFO0FBQ3RFLDBCQUEwRjtBQUMxRix1REFBMkY7QUFDM0YsNkRBQXVEO0FBQ3ZELHFEQUErQztBQUkvQyxJQUFhLCtCQUErQixHQUE1QyxNQUFhLCtCQUErQjtJQVV4QztRQUhBLFVBQUssR0FBRyxpQ0FBaUMsQ0FBQztRQUNsQyxnQ0FBMkIsR0FBRyxJQUFJLEdBQUcsRUFBZ0UsQ0FBQztRQUcxRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDLG1CQUFlLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDbEgsSUFBSSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsQ0FBQyxtQkFBZSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUM5RyxJQUFJLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDLG1CQUFlLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7SUFDMUgsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxHQUFxQjtRQUV4QixJQUFJLDhCQUE4QixHQUFtQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQztRQUNyRixNQUFNLEVBQUMsV0FBVyxFQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztRQUUvQixJQUFJO1lBQ0EsSUFBSSxJQUFJLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsRUFBRTtnQkFDaEUsOEJBQThCLEdBQUcs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