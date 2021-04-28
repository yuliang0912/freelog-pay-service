import { IPipelineContext, IValveHandler } from '@midwayjs/core';
import { AccountInfo, ContractTransactionInfo, TransactionAuthorizationResult, UserInfo } from '..';
import { AccountHelper } from "../extend/account-helper";
import { RsaHelper } from "../extend/rsa-helper";
export declare class TransactionAuthorizationHandler implements IValveHandler {
    accountHelper: AccountHelper;
    rsaHelper: RsaHelper;
    alias: string;
    /**
     * 此处只对交易的授权做检查即可.
     * @param ctx
     */
    invoke(ctx: IPipelineContext): Promise<TransactionAuthorizationResult>;
    /**
     * 个人账号授权检查
     * @param userInfo
     * @param fromAccount
     * @param password
     */
    individualAccountAuthorizationCheck(userInfo: UserInfo, fromAccount: AccountInfo, password: number): TransactionAuthorizationResult;
    /**
     * 合同授权检查(合同的交易发出方需要对请求的数据进行签名,然后合约服务会使用公钥对签名进行校验)
     * @param contractInfo
     * @param fromAccount
     */
    contractAccountAuthorizationCheck(contractInfo: ContractTransactionInfo, fromAccount: AccountInfo): TransactionAuthorizationResult;
}
