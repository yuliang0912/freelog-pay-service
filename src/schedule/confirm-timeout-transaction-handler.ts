import {FreelogContext} from 'egg-freelog-base';
import {CommonSchedule, Inject, Provide, Schedule} from '@midwayjs/decorator';
import {TransactionCoreService} from '../transaction-core-service';
import {InjectEntityModel, Repository, TransactionRecordInfo, TransactionStatusEnum} from '../index';
import {LessThanOrEqual} from 'typeorm';

@Provide()
@Schedule(ConfirmTimeoutTransactionHandler.scheduleOptions)
export class ConfirmTimeoutTransactionHandler implements CommonSchedule {

    @Inject()
    transactionCoreService: TransactionCoreService;
    @InjectEntityModel(TransactionRecordInfo)
    transactionRecordRepository: Repository<TransactionRecordInfo>;

    async exec(ctx: FreelogContext) {
        const confirmTimeoutRecords = await this.transactionRecordRepository.find({
            where: {
                status: TransactionStatusEnum.ToBeConfirmation,
                confirmTimeoutDate: LessThanOrEqual(new Date())
            }
        });
        for (const confirmTimeoutRecord of confirmTimeoutRecords) {
            await this.transactionCoreService.contractPaymentConfirmCanceledHandle(confirmTimeoutRecord);
        }
    }

    static get scheduleOptions() {
        return {
            cron: '0 */10 * * * *',
            type: 'worker',
            immediate: false, // 启动时是否立即执行一次
            disable: false
        };
    }
}
