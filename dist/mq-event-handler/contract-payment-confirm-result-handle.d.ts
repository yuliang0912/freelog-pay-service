import { EachMessagePayload } from 'kafkajs';
import { IKafkaSubscribeMessageHandle, TransactionRecordInfo } from '..';
import { TransactionCoreService } from '../transaction-core-service';
import { Repository } from '../index';
export declare class ContractPaymentConfirmResultHandle implements IKafkaSubscribeMessageHandle {
    transactionCoreService: TransactionCoreService;
    transactionRecordRepository: Repository<TransactionRecordInfo>;
    consumerGroupId: string;
    subscribeTopicName: string;
    constructor();
    /**
     * 合约支付确认结果处理
     * @param payload
     */
    messageHandle(payload: EachMessagePayload): Promise<void>;
}
