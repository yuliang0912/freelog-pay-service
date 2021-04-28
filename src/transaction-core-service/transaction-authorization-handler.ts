import {IPipelineContext, IValveHandler} from '@midwayjs/core'
import {Inject, Provide, Scope, ScopeEnum} from '@midwayjs/decorator';
import {AccountInfo, AccountTypeEnum, ContractTransactionInfo, TransactionAuthorizationResult, UserInfo} from '..';
import {AuthorizationError} from 'egg-freelog-base';
import {AccountHelper} from "../extend/account-helper";
import {RsaHelper} from "../extend/rsa-helper";

@Provide()
@Scope(ScopeEnum.Singleton)
export class TransactionAuthorizationHandler implements IValveHandler {

    @Inject()
    accountHelper: AccountHelper;
    @Inject()
    rsaHelper: RsaHelper;

    alias = 'transactionAuthorizationHandler';

    /**
     * 此处只对交易的授权做检查即可.
     * @param ctx
     */
    invoke(ctx: IPipelineContext): Promise<TransactionAuthorizationResult> {

        let transactionAuthorizationResult: TransactionAuthorizationResult = {isAuth: false};
        const {userInfo, contractInfo, fromAccount, password} = ctx.args;

        try {
            switch (fromAccount?.accountType) {
                case AccountTypeEnum.IndividualAccount:
                    transactionAuthorizationResult = this.individualAccountAuthorizationCheck(userInfo, fromAccount, password);
                    break;
                case AccountTypeEnum.ContractAccount:
                    transactionAuthorizationResult = this.contractAccountAuthorizationCheck(contractInfo, fromAccount);
                    break;
                default:
                    transactionAuthorizationResult.message = '不支持的交易类型';
                    break;
            }
        } catch (e) {
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
    individualAccountAuthorizationCheck(userInfo: UserInfo, fromAccount: AccountInfo, password: number): TransactionAuthorizationResult {
        if (fromAccount.accountType !== AccountTypeEnum.IndividualAccount) {
            throw new AuthorizationError('账户类型校验不通过,未能获得授权');
        }
        if (fromAccount.ownerUserId !== userInfo?.userId) {
            throw new AuthorizationError('登录用户没有执行操作的权限');
        }
        const isVerifySuccessful = this.accountHelper.verifyAccountPassword(fromAccount, password);
        if (!isVerifySuccessful) {
            throw new AuthorizationError('交易密码校验失败');
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
    contractAccountAuthorizationCheck(contractInfo: ContractTransactionInfo, fromAccount: AccountInfo): TransactionAuthorizationResult {

        if (fromAccount.accountType !== AccountTypeEnum.ContractAccount) {
            throw new AuthorizationError('账户类型校验不通过,未能获得授权');
        }
        if (fromAccount.ownerId === contractInfo.contractId) {
            throw new AuthorizationError('没有执行操作的权限');
        }

        const pubicKey = this.accountHelper.decryptPublicKey(fromAccount.password);
        const nodeRsaHelper = this.rsaHelper.build(pubicKey);
        if (!nodeRsaHelper.verifySign(contractInfo.signText, contractInfo.signature)) {
            throw new AuthorizationError('签名数据校验失败');
        }

        // 合约服务的password为公钥,然后用公钥进行数据校验.合约账户与合约服务各持有一把秘钥.每次数据交换都需要相互校验
        return {
            isAuth: true,
            authorizationType: 'privateKey',
            operatorId: contractInfo.contractId,
            operatorName: contractInfo.contractName
        };
    }
}
