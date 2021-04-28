import {KafkaClient} from './client';
import {Init, Inject, Provide, Scope, ScopeEnum} from '@midwayjs/decorator';
import {ContractPaymentConfirmResultHandle} from '../mq-event-handler/contract-payment-confirm-result-handle';

@Provide()
@Scope(ScopeEnum.Singleton)
export class KafkaStartup {

    @Inject()
    kafkaClient: KafkaClient;
    @Inject()
    contractPaymentConfirmResultHandle: ContractPaymentConfirmResultHandle;

    /**
     * 启动,连接kafka-producer,订阅topic
     */
    @Init()
    async startUp() {
        await this.subscribeTopics().then(() => {
            console.log('kafka topic 订阅成功!');
        }).catch(error => {
            console.log('kafka topic 订阅失败!', error.toString());
        });
        await this.kafkaClient.producer.connect().catch(error => {
            console.log('kafka producer connect failed,', error);
        });
    }

    /**
     * 订阅
     */
    async subscribeTopics() {
        const topics = [this.contractPaymentConfirmResultHandle];
        return this.kafkaClient.subscribes(topics);
    }
}
