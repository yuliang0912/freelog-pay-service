import { FreelogContext } from 'egg-freelog-base';
import { AccountService } from '../service/account-service';
import { TransactionService } from '../service/transaction-service';
export declare class TransactionInfoController {
    ctx: FreelogContext;
    accountService: AccountService;
    transactionService: TransactionService;
    myTransactionDetails(): Promise<import("egg-freelog-base").PageResult<import("..").TransactionRecordInfo>>;
    transactionDetails(): Promise<import("egg-freelog-base").PageResult<import("..").TransactionRecordInfo>>;
    transfer(): Promise<import("..").TransactionDetailInfo>;
    contractPayment(): Promise<import("..").TransactionDetailInfo>;
    contractPaymentConfirmed(): Promise<unknown>;
    transactionRecordDetail(): Promise<import("..").TransactionRecordInfo>;
    organizationTransfer(): Promise<import("..").TransactionDetailInfo>;
    testTokenTransfer(): Promise<{
        signature: string;
    }>;
}
