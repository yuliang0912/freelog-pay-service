import {IPipelineContext, IValveHandler} from '@midwayjs/core';
import {Inject, Provide, Scope, ScopeEnum} from '@midwayjs/decorator';
import {TransactionDetailInfo, TransactionHandleTypeEnum} from '..';
import {first} from 'lodash';
import {KafkaClient} from '../kafka/client';

@Provide()
@Scope(ScopeEnum.Singleton)
export class TransactionNotificationHandler implements IValveHandler {

    @Inject()
    kafkaClient: KafkaClient;

    alias = 'transactionNotificationHandler';

    /**
     * 消息通知
     * @param ctx
     */
    async invoke(ctx: IPipelineContext): Promise<TransactionDetailInfo[]> {

        const {transactionHandleType} = ctx.args;
        switch (transactionHandleType as TransactionHandleTypeEnum) {
            case TransactionHandleTypeEnum.ToBeConfirmedContractPayment:
                const transactionDetail = first<TransactionDetailInfo>(ctx.info.prevValue);
                await this.toBeConfirmedContractPaymentMessageNotificationHandle(transactionDetail);
                break;
            case TransactionHandleTypeEnum.ContractPaymentConfirmedSuccessful:
            case TransactionHandleTypeEnum.ContractPaymentTimeOutCancel:
            case TransactionHandleTypeEnum.ContractPaymentConfirmedCancel:
            default:
                break;
        }

        return ctx.info.prevValue;
    }

    /**
     * 待确认的合约支付消息通知
     * @param transactionDetail
     */
    async toBeConfirmedContractPaymentMessageNotificationHandle(transactionDetail: TransactionDetailInfo) {
        const messageBody = {
            contractId: transactionDetail.attachInfo.contractId,
            eventId: transactionDetail.attachInfo.eventId,
            eventTime: transactionDetail.createDate,
            code: 'S201',
            args: {
                transactionRecordId: transactionDetail.transactionRecordId,
                serialNo: transactionDetail.serialNo,
                transactionStatus: transactionDetail.status,
                transactionAmount: transactionDetail.transactionAmount,
            }
        };
        return this.kafkaClient.send({
            topic: 'contract-fsm-event-trigger-topic', acks: -1,
            messages: [{
                key: transactionDetail.attachInfo.contractId,
                value: JSON.stringify(messageBody),
                headers: {signature: ''}
            }]
        }).then(() => console.log('交易确认消息发送成功'));
    }
}
