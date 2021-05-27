import { EachBatchPayload } from 'kafkajs';
import { AccountInfo, TransactionStatusEnum } from '.';
/**
 * 节点信息
 */
export interface NodeInfo {
    nodeId: number;
    nodeName: string;
    nodeDomain: string;
    ownerUserId: number;
    ownerUserName: string;
}
/**
 * 用户信息
 */
export interface UserInfo {
    userId: number;
    username: string;
}
/**
 * 合约交易信息
 */
export interface ContractTransactionInfo {
    contractId: string;
    eventId: string;
    subjectType: number;
    contractName: string;
    signText?: string;
    signature?: string;
    remark?: string;
    transactionStatus: TransactionStatusEnum;
    fromAccount: AccountInfo;
    toAccount: AccountInfo;
    transactionAmount: number;
    password?: string;
}
export interface TransactionAttachInfo {
    [key: string]: any;
}
export interface TransactionAuthorizationResult {
    /**
     * 是否授权
     */
    isAuth: boolean;
    authorizationType?: 'password' | 'privateKey';
    operatorId?: string;
    operatorName?: string;
    message?: string;
}
export interface IKafkaSubscribeMessageHandle {
    subscribeTopicName: string;
    consumerGroupId: string;
    messageHandle(payload: EachBatchPayload): Promise<void>;
}
