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
        const { userInfo, contractInfo, fromAccount, password } = ctx.args;
        try {
            switch (fromAccount?.accountType) {
                case __1.AccountTypeEnum.IndividualAccount:
                    transactionAuthorizationResult = this.individualAccountAuthorizationCheck(userInfo, fromAccount, password);
                    break;
                case __1.AccountTypeEnum.ContractAccount:
                    transactionAuthorizationResult = this.contractAccountAuthorizationCheck(contractInfo, fromAccount);
                    break;
                default:
                    transactionAuthorizationResult.message = '不支持的交易类型';
                    break;
            }
        }
        catch (e) {
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
        const isVerifySuccessful = this.accountHelper.verifyAccountPassword(fromAccount, password);
        if (!isVerifySuccessful) {
            throw new egg_freelog_base_1.AuthorizationError('交易密码校验失败');
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
     * @param contractInfo
     * @param fromAccount
     */
    contractAccountAuthorizationCheck(contractInfo, fromAccount) {
        if (fromAccount.accountType !== __1.AccountTypeEnum.ContractAccount) {
            throw new egg_freelog_base_1.AuthorizationError('账户类型校验不通过,未能获得授权');
        }
        if (fromAccount.ownerId === contractInfo.contractId) {
            throw new egg_freelog_base_1.AuthorizationError('没有执行操作的权限');
        }
        const pubicKey = this.accountHelper.decryptPublicKey(fromAccount.password);
        const nodeRsaHelper = this.rsaHelper.build(pubicKey);
        if (!nodeRsaHelper.verifySign(contractInfo.signText, contractInfo.signature)) {
            throw new egg_freelog_base_1.AuthorizationError('签名数据校验失败');
        }
        // 合约服务的password为公钥,然后用公钥进行数据校验.合约账户与合约服务各持有一把秘钥.每次数据交换都需要相互校验
        return {
            isAuth: true,
            authorizationType: 'privateKey',
            operatorId: contractInfo.contractId,
            operatorName: contractInfo.contractName
        };
    }
};
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", account_helper_1.AccountHelper)
], TransactionAuthorizationHandler.prototype, "accountHelper", void 0);
__decorate([
    decorator_1.Inject(),
    __metadata("design:type", rsa_helper_1.RsaHelper)
], TransactionAuthorizationHandler.prototype, "rsaHelper", void 0);
TransactionAuthorizationHandler = __decorate([
    decorator_1.Provide(),
    decorator_1.Scope(decorator_1.ScopeEnum.Singleton)
], TransactionAuthorizationHandler);
exports.TransactionAuthorizationHandler = TransactionAuthorizationHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24tYXV0aG9yaXphdGlvbi1oYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RyYW5zYWN0aW9uLWNvcmUtc2VydmljZS90cmFuc2FjdGlvbi1hdXRob3JpemF0aW9uLWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQXNFO0FBQ3RFLDBCQUFtSDtBQUNuSCx1REFBb0Q7QUFDcEQsNkRBQXVEO0FBQ3ZELHFEQUErQztBQUkvQyxJQUFhLCtCQUErQixHQUE1QyxNQUFhLCtCQUErQjtJQUE1QztRQU9JLFVBQUssR0FBRyxpQ0FBaUMsQ0FBQztJQW1GOUMsQ0FBQztJQWpGRzs7O09BR0c7SUFDSCxNQUFNLENBQUMsR0FBcUI7UUFFeEIsSUFBSSw4QkFBOEIsR0FBbUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDckYsTUFBTSxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFFakUsSUFBSTtZQUNBLFFBQVEsV0FBVyxFQUFFLFdBQVcsRUFBRTtnQkFDOUIsS0FBSyxtQkFBZSxDQUFDLGlCQUFpQjtvQkFDbEMsOEJBQThCLEdBQUcsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQzNHLE1BQU07Z0JBQ1YsS0FBSyxtQkFBZSxDQUFDLGVBQWU7b0JBQ2hDLDhCQUE4QixHQUFHLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7b0JBQ25HLE1BQU07Z0JBQ1Y7b0JBQ0ksOEJBQThCLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztvQkFDcEQsTUFBTTthQUNiO1NBQ0o7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNqRTtRQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILG1DQUFtQyxDQUFDLFFBQWtCLEVBQUUsV0FBd0IsRUFBRSxRQUFnQjtRQUM5RixJQUFJLFdBQVcsQ0FBQyxXQUFXLEtBQUssbUJBQWUsQ0FBQyxpQkFBaUIsRUFBRTtZQUMvRCxNQUFNLElBQUkscUNBQWtCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUNwRDtRQUNELElBQUksV0FBVyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUUsTUFBTSxFQUFFO1lBQzlDLE1BQU0sSUFBSSxxQ0FBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNqRDtRQUNELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0YsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ3JCLE1BQU0sSUFBSSxxQ0FBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM1QztRQUNELE9BQU87WUFDSCxNQUFNLEVBQUUsSUFBSTtZQUNaLGlCQUFpQixFQUFFLFVBQVU7WUFDN0IsVUFBVSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ3RDLFlBQVksRUFBRSxRQUFRLENBQUMsUUFBUTtTQUNsQyxDQUFDO0lBQ04sQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxpQ0FBaUMsQ0FBQyxZQUFxQyxFQUFFLFdBQXdCO1FBRTdGLElBQUksV0FBVyxDQUFDLFdBQVcsS0FBSyxtQkFBZSxDQUFDLGVBQWUsRUFBRTtZQUM3RCxNQUFNLElBQUkscUNBQWtCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUNwRDtRQUNELElBQUksV0FBVyxDQUFDLE9BQU8sS0FBSyxZQUFZLENBQUMsVUFBVSxFQUFFO1lBQ2pELE1BQU0sSUFBSSxxQ0FBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUM3QztRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzFFLE1BQU0sSUFBSSxxQ0FBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM1QztRQUVELDhEQUE4RDtRQUM5RCxPQUFPO1lBQ0gsTUFBTSxFQUFFLElBQUk7WUFDWixpQkFBaUIsRUFBRSxZQUFZO1lBQy9CLFVBQVUsRUFBRSxZQUFZLENBQUMsVUFBVTtZQUNuQyxZQUFZLEVBQUUsWUFBWSxDQUFDLFlBQVk7U0FDMUMsQ0FBQztJQUNOLENBQUM7Q0FDSixDQUFBO0FBdkZHO0lBREMsa0JBQU0sRUFBRTs4QkFDTSw4QkFBYTtzRUFBQztBQUU3QjtJQURDLGtCQUFNLEVBQUU7OEJBQ0Usc0JBQVM7a0VBQUM7QUFMWiwrQkFBK0I7SUFGM0MsbUJBQU8sRUFBRTtJQUNULGlCQUFLLENBQUMscUJBQVMsQ0FBQyxTQUFTLENBQUM7R0FDZCwrQkFBK0IsQ0EwRjNDO0FBMUZZLDBFQUErQiJ9