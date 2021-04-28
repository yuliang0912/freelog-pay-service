import { FreelogContext } from 'egg-freelog-base';
import { AccountService } from '../service/account-service';
import { TransactionService } from '../service/transaction-service';
export declare class TransactionInfoController {
    ctx: FreelogContext;
    accountService: AccountService;
    transactionService: TransactionService;
    /**
     * 转账
     */
    transfer(): Promise<import("..").TransactionDetailInfo>;
    /**
     * 合约支付(需要合约服务确认之后才会真实扣款)
     */
    contractPayment(): Promise<import("..").TransactionDetailInfo>;
    /**
     * 合约支付结果确认
     */
    contractPaymentConfirmed(): Promise<unknown>;
}
