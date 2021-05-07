import {IPipelineContext, IValveHandler} from '@midwayjs/core';
import {Inject, Provide, Scope, ScopeEnum} from '@midwayjs/decorator';
import {AccountInfo, AccountTypeEnum, TransactionAuthorizationResult, UserInfo} from '..';
import {ApplicationError, AuthorizationError} from 'egg-freelog-base';
import {AccountHelper} from '../extend/account-helper';
import {RsaHelper} from '../extend/rsa-helper';

@Provide()
@Scope(ScopeEnum.Singleton)
export class TransactionAuthorizationHandler implements IValveHandler {

    @Inject()
    rsaHelper: RsaHelper;
    @Inject()
    accountHelper: AccountHelper;

    alias = 'transactionAuthorizationHandler';

    /**
     * 此处只对交易的授权做检查即可.
     * @param ctx
     */
    invoke(ctx: IPipelineContext): Promise<TransactionAuthorizationResult> {

        let transactionAuthorizationResult: TransactionAuthorizationResult = {isAuth: false};
        const {userInfo, fromAccount, password, signText, signature} = ctx.args;

        try {
            switch (fromAccount?.accountType) {
                case AccountTypeEnum.IndividualAccount:
                    transactionAuthorizationResult = this.individualAccountAuthorizationCheck(userInfo, fromAccount, password);
                    break;
                case AccountTypeEnum.ContractAccount:
                    transactionAuthorizationResult = this.contractAccountAuthorizationCheck(fromAccount, signText, signature);
                    break;
                case AccountTypeEnum.OrganizationAccount:
                    transactionAuthorizationResult = this.organizationAccountAuthorizationCheck(fromAccount, signText, signature);
                    break;
                default:
                    transactionAuthorizationResult.message = '不支持的交易类型';
                    break;
            }
        } catch (e) {
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
    individualAccountAuthorizationCheck(userInfo: UserInfo, fromAccount: AccountInfo, password: string): TransactionAuthorizationResult {
        if (fromAccount.accountType !== AccountTypeEnum.IndividualAccount) {
            throw new AuthorizationError('账户类型校验不通过,未能获得授权');
        }
        if (fromAccount.ownerUserId !== userInfo?.userId) {
            throw new AuthorizationError('登录用户没有执行操作的权限');
        }
        if (fromAccount.status === 0) {
            throw new ApplicationError('交易账号尚未激活,无法发起交易');
        }
        const isVerifySuccessful = this.accountHelper.verifyAccountPassword(fromAccount, password);
        if (!isVerifySuccessful) {
            throw new AuthorizationError('交易密码校验失败');
        }
        if (fromAccount.status === 2) {
            throw new ApplicationError('交易账号已被冻结,无法发起交易');
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
    contractAccountAuthorizationCheck(contractAccount: AccountInfo, signText: string, signature: string): TransactionAuthorizationResult {

        if (contractAccount.accountType !== AccountTypeEnum.ContractAccount) {
            throw new AuthorizationError('账户类型校验不通过,未能获得授权');
        }
        const pubicKey = this.accountHelper.decryptPublicKey(contractAccount.password);
        const nodeRsaHelper = this.rsaHelper.build(pubicKey);
        if (!nodeRsaHelper.verifySign(signText, signature)) {
            throw new AuthorizationError('签名数据校验失败');
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
    organizationAccountAuthorizationCheck(organizationAccount: AccountInfo, signText: string, signature: string): TransactionAuthorizationResult {

        if (organizationAccount.accountType !== AccountTypeEnum.OrganizationAccount) {
            throw new AuthorizationError('账户类型校验不通过,未能获得授权');
        }
        const pubicKey = this.accountHelper.decryptPublicKey(organizationAccount.password);
        const nodeRsaHelper = this.rsaHelper.build(pubicKey);
        if (!nodeRsaHelper.verifySign(signText, signature)) {
            throw new AuthorizationError('签名数据校验失败');
        }

        // password为公钥,然后用公钥进行数据校验.合约账户与合约服务各持有一把秘钥.每次数据交换都需要相互校验
        return {
            isAuth: true,
            authorizationType: 'privateKey',
            operatorId: organizationAccount.ownerId,
            operatorName: organizationAccount.ownerName
        };
    }
}
