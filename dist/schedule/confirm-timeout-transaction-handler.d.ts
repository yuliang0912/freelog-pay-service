import { FreelogContext } from 'egg-freelog-base';
import { CommonSchedule } from '@midwayjs/decorator';
import { TransactionCoreService } from '../transaction-core-service';
import { Repository, TransactionRecordInfo } from '../index';
export declare class ConfirmTimeoutTransactionHandler implements CommonSchedule {
    transactionCoreService: TransactionCoreService;
    transactionRecordRepository: Repository<TransactionRecordInfo>;
    exec(ctx: FreelogContext): Promise<void>;
    static get scheduleOptions(): {
        cron: string;
        type: string;
        immediate: boolean;
        disable: boolean;
    };
}
