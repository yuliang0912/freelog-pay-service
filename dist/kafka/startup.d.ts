import { KafkaClient } from './client';
import { ContractPaymentConfirmResultHandle } from '../mq-event-handler/contract-payment-confirm-result-handle';
export declare class KafkaStartup {
    kafkaClient: KafkaClient;
    contractPaymentConfirmResultHandle: ContractPaymentConfirmResultHandle;
    /**
     * 启动,连接kafka-producer,订阅topic
     */
    startUp(): Promise<void>;
    /**
     * 订阅
     */
    subscribeTopics(): Promise<void>;
}
