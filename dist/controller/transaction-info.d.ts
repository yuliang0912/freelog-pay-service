import { FreelogContext } from 'egg-freelog-base';
import { AccountService } from '../service/account-service';
import { TransactionService } from '../service/transaction-service';
import { RsaHelper } from '../extend/rsa-helper';
import { AccountHelper } from '../extend/account-helper';
export declare class TransactionInfoController {
    ctx: FreelogContext;
    rsaHelper: RsaHelper;
    accountHelper: AccountHelper;
    accountService: AccountService;
    transactionService: TransactionService;
    /**
     * 交易流水记录
     */
    myTransactionDetails(): Promise<import("egg-freelog-base").PageResult<import("..").TransactionRecordInfo>>;
    /**
     * 交易流水记录
     */
    transactionDetails(): Promise<import("egg-freelog-base").PageResult<import("..").TransactionRecordInfo>>;
    /**
     * 个人账户转账
     */
    transfer(): Promise<import("..").TransactionDetailInfo>;
    /**
     * 合约支付(需要合约服务确认之后才会真实扣款)
     */
    contractPayment(): Promise<import("..").TransactionDetailInfo>;
    /**
     * 合约支付结果确认(测试使用的接口.可以删除)
     */
    contractPaymentConfirmed(): Promise<unknown>;
    /**
     * 查询交易记录详情
     */
    transactionRecordDetail(): Promise<import("..").TransactionRecordInfo>;
    /**
     * 组织账户转账
     */
    organizationTransfer(): Promise<import("..").TransactionDetailInfo>;
    /**
     * 测试代币领取
     */
    testTokenTransfer(): Promise<{
        signature: string;
    }>;
}
