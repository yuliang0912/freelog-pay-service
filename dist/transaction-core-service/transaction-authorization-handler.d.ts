import { IPipelineContext, IValveHandler } from '@midwayjs/core';
import { AccountInfo, TransactionAuthorizationResult, UserInfo } from '..';
import { AccountHelper } from '../extend/account-helper';
import { RsaHelper } from '../extend/rsa-helper';
export declare class TransactionAuthorizationHandler implements IValveHandler {
    rsaHelper: RsaHelper;
    accountHelper: AccountHelper;
    alias: string;
    private accountAuthorizationHandler;
    constructor();
    /**
     * 此处只对交易的授权做检查即可.
     * @param ctx
     */
    invoke(ctx: IPipelineContext): Promise<TransactionAuthorizationResult>;
    /**
     * 个人账号授权检查
     * @param args
     */
    individualAccountAuthorizationCheck(args: {
        userInfo: UserInfo;
        fromAccount: AccountInfo;
        password: string;
    }): TransactionAuthorizationResult;
    /**
     * 合同授权检查(合同的交易发出方需要对请求的数据进行签名,然后合约服务会使用公钥对签名进行校验)
     * @param args
     */
    contractAccountAuthorizationCheck(args: {
        fromAccount: AccountInfo;
        signText: string;
        signature: string;
    }): TransactionAuthorizationResult;
    /**
     * 组织账户授权检查(组织账号交易发出方需要对请求的数据进行签名,然后合约服务会使用公钥对签名进行校验)
     * @param args
     */
    organizationAccountAuthorizationCheck(args: {
        fromAccount: AccountInfo;
        signText: string;
        signature: string;
    }): TransactionAuthorizationResult;
}
