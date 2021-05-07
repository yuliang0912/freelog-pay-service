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
    }
    /**
     * 此处只对交易的授权做检查即可.
     * @param ctx
     */
    invoke(ctx) {
        let transactionAuthorizationResult = { isAuth: false };
        const { userInfo, fromAccount, password, signText, signature } = ctx.args;
        try {
            switch (fromAccount?.accountType) {
                case __1.AccountTypeEnum.IndividualAccount:
                    transactionAuthorizationResult = this.individualAccountAuthorizationCheck(userInfo, fromAccount, password);
                    break;
                case __1.AccountTypeEnum.ContractAccount:
                    transactionAuthorizationResult = this.contractAccountAuthorizationCheck(fromAccount, signText, signature);
                    break;
                case __1.AccountTypeEnum.OrganizationAccount:
                    transactionAuthorizationResult = this.organizationAccountAuthorizationCheck(fromAccount, signText, signature);
                    break;
                default:
                    transactionAuthorizationResult.message = '不支持的交易类型';
                    break;
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
     * @param userInfo
     * @param fromAccount
     * @param password
     */
    individualAccountAuthorizationCheck(userInfo, fromAccount, password) {
        if (fromAccount.accountType !== __1.AccountTypeEnum.IndividualAccount) {
            throw new egg_freelog_base_1.AuthorizationError('账户类型校验不通过,未能获得授权');
        }
        if (fromAccount.ownerUserId !== userInfo?.userId) {
            throw new egg_freelog_base_1.AuthorizationError('登录用户没有执行操作的权限');
        }
        if (fromAccount.status === 0) {
            throw new egg_freelog_base_1.ApplicationError('交易账号尚未激活,无法发起交易');
        }
        const isVerifySuccessful = this.accountHelper.verifyAccountPassword(fromAccount, password);
        if (!isVerifySuccessful) {
            throw new egg_freelog_base_1.AuthorizationError('交易密码校验失败');
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
     * @param contractAccount
     * @param signText
     * @param signature
     */
    contractAccountAuthorizationCheck(contractAccount, signText, signature) {
        if (contractAccount.accountType !== __1.AccountTypeEnum.ContractAccount) {
            throw new egg_freelog_base_1.AuthorizationError('账户类型校验不通过,未能获得授权');
        }
        const pubicKey = this.accountHelper.decryptPublicKey(contractAccount.password);
        const nodeRsaHelper = this.rsaHelper.build(pubicKey);
        if (!nodeRsaHelper.verifySign(signText, signature)) {
            throw new egg_freelog_base_1.AuthorizationError('签名数据校验失败');
        }
        // password为公钥,然后用公钥进行数据校验.合约账户与合约服务各持有一把秘钥.每次数据交换都需要相互校验
        return {
            isAuth: true,
            authorizationType: 'privateKey',
            operatorId: contractAccount.ownerId,
            operatorName: contractAccount.ownerName
        };
    }
    /**
     * 合同授权检查(合同的交易发出方需要对请求的数据进行签名,然后合约服务会使用公钥对签名进行校验)
     * @param organizationAccount
     * @param signText
     * @param signature
     */
    organizationAccountAuthorizationCheck(organizationAccount, signText, signature) {
        if (organizationAccount.accountType !== __1.AccountTypeEnum.OrganizationAccount) {
            throw new egg_freelog_base_1.AuthorizationError('账户类型校验不通过,未能获得授权');
        }
        const pubicKey = this.accountHelper.decryptPublicKey(organizationAccount.password);
        const nodeRsaHelper = this.rsaHelper.build(pubicKey);
        if (!nodeRsaHelper.verifySign(signText, signature)) {
            throw new egg_freelog_base_1.AuthorizationError('签名数据校验失败');
        }
        // password为公钥,然后用公钥进行数据校验.合约账户与合约服务各持有一把秘钥.每次数据交换都需要相互校验
        return {
            isAuth: true,
            authorizationType: 'privateKey',
            operatorId: organizationAccount.ownerId,
            operatorName: organizationAccount.ownerName
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
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton)
], TransactionAuthorizationHandler);
exports.TransactionAuthorizationHandler = TransactionAuthorizationHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tYXV0aG9yaXphdGlvbi1oYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IkQ6L+W3peS9nC9mcmVlbG9nLXBheS1zZXJ2aWNlL3NyYy8iLCJzb3VyY2VzIjpbInRyYW5zYWN0aW9uLWNvcmUtc2VydmljZS90cmFuc2FjdGlvbi1hdXRob3JpemF0aW9uLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQXNFO0FBQ3RFLDBCQUEwRjtBQUMxRix1REFBc0U7QUFDdEUsNkRBQXVEO0FBQ3ZELHFEQUErQztBQUkvQyxJQUFhLCtCQUErQixHQUE1QyxNQUFhLCtCQUErQjtJQUE1QztRQU9JLFVBQUssR0FBRyxpQ0FBaUMsQ0FBQztJQXVIOUMsQ0FBQztJQXJIRzs7O09BR0c7SUFDSCxNQUFNLENBQUMsR0FBcUI7UUFFeEIsSUFBSSw4QkFBOEIsR0FBbUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDckYsTUFBTSxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBRXhFLElBQUk7WUFDQSxRQUFRLFdBQVcsRUFBRSxXQUFXLEVBQUU7Z0JBQzlCLEtBQUssbUJBQWUsQ0FBQyxpQkFBaUI7b0JBQ2xDLDhCQUE4QixHQUFHLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUMzRyxNQUFNO2dCQUNWLEtBQUssbUJBQWUsQ0FBQyxlQUFlO29CQUNoQyw4QkFBOEIsR0FBRyxJQUFJLENBQUMsaUNBQWlDLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDMUcsTUFBTTtnQkFDVixLQUFLLG1CQUFlLENBQUMsbUJBQW1CO29CQUNwQyw4QkFBOEIsR0FBRyxJQUFJLENBQUMscUNBQXFDLENBQUMsV0FBVyxFQUFFLFFB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