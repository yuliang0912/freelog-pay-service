import {Inject, Provide, Scope, ScopeEnum} from '@midwayjs/decorator';
import {EachBatchPayload} from 'kafkajs';
import {IKafkaSubscribeMessageHandle, TransactionRecordInfo, TransactionStatusEnum} from '..';
import {TransactionCoreService} from '../transaction-core-service';
import {InjectEntityModel, Repository} from '../index';

@Provide()
@Scope(ScopeEnum.Singleton)
export class ContractPaymentConfirmResultHandle implements IKafkaSubscribeMessageHandle {

    @Inject()
    transactionCoreService: TransactionCoreService;
    @InjectEntityModel(TransactionRecordInfo)
    transactionRecordRepository: Repository<TransactionRecordInfo>;

    consumerGroupId = 'freelog-pay-service#contract-payment-confirm-result-handle-group';
    subscribeTopicName = 'contract-payment-confirm-result-topic';

    constructor() {
        this.messageHandle = this.messageHandle.bind(this);
    }

    /**
     * 合约支付确认结果处理
     * @param payload
     */
    async messageHandle(payload: EachBatchPayload): Promise<void> {
        const {batch, resolveOffset, heartbeat} = payload;
        for (let message of batch.messages) {

            const eventInfo = JSON.parse(message.value.toString());
            console.log('接收到合约支付结果确认事件' + JSON.stringify(eventInfo));

            const transactionRecord = await this.transactionRecordRepository.findOne(eventInfo.transactionRecordId);
            if (!transactionRecord || transactionRecord.status !== TransactionStatusEnum.ToBeConfirmation) {
                // .... 容错处理
                resolveOffset(message.offset);
                continue;
            }

            let handler = null;
            switch (eventInfo.transactionStatus) {
                case TransactionStatusEnum.Completed:
                    const attachInfo = Object.assign({}, transactionRecord.attachInfo, {stateId: eventInfo.stateId});
                    handler = this.transactionCoreService.contractPaymentConfirmCompletedHandle(transactionRecord, attachInfo);
                    break;
                case TransactionStatusEnum.Closed:
                    handler = this.transactionCoreService.contractPaymentConfirmCanceledHandle(transactionRecord);
                    break;
                default:
                    console.log('错误的数据格式');
                    return;
            }
            await handler.then(() => {
                resolveOffset(message.offset);
            });
        }
        await heartbeat();
    }
}
