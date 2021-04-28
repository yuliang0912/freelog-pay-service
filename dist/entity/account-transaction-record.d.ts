/// <reference types="lodash" />
import { AccountTypeEnum, TransactionStatusEnum, TransactionTypeEnum } from '../enum';
/**
 * 交易操作记录信息,一次交易对应一条记录,一条记录一般对应两条流水
 */
export declare class TransactionRecordInfo {
    /**
     * 记录ID(雪花算法)
     */
    recordId: string;
    /**
     * 账户ID
     */
    accountId: number;
    /**
     * 账户所属类型(1:用户账户 2:节点账户 3:合约账户)
     */
    accountType: AccountTypeEnum;
    /**
     * 账户名
     */
    accountName: string;
    /**
     * 对方账户ID
     */
    reciprocalAccountId: number;
    /**
     * 账户所属人类型(1:用户账户 2:节点账户 3:合约账户)
     */
    reciprocalAccountType: AccountTypeEnum;
    /**
     * 对方账户名
     */
    reciprocalAccountName: string;
    /**
     * 交易金额
     */
    transactionAmount: number;
    /**
     * 交易类型
     */
    transactionType: TransactionTypeEnum;
    /**
     * 摘要JSON
     */
    attachInfo: object;
    /**
     * 备注
     */
    remark: string;
    /**
     * 加密盐值
     */
    saltValue: string;
    /**
     * 数据签名
     */
    signature: string;
    /**
     * 操作者ID(uid或contractId)
     */
    operatorId: string;
    /**
     * 操作者Name(username或contractName)
     */
    operatorName: string;
    /**
     * 授权方式(密码授权,密钥签名授权等)
     */
    authorizationType: string;
    /**
     * 创建时间
     */
    createDate: Date;
    /**
     * 更新时间
     */
    updateDate: Date;
    /**
     * 交易确认超时时间(如果没有服务对交易进行确认,则系统自动取消)
     */
    confirmTimeoutDate: Date;
    /**
     * 状态 1:交易确认中 2:交易成功 3:交易取消 4:交易失败
     */
    status: TransactionStatusEnum;
    /**
     * 自定义序列化
     */
    toJSON(this: TransactionRecordInfo): import("lodash").Omit<TransactionRecordInfo, "saltValue" | "signature">;
}
