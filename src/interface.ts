import {EachMessagePayload} from 'kafkajs';
import {AccountInfo, TransactionStatusEnum} from '.';

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
    // 授权类型,个人账户一般通过密码授权,合约账户一般通过私钥签名授权(合约保存私钥信息,账户这边password保存公钥信息,组成一组秘钥对)
    authorizationType?: 'password' | 'privateKey'
    // 操作者
    operatorId?: string;
    // 操作者姓名
    operatorName?: string;
    // 错误消息
    message?: string;
}

export interface IKafkaSubscribeMessageHandle {

    subscribeTopicName: string;

    consumerGroupId: string;

    messageHandle(payload: EachMessagePayload): Promise<void>;
}
