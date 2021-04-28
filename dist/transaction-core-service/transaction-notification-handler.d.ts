import { IPipelineContext, IValveHandler } from '@midwayjs/core';
import { TransactionDetailInfo } from '..';
import { KafkaClient } from '../kafka/client';
export declare class TransactionNotificationHandler implements IValveHandler {
    kafkaClient: KafkaClient;
    alias: string;
    /**
     * 消息通知
     * @param ctx
     */
    invoke(ctx: IPipelineContext): Promise<TransactionDetailInfo[]>;
    /**
     * 待确认的合约支付消息通知
     * @param transactionDetail
     */
    toBeConfirmedContractPaymentMessageNotificationHandle(transactionDetail: TransactionDetailInfo): Promise<void>;
}
